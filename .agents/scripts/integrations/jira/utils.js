/**
 * Jira Integration - Utility Functions
 * Các hàm xử lý chung cho việc tích hợp Jira/Xray
 */

const fs = require('fs');
const path = require('path');

/**
 * Load biến môi trường từ file .env
 * File .env nằm cùng thư mục scripts/integrations/jira/
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error(`[ERROR] File .env không tồn tại tại: ${envPath}`);
    console.error('Hãy copy .env.example thành .env và điền thông tin.');
    process.exit(1);
  }
  require('dotenv').config({ path: envPath });
}

/**
 * Validate các biến môi trường bắt buộc
 * @param {string[]} requiredVars - Danh sách tên biến cần kiểm tra
 */
function validateEnvVars(requiredVars) {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`[ERROR] Thiếu biến môi trường: ${missing.join(', ')}`);
    console.error('Hãy kiểm tra file .env và bổ sung đầy đủ.');
    process.exit(1);
  }
}

/**
 * Tạo HTTP headers chuẩn cho Jira REST API
 * Hỗ trợ cả API Token (Cloud) và Personal Access Token (Server/Data Center)
 * @returns {object} Headers object
 */
function buildJiraHeaders() {
  const token = process.env.JIRA_API_TOKEN;
  const email = process.env.JIRA_EMAIL;
  const patToken = process.env.JIRA_PAT;

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (patToken) {
    // Personal Access Token (Jira Server / Data Center)
    headers['Authorization'] = `Bearer ${patToken}`;
  } else if (email && token) {
    // API Token (Jira Cloud)
    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  } else {
    console.error('[ERROR] Thiếu thông tin xác thực Jira.');
    console.error('Cần JIRA_EMAIL + JIRA_API_TOKEN (Cloud) hoặc JIRA_PAT (Server/Data Center).');
    process.exit(1);
  }

  return headers;
}

/**
 * Format Jira issue data thành dạng readable
 * @param {object} issue - Jira issue raw data
 * @returns {object} Formatted issue
 */
function formatIssue(issue) {
  const fields = issue.fields || {};
  return {
    key: issue.key,
    id: issue.id,
    summary: fields.summary || '',
    description: fields.description || '',
    status: fields.status?.name || '',
    priority: fields.priority?.name || '',
    issueType: fields.issuetype?.name || '',
    assignee: fields.assignee?.displayName || 'Unassigned',
    reporter: fields.reporter?.displayName || '',
    created: fields.created || '',
    updated: fields.updated || '',
    labels: fields.labels || [],
    components: (fields.components || []).map((c) => c.name),
    acceptanceCriteria: fields.customfield_10020 || fields.customfield_10028 || '',
  };
}

/**
 * Chuyển đổi Jira description (ADF format) sang Markdown
 * Jira Cloud sử dụng Atlassian Document Format (ADF)
 * Hỗ trợ: paragraph, heading, table, list, text marks, link, code
 * @param {object|string} description - ADF object hoặc string
 * @returns {string} Markdown text
 */
