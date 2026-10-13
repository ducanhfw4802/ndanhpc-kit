/**
 * Xray Importer - Đẩy kết quả test lên Xray
 *
 * Hỗ trợ import:
 *   - Playwright JSON report
 *   - Allure results (allure-results/)
 *   - JUnit XML report
 *
 * Sử dụng:
 *   node xray_importer.js --format playwright --file ./playwright-report/results.json
 *   node xray_importer.js --format junit --file ./test-results/junit.xml
 *   node xray_importer.js --format xray --file ./xray-report.json --project PROJ
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  loadEnv,
  validateEnvVars,
  log,
  readJsonFile,
  getTimestamp,
} = require('./utils');
const {
  getXrayCloudToken,
  getXrayServerAuth,
  buildXrayHeaders,
} = require('./xray_auth');

// Load environment
loadEnv();

// Xray Cloud Import Endpoints
const XRAY_CLOUD_BASE = 'https://xray.cloud.getxray.app/api/v2';
const IMPORT_ENDPOINTS = {
  xray: '/import/execution',
  junit: '/import/execution/junit',
  cucumber: '/import/execution/cucumber',
};

/**
 * Import kết quả test lên Xray Cloud (Xray JSON format)
 * @param {object} payload - Xray execution payload
 * @returns {object} Import result
 */
async function importToXrayCloud(payload) {
  const token = await getXrayCloudToken();
  if (!token) {
    log('ERROR', 'Không lấy được Xray token.');
    return null;
  }

  log('LOG', 'Đang import kết quả test lên Xray Cloud...');

  try {
    const response = await axios.post(
      `${XRAY_CLOUD_BASE}${IMPORT_ENDPOINTS.xray}`,
      payload,
      {
        headers: buildXrayHeaders('cloud', token),
      }
    );

    log('LOG', 'Import thành công!');
    log('LOG', `Test Execution Key: ${response.data.key || response.data.id}`);
    return response.data;
  } catch (error) {
    handleImportError(error);
    return null;
  }
}

/**
 * Import JUnit XML lên Xray Cloud
 * @param {string} xmlFilePath - Đường dẫn file JUnit XML
 * @param {string} projectKey - Jira project key
 * @returns {object}
 */
async function importJunitToXrayCloud(xmlFilePath, projectKey) {
  const token = await getXrayCloudToken();
  if (!token) return null;

  if (!fs.existsSync(xmlFilePath)) {
    log('ERROR', `File không tồn tại: ${xmlFilePath}`);
    return null;
  }

  const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

  log('LOG', `Đang import JUnit XML: ${xmlFilePath}`);

  try {
    const response = await axios.post(
      `${XRAY_CLOUD_BASE}${IMPORT_ENDPOINTS.junit}`,
      xmlContent,
      {
        headers: {
          ...buildXrayHeaders('cloud', token),
          'Content-Type': 'text/xml',
        },
        params: {
          projectKey,
        },
      }
    );

    log('LOG', `Import JUnit thành công! Key: ${response.data.key}`);
    return response.data;
  } catch (error) {
    handleImportError(error);
    return null;
  }
}

/**
 * Import kết quả test lên Xray Server/Data Center
 * @param {object} payload - Xray execution payload
 * @returns {object}
 */
