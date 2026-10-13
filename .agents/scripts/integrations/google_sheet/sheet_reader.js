/**
 * Google Sheets Reader - Đọc dữ liệu từ Google Sheets
 *
 * Hỗ trợ:
 *   - Đọc toàn bộ sheet hoặc một range cụ thể
 *   - Đọc nhiều sheets/ranges cùng lúc (batch)
 *   - Export ra JSON hoặc Markdown
 *   - Sử dụng như Test Data source cho automation
 *
 * Sử dụng:
 *   node sheet_reader.js --sheet "Test Cases"
 *   node sheet_reader.js --sheet "Sheet1" --range "A1:F50"
 *   node sheet_reader.js --batch "Sheet1,Sheet2,Test Data"
 *   node sheet_reader.js --sheet "Test Cases" --format md
 *   node sheet_reader.js --sheet "Requirements" --output ./requirements
 *   node sheet_reader.js --list                         # Liệt kê danh sách sheets
 */

const path = require('path');
const fs = require('fs');
const {
  loadEnv,
  validateEnvVars,
  buildSheetsClient,
  rowsToObjects,
  buildRange,
  saveJsonToFile,
  saveTextToFile,
  getTimestamp,
  log,
  handleApiError,
} = require('./utils');

let SPREADSHEET_ID;

function initEnv() {
  loadEnv();
  validateEnvVars(['GOOGLE_SPREADSHEET_ID']);
  SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
}

/**
 * Liệt kê tất cả sheets trong Spreadsheet
 * @returns {object[]} Danh sách sheet metadata
 */
async function listSheets() {
  log('LOG', 'Đang lấy danh sách sheets...');

  try {
    const sheets = await buildSheetsClient();
    const res = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'properties.title,sheets.properties',
    });

    const sheetList = (res.data.sheets || []).map((s) => ({
      id: s.properties.sheetId,
      title: s.properties.title,
      rows: s.properties.gridProperties?.rowCount || 0,
      cols: s.properties.gridProperties?.columnCount || 0,
      index: s.properties.index,
    }));

    log('LOG', `Tìm thấy ${sheetList.length} sheet(s) trong "${res.data.properties?.title}"`);
    return sheetList;
  } catch (error) {
    handleApiError(error, 'List Sheets');
    return [];
  }
}

/**
 * Đọc dữ liệu từ một sheet/range cụ thể
 * @param {string} sheetName - Tên sheet (tab)
 * @param {string} [range] - Range VD: "A1:Z100" (tuỳ chọn)
 * @returns {{ headers: string[], rows: string[][], data: object[] }}
 */
async function readSheet(sheetName, range) {
  const fullRange = buildRange(sheetName, range);
  log('LOG', `Đang đọc: ${fullRange} ...`);

  try {
    const sheets = await buildSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
      valueRenderOption: 'FORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });

    const rows = res.data.values || [];
    if (rows.length === 0) {
      log('WARN', `Sheet "${sheetName}" trống hoặc không có dữ liệu trong range này.`);
      return { headers: [], rows: [], data: [] };
    }

    const headers = rows[0].map((h) => String(h).trim());
    const dataRows = rows.slice(1);
    const data = rowsToObjects(rows);

    log('LOG', `Đọc thành công: ${data.length} row(s), ${headers.length} col(s)`);
    return { headers, rows: dataRows, data };
  } catch (error) {
    handleApiError(error, `Read Sheet "${sheetName}"`);
    return { headers: [], rows: [], data: [] };
  }
}

/**
 * Đọc nhiều sheets cùng lúc (batch read)
 * @param {string[]} sheetNames - Danh sách tên sheets
 * @returns {object} Map: { sheetName: { headers, rows, data } }
 */