function adfToMarkdown(description) {
  if (!description) return '';
  if (typeof description === 'string') return description;

  function extractText(node) {
    if (!node) return '';
    if (node.type === 'text') {
      let t = node.text || '';
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'strong') t = `**${t}**`;
          else if (mark.type === 'em') t = `*${t}*`;
          else if (mark.type === 'code') t = `\`${t}\``;
          else if (mark.type === 'link') t = `[${t}](${mark.attrs?.href || ''})`;
        }
      }
      return t;
    }
    if (node.type === 'hardBreak') return '<br>';
    if (node.type === 'inlineCard') return node.attrs?.url || '';
    if (Array.isArray(node.content)) {
      return node.content.map(extractText).join('');
    }
    return '';
  }

  function getCellText(cell) {
    if (!cell || !cell.content) return '';
    return cell.content.map((p) => extractText(p)).join(' ').trim();
  }

  function processTable(tableNode) {
    if (!tableNode.content) return '';
    const rows = [];
    let hasHeader = false;

    for (const row of tableNode.content) {
      if (row.type !== 'tableRow') continue;
      const cells = (row.content || []).map((cell) => {
        if (cell.type === 'tableHeader') hasHeader = true;
        return getCellText(cell);
      });
      rows.push(cells);
    }

    if (rows.length === 0) return '';

    const colCount = Math.max(...rows.map((r) => r.length));
    const normalizedRows = rows.map((r) => {
      while (r.length < colCount) r.push('');
      return r;
    });

    let md = '';
    if (hasHeader && normalizedRows.length > 0) {
      const header = normalizedRows[0];
      md += '| ' + header.join(' | ') + ' |\n';
      md += '| ' + header.map(() => '---').join(' | ') + ' |\n';
      for (let i = 1; i < normalizedRows.length; i++) {
        md += '| ' + normalizedRows[i].join(' | ') + ' |\n';
      }
    } else {
      const emptyHeader = normalizedRows[0].map(() => ' ');
      md += '| ' + emptyHeader.join(' | ') + ' |\n';
      md += '| ' + emptyHeader.map(() => '---').join(' | ') + ' |\n';
      for (const row of normalizedRows) {
        md += '| ' + row.join(' | ') + ' |\n';
      }
    }
    return md;
  }

  const parts = [];

  function processNode(node, listCounter) {
    if (!node) return;

    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const prefix = '#'.repeat(level);
      parts.push(`${prefix} ${extractText(node)}`);
      return;
    }

    if (node.type === 'paragraph') {
      parts.push(extractText(node));
      return;
    }

    if (node.type === 'table') {
      parts.push(processTable(node));
      return;
    }

    if (node.type === 'bulletList') {
      if (node.content) {
        for (const item of node.content) {
          if (item.type === 'listItem' && item.content) {
            const itemText = item.content.map(extractText).join(' ').trim();
            parts.push(`- ${itemText}`);
          }
        }
      }
      return;
    }

    if (node.type === 'orderedList') {
      if (node.content) {
        let idx = 1;
        for (const item of node.content) {
          if (item.type === 'listItem' && item.content) {
            const itemText = item.content.map(extractText).join(' ').trim();
            parts.push(`${idx}. ${itemText}`);
            idx++;
          }
        }
      }
      return;
    }

    if (node.type === 'codeBlock') {
      const lang = node.attrs?.language || '';
      const code = (node.content || []).map((c) => c.text || '').join('');
      parts.push(`\`\`\`${lang}\n${code}\n\`\`\``);
      return;
    }

    if (node.type === 'blockquote') {
      if (node.content) {
        const quote = node.content.map(extractText).join('\n');
        parts.push(quote.split('\n').map((l) => `> ${l}`).join('\n'));
      }
      return;
    }

    if (node.type === 'rule') {
      parts.push('---');
      return;
    }

    if (Array.isArray(node.content)) {
      node.content.forEach((child) => processNode(child));
    }
  }

  processNode(description);
  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Alias cho backward compatibility
function adfToPlainText(description) {
  return adfToMarkdown(description);
}

/**
 * Lưu dữ liệu JSON ra file
 * @param {string} filePath - Đường dẫn file output
 * @param {object} data - Dữ liệu cần lưu
 */
function saveJsonToFile(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[OK] Đã lưu file: ${filePath}`);
}

/**
 * Lưu nội dung text ra file
 * @param {string} filePath - Đường dẫn file output
 * @param {string} content - Nội dung text
 */
function saveTextToFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`[OK] Đã lưu file: ${filePath}`);
}

/**
 * Đọc file JSON
 * @param {string} filePath - Đường dẫn file
 * @returns {object|null} Parsed JSON hoặc null nếu lỗi
 */
function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[ERROR] Không đọc được file: ${filePath}`, err.message);
    return null;
  }
}

/**
 * Tạo timestamp string dạng YYYYMMDD_HHmmss
 * @returns {string}
 */
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

/**
 * Log message với prefix timestamp
 * @param {string} level - LOG | WARN | ERROR
 * @param {string} message - Nội dung log
 */
function log(level, message) {
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level}]`;
  if (level === 'ERROR') {
    console.error(`${prefix} ${message}`);
  } else if (level === 'WARN') {
    console.warn(`${prefix} ${message}`);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

module.exports = {
  loadEnv,
  validateEnvVars,
  buildJiraHeaders,
  formatIssue,
  adfToMarkdown,
  adfToPlainText,
  saveJsonToFile,
  saveTextToFile,
  readJsonFile,
  getTimestamp,
  log,
};