async function importToXrayServer(payload) {
  validateEnvVars(['JIRA_BASE_URL']);
  const baseUrl = process.env.JIRA_BASE_URL.replace(/\/+$/, '');
  const auth = getXrayServerAuth();

  if (!auth) return null;

  log('LOG', 'Đang import kết quả test lên Xray Server...');

  try {
    const response = await axios.post(
      `${baseUrl}/rest/raven/2.0/import/execution`,
      payload,
      {
        headers: buildXrayHeaders('server', auth),
      }
    );

    log('LOG', `Import thành công! Test Execution: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    handleImportError(error);
    return null;
  }
}

/**
 * Chuyển đổi Playwright JSON report sang Xray format
 * @param {object} playwrightReport - Playwright JSON report data
 * @param {string} projectKey - Jira project key
 * @param {string} testPlanKey - (Optional) Test Plan key
 * @returns {object} Xray-compatible payload
 */
function convertPlaywrightToXray(playwrightReport, projectKey, testPlanKey) {
  const tests = [];

  // Playwright report format: suites → specs → tests → results
  function processSuite(suite) {
    if (suite.specs) {
      suite.specs.forEach((spec) => {
        spec.tests.forEach((test) => {
          const result = test.results[test.results.length - 1]; // Lấy kết quả cuối
          const status = mapPlaywrightStatus(test.status);
          const duration = result?.duration || 0;

          tests.push({
            testKey: extractTestKey(spec.title) || undefined,
            status,
            comment: `Test: ${spec.title}\nFile: ${spec.file}:${spec.line}\nDuration: ${duration}ms`,
            evidences: result?.attachments?.map((att) => ({
              data: att.body || '',
              filename: att.name || 'attachment',
              contentType: att.contentType || 'text/plain',
            })) || [],
          });
        });
      });
    }

    if (suite.suites) {
      suite.suites.forEach(processSuite);
    }
  }

  if (playwrightReport.suites) {
    playwrightReport.suites.forEach(processSuite);
  }

  const payload = {
    info: {
      project: projectKey,
      summary: `Playwright Test Execution - ${new Date().toISOString()}`,
      description: `Automated Playwright test results imported via Antigravity.\nTotal: ${tests.length} tests`,
      startDate: playwrightReport.stats?.startTime || new Date().toISOString(),
    },
    tests: tests.filter((t) => t.testKey),
  };

  if (testPlanKey) {
    payload.info.testPlanKey = testPlanKey;
  }

  return payload;
}

/**
 * Map Playwright status sang Xray status
 */
function mapPlaywrightStatus(status) {
  const mapping = {
    passed: 'PASSED',
    expected: 'PASSED',
    failed: 'FAILED',
    unexpected: 'FAILED',
    timedOut: 'FAILED',
    skipped: 'TODO',
    interrupted: 'FAILED',
  };
  return mapping[status] || 'TODO';
}

/**
 * Trích xuất Jira test key từ tên test (nếu có)
 * Convention: test title chứa [PROJ-123] hoặc @PROJ-123
 */
function extractTestKey(title) {
  const match = title.match(/\[?([A-Z]+-\d+)\]?/);
  return match ? match[1] : null;
}

/**
 * Xử lý lỗi import
 */
function handleImportError(error) {
  if (error.response) {
    log('ERROR', `Import HTTP ${error.response.status}`);
    log('ERROR', `Response: ${JSON.stringify(error.response.data)}`);
  } else {
    log('ERROR', `Import error: ${error.message}`);
  }
}

// ============ CLI ============

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || Object.keys(args).length === 0) {
    printUsage();
    return;
  }

  const format = args.format || 'xray';
  const filePath = args.file;
  const projectKey = args.project || process.env.JIRA_PROJECT_KEY;
  const platform = process.env.XRAY_PLATFORM || 'cloud';

  if (!filePath) {
    log('ERROR', 'Cần chỉ định --file <path>');
    return;
  }

  if (!fs.existsSync(filePath)) {
    log('ERROR', `File không tồn tại: ${filePath}`);
    return;
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              XRAY IMPORTER - Antigravity                    ║
║     Đẩy kết quả test automation lên Xray                    ║
╚══════════════════════════════════════════════════════════════╝
`);
  console.log(`Platform: ${platform}`);
  console.log(`Format:   ${format}`);
  console.log(`File:     ${filePath}`);
  console.log(`Project:  ${projectKey || 'N/A'}`);
  console.log('');

  let result;

  switch (format) {
    case 'playwright': {
      const report = readJsonFile(filePath);
      if (!report) return;
      if (!projectKey) {
        log('ERROR', 'Cần --project <KEY> hoặc JIRA_PROJECT_KEY trong .env');
        return;
      }
      const payload = convertPlaywrightToXray(report, projectKey, args.testplan);
      log('LOG', `Đã chuyển đổi ${payload.tests.length} tests sang Xray format.`);

      if (platform === 'cloud') {
        result = await importToXrayCloud(payload);
      } else {
        result = await importToXrayServer(payload);
      }
      break;
    }

    case 'junit': {
      if (!projectKey) {
        log('ERROR', 'Cần --project <KEY> hoặc JIRA_PROJECT_KEY trong .env');
        return;
      }
      if (platform === 'cloud') {
        result = await importJunitToXrayCloud(filePath, projectKey);
      } else {
        log('ERROR', 'JUnit import cho Xray Server chưa được hỗ trợ trong phiên bản này.');
      }
      break;
    }

    case 'xray': {
      const payload = readJsonFile(filePath);
      if (!payload) return;
      if (platform === 'cloud') {
        result = await importToXrayCloud(payload);
      } else {
        result = await importToXrayServer(payload);
      }
      break;
    }

    default:
      log('ERROR', `Format không hỗ trợ: ${format}`);
      log('ERROR', 'Hỗ trợ: playwright, junit, xray');
  }

  if (result) {
    console.log('\n--- Kết quả import ---');
    console.log(JSON.stringify(result, null, 2));
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
║              XRAY IMPORTER - Antigravity                    ║
║     Đẩy kết quả test automation lên Xray                    ║
╚══════════════════════════════════════════════════════════════╝

Cách sử dụng:
  node xray_importer.js [options]

Options:
  --format <FMT>      Format report: playwright, junit, xray (default: xray)
  --file <PATH>       Đường dẫn file report
  --project <KEY>     Jira Project Key (hoặc dùng JIRA_PROJECT_KEY trong .env)
  --testplan <KEY>    (Optional) Test Plan Key để link Test Execution
  --help              Hiển thị hướng dẫn này

Ví dụ:
  node xray_importer.js --format playwright --file ./test-results.json --project PROJ
  node xray_importer.js --format junit --file ./junit-results.xml --project PROJ
  node xray_importer.js --format xray --file ./xray-payload.json
  `);
}

// Export
module.exports = {
  importToXrayCloud,
  importToXrayServer,
  importJunitToXrayCloud,
  convertPlaywrightToXray,
};

// CLI
if (require.main === module) {
  main().catch((err) => {
    log('ERROR', `Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