async function readBatch(sheetNames) {
  log('LOG', `Đang đọc batch ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}`);

  try {
    const sheets = await buildSheetsClient();
    const ranges = sheetNames.map((name) => buildRange(name));

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
      valueRenderOption: 'FORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    });

    const result = {};
    const valueRanges = res.data.valueRanges || [];

    valueRanges.forEach((vr, idx) => {
      const sheetName = sheetNames[idx];
      const rows = vr.values || [];

      if (rows.length === 0) {
        log('WARN', `Sheet "${sheetName}": trống`);
        result[sheetName] = { headers: [], rows: [], data: [] };
      } else {
        const headers = rows[0].map((h) => String(h).trim());
        const data = rowsToObjects(rows);
        result[sheetName] = { headers, rows: rows.slice(1), data };
        log('LOG', `  "${sheetName}": ${data.length} row(s), ${headers.length} col(s)`);
      }
    });

    return result;
  } catch (error) {
    handleApiError(error, 'Batch Read');
    return {};
  }
}

/**
 * Chuyển dữ liệu sheet thành Markdown table
 * @param {string} sheetName
 * @param {{ headers: string[], data: object[] }} sheetData
 * @returns {string} Markdown content
 */
function sheetToMarkdown(sheetName, sheetData) {
  const { headers, data } = sheetData;

  if (!data || data.length === 0) {
    return `# Sheet: ${sheetName}\n\n_Không có dữ liệu_\n`;
  }

  let md = `# Sheet: ${sheetName}\n\n`;
  md += `> Tổng: **${data.length} row(s)** | Cột: **${headers.length}** | Ngày đọc: ${new Date().toISOString()}\n\n`;

  // Bảng Markdown
  md += `| ${headers.join(' | ')} |\n`;
  md += `| ${headers.map(() => '---').join(' | ')} |\n`;

  data.forEach((row) => {
    const values = headers.map((h) => {
      const val = row[h] || '';
      // Escape pipe character và xử lý xuống dòng trong cell
      return String(val).replace(/\|/g, '\\|').replace(/\n/g, ' ');
    });
    md += `| ${values.join(' | ')} |\n`;
  });

  return md;
}

// ============ CLI ============

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || Object.keys(args).length === 0) {
    printUsage();
    return;
  }

  initEnv();

  // Mode: Liệt kê sheets
  if (args.list) {
    const sheetList = await listSheets();
    if (sheetList.length === 0) {
      log('WARN', 'Không tìm thấy sheet nào.');
      return;
    }

    console.log('\n--- Danh sách Sheets ---');
    sheetList.forEach((s, i) => {
      console.log(`  ${i + 1}. "${s.title}" (${s.rows} rows × ${s.cols} cols)`);
    });
    console.log(`\nSpreadsheet ID: ${SPREADSHEET_ID}`);
    return;
  }

  const timestamp = getTimestamp();
  const baseOutputDir = args.output
    ? path.resolve(process.cwd(), args.output)
    : path.resolve(__dirname, '..', '..', '..', process.env.OUTPUT_DIR || 'requirements/google_sheet');

  // Mode: Batch đọc nhiều sheets
  if (args.batch) {
    const sheetNames = args.batch.split(',').map((s) => s.trim()).filter(Boolean);
    const batchData = await readBatch(sheetNames);

    const outputDir = path.join(baseOutputDir, `batch_${timestamp}`);

    if (args.format === 'md' || args.format === 'markdown') {
      for (const [sheetName, sheetData] of Object.entries(batchData)) {
        const safeName = sheetName.replace(/[^a-zA-Z0-9]/g, '_');
        const mdContent = sheetToMarkdown(sheetName, sheetData);
        saveTextToFile(path.join(outputDir, `${safeName}.md`), mdContent);
      }

      // Tạo overview
      let overview = `# Google Sheets Export — Tổng quan\n\n`;
      overview += `> Ngày đọc: ${new Date().toISOString()} | Spreadsheet: ${SPREADSHEET_ID}\n\n`;
      overview += `| # | Sheet | Rows | Cols |\n`;
      overview += `|---|-------|------|------|\n`;
      Object.entries(batchData).forEach(([name, d], i) => {
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
        overview += `| ${i + 1} | [${name}](./${safeName}.md) | ${d.data.length} | ${d.headers.length} |\n`;
      });
      saveTextToFile(path.join(outputDir, '_overview.md'), overview);
    } else {
      // JSON output
      const jsonData = {};
      for (const [sheetName, sheetData] of Object.entries(batchData)) {
        jsonData[sheetName] = {
          headers: sheetData.headers,
          totalRows: sheetData.data.length,
          data: sheetData.data,
        };
      }
      saveJsonToFile(path.join(outputDir, `batch_data.json`), {
        readAt: new Date().toISOString(),
        spreadsheetId: SPREADSHEET_ID,
        sheets: Object.keys(batchData),
        data: jsonData,
      });
    }

    log('LOG', `Output: ${outputDir}`);
    return;
  }

  // Mode: Đọc một sheet cụ thể
  if (args.sheet) {
    const sheetName = args.sheet;
    const range = args.range || null;
    const sheetData = await readSheet(sheetName, range);

    if (sheetData.data.length === 0) {
      log('WARN', 'Không có dữ liệu để xuất.');
      return;
    }

    const safeName = sheetName.replace(/[^a-zA-Z0-9]/g, '_');
    const outputDir = path.join(baseOutputDir, safeName);

    if (args.format === 'md' || args.format === 'markdown') {
      const mdContent = sheetToMarkdown(sheetName, sheetData);
      const mdFile = path.join(outputDir, `${safeName}.md`);
      saveTextToFile(mdFile, mdContent);
    } else {
      const jsonFile = path.join(outputDir, `${safeName}_data.json`);
      saveJsonToFile(jsonFile, {
        readAt: new Date().toISOString(),
        spreadsheetId: SPREADSHEET_ID,
        sheetName,
        range: range || 'full',
        totalRows: sheetData.data.length,
        headers: sheetData.headers,
        data: sheetData.data,
      });

      // In tóm tắt
      console.log('\n--- Tóm tắt kết quả ---');
      console.log(`  Sheet: "${sheetName}"`);
      console.log(`  Rows: ${sheetData.data.length}`);
      console.log(`  Columns: ${sheetData.headers.join(', ')}`);
      if (sheetData.data.length > 0) {
        console.log(`  Sample row[0]: ${JSON.stringify(sheetData.data[0])}`);
      }
    }

    log('LOG', `Output: ${outputDir}`);
  }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.replace('--', '');
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function printUsage() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║           GOOGLE SHEETS READER - Antigravity                ║
║       Đọc dữ liệu từ Google Sheets cho Test Automation      ║
╚══════════════════════════════════════════════════════════════╝

Cách sử dụng:
  node sheet_reader.js [options]

Options:
  --list                  Liệt kê tất cả sheets trong Spreadsheet
  --sheet <NAME>          Tên sheet (tab) cần đọc
  --range <A1_RANGE>      Range cụ thể VD: "A1:F100" (tùy chọn)
  --batch <NAMES>         Đọc nhiều sheets, cách nhau bởi dấu phẩy
  --format <FMT>          Định dạng output: json (default) hoặc md
  --output <DIR>          Thư mục lưu file output
  --help                  Hiển thị hướng dẫn này

Ví dụ:
  node sheet_reader.js --list
  node sheet_reader.js --sheet "Test Cases"
  node sheet_reader.js --sheet "Sheet1" --range "A1:G50"
  node sheet_reader.js --sheet "Test Cases" --format md
  node sheet_reader.js --batch "Sheet1,Test Data,Requirements"
  node sheet_reader.js --sheet "Requirements" --output ./requirements
  `);
}

// Export để dùng như module
module.exports = {
  listSheets,
  readSheet,
  readBatch,
  sheetToMarkdown,
};

if (require.main === module) {
  main().catch((err) => {
    log('ERROR', `Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
