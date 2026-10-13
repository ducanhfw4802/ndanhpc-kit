/**
 * Google Sheets Writer - Ghi dữ liệu / kết quả test lên Google Sheets
 *
 * Hỗ trợ:
 *   - Ghi kết quả test automation (Playwright JSON report)
 *   - Upload file Excel (.xlsx/.xls) lên Google Sheets
 *   - Append rows mới vào cuối sheet
 *   - Ghi đè (overwrite) data vào range cụ thể
 *   - Tạo sheet mới tự động nếu chưa tồn tại
 *   - Color coding: PASS = xanh, FAIL = đỏ, SKIP = vàng
 *
 * Sử dụng:
 *   node sheet_writer.js --excel ./file.xlsx --sheet "TenSheet"        Upload Excel
 *   node sheet_writer.js --excel ./file.xlsx --sheet "TenSheet" --sheet-index 1  Chọn tab Excel
 *   node sheet_writer.js --results ./test-results.json                  Import Playwright
 *   node sheet_writer.js --results ./test-results.json --sheet "Results"
 *   node sheet_writer.js --append "Sheet1" --data '[{"Name":"John"}]'
 *   node sheet_writer.js --clear "Sheet1" --range "A2:Z1000"
 *   node sheet_writer.js --create "New Sheet"
 */

const path = require('path');
const fs = require('fs');
const {
  loadEnv,
  validateEnvVars,
  buildSheetsClient,
  objectsToRows,
  buildRange,
  formatTestResultRow,
  readJsonFile,
  getTimestamp,
  log,
  handleApiError,
  colIndexToLetter,
} = require('./utils');

let SPREADSHEET_ID;

function initEnv() {
  loadEnv();
  validateEnvVars(['GOOGLE_SPREADSHEET_ID']);
  SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
}

/**
 * Tạo sheet mới nếu chưa tồn tại
 * @param {string} sheetName
 * @returns {boolean} true nếu tạo thành công hoặc sheet đã tồn tại
 */
async function ensureSheetExists(sheetName) {
  try {
    const sheetsClient = await buildSheetsClient();

    // Lấy danh sách sheets hiện có
    const metaRes = await sheetsClient.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties.title',
    });

    const existing = (metaRes.data.sheets || []).map((s) => s.properties.title);

    if (existing.includes(sheetName)) {
      log('LOG', `Sheet "${sheetName}" đã tồn tại.`);
      return true;
    }

    // Tạo sheet mới
    log('LOG', `Đang tạo sheet mới: "${sheetName}"...`);
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: sheetName,
              gridProperties: { rowCount: 1000, columnCount: 26 },
            },
          },
        }],
      },
    });

    log('LOG', `✅ Đã tạo sheet: "${sheetName}"`);
    return true;
  } catch (error) {
    handleApiError(error, `Ensure Sheet "${sheetName}"`);
    return false;
  }
}

/**
 * Xóa nội dung trong một range
 * @param {string} sheetName
 * @param {string} [range] - Range VD: "A2:Z1000" (nếu không có sẽ clear toàn bộ data rows)
 */
async function clearRange(sheetName, range = 'A2:Z10000') {
  const fullRange = buildRange(sheetName, range);
  log('LOG', `Đang xóa range: ${fullRange}...`);

  try {
    const sheetsClient = await buildSheetsClient();
    await sheetsClient.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
    });
    log('LOG', `✅ Đã xóa range: ${fullRange}`);
  } catch (error) {
    handleApiError(error, `Clear Range "${fullRange}"`);
  }
}

/**
 * Ghi header vào row đầu tiên của sheet
 * @param {string} sheetName
 * @param {string[]} headers
 */
async function writeHeaders(sheetName, headers) {
  const range = buildRange(sheetName, 'A1');
  log('LOG', `Đang ghi headers vào "${sheetName}"...`);

  try {
    const sheetsClient = await buildSheetsClient();
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });
    log('LOG', `✅ Đã ghi ${headers.length} header cột`);
  } catch (error) {
    handleApiError(error, `Write Headers "${sheetName}"`);
  }
}

/**
 * Append rows vào cuối sheet (sau dữ liệu hiện có)
 * @param {string} sheetName
 * @param {string[][]} rows - Mảng 2D các giá trị
 * @returns {number} Số rows đã append
 */
async function appendRows(sheetName, rows) {
  if (!rows || rows.length === 0) {
    log('WARN', 'Không có row nào để append.');
    return 0;
  }

  const range = buildRange(sheetName);
  log('LOG', `Đang append ${rows.length} row(s) vào "${sheetName}"...`);

  try {
    const sheetsClient = await buildSheetsClient();
    const res = await sheetsClient.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: rows,
      },
    });

    const updates = res.data.updates;
    log('LOG', `✅ Đã append ${rows.length} row(s) vào ${updates?.updatedRange || sheetName}`);
    return rows.length;
  } catch (error) {
    handleApiError(error, `Append Rows "${sheetName}"`);
    return 0;
  }
}

/**
 * Ghi đè dữ liệu vào một range cụ thể
 * @param {string} sheetName
 * @param {string} range - Range VD: "A1:G100"
 * @param {string[][]} rows - Mảng 2D
 */
async function writeRange(sheetName, range, rows) {
  const fullRange = buildRange(sheetName, range);
  log('LOG', `Đang ghi ${rows.length} row(s) vào ${fullRange}...`);

  try {
    const sheetsClient = await buildSheetsClient();
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: fullRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    });
    log('LOG', `✅ Đã ghi ${rows.length} row(s) vào ${fullRange}`);
  } catch (error) {
    handleApiError(error, `Write Range "${fullRange}"`);
  }
}

/**
 * Áp dụng màu sắc cho cột Status trong sheet kết quả test
 * PASS = xanh lá, FAIL = đỏ, SKIP = vàng
 * @param {string} sheetName
 * @param {number} sheetId - Numeric sheet ID
 * @param {number} startRow - Row bắt đầu (0-indexed, bỏ qua header)
 * @param {Array<{status: string}>} results - Danh sách kết quả test
 * @param {number} statusColIndex - Index cột Status (0-indexed)
 */
async function applyStatusColors(sheetName, sheetId, startRow, results, statusColIndex = 2) {
  if (!results || results.length === 0) return;

  log('LOG', `Đang áp dụng màu sắc cho ${results.length} row(s)...`);

  const colorMap = {
    PASS:  { red: 0.149, green: 0.800, blue: 0.376 },   // #26CC60 - xanh lá
    FAILED: { red: 0.918, green: 0.263, blue: 0.208 }, // #EA4335 - đỏ
    FAIL:  { red: 0.918, green: 0.263, blue: 0.208 },    // alias
    SKIP:  { red: 1.0,   green: 0.757, blue: 0.027 },    // #FFC104 - vàng
    SKIPPED: { red: 1.0, green: 0.757, blue: 0.027 },  // alias
  };

  const requests = results.map((result, idx) => {
    const rowIndex = startRow + idx; // 0-indexed
    const statusKey = (result.status || '').toUpperCase();
    const color = colorMap[statusKey] || { red: 0.9, green: 0.9, blue: 0.9 }; // grey default

    return {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: rowIndex,
          endRowIndex: rowIndex + 1,
          startColumnIndex: statusColIndex,
          endColumnIndex: statusColIndex + 1,
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: color,
            textFormat: {
              bold: true,
              foregroundColor: { red: 1, green: 1, blue: 1 },
            },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    };
  });

  try {
    const sheetsClient = await buildSheetsClient();
    await sheetsClient.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests },
    });
    log('LOG', `✅ Đã áp dụng màu sắc cho cột Status`);
  } catch (error) {
    log('WARN', `Không thể áp dụng màu sắc: ${error.message}. Tiếp tục không có màu.`);
  }
}

/**
 * Chuyển đổi Playwright JSON report sang dạng rows để ghi
 * @param {object} playwrightReport - Nội dung file test-results.json
 * @returns {{ headers: string[], rows: string[][], results: object[] }}
 */
function convertPlaywrightReport(playwrightReport) {
  const headers = [
    'Test ID', 'Title', 'Status', 'Duration (ms)',
    'Error', 'Suite', 'File', 'Run At', 'Retries', 'Annotations',
  ];

  const results = [];

  function processSpec(spec, suiteName) {
    if (spec.tests) {
      spec.tests.forEach((test) => {
        const result = test.results?.[0] || {};
        const status = result.status || test.outcome || 'unknown';
        const normalizedStatus = {
          'expected': 'PASS',
          'unexpected': 'FAIL',
          'flaky': 'FAIL',
          'skipped': 'SKIP',
          'passed': 'PASS',
          'failed': 'FAIL',
        }[status.toLowerCase()] || status.toUpperCase();

        results.push({
          id: test.testId || '',
          title: test.title || '',
          status: normalizedStatus,
          duration: result.duration || '',
          error: result.errors?.[0]?.message?.replace(/\n/g, ' ').substring(0, 200) || '',
          suite: suiteName || spec.title || '',
          file: spec.file || '',
          retries: result.retry || '0',
          annotations: (test.annotations || []).map((a) => `${a.type}: ${a.description}`).join('; '),
        });
      });
    }
    if (spec.suites) {
      spec.suites.forEach((sub) => processSpec(sub, suiteName || spec.title));
    }
  }

  const suites = playwrightReport.suites || [];
  suites.forEach((suite) => processSpec(suite, suite.title));

  const rows = results.map((r) => formatTestResultRow(r));

  return { headers, rows, results };
}

/**
 * Import kết quả Playwright test lên Google Sheets
 * @param {string} reportPath - Đường dẫn file test-results.json
 * @param {string} sheetName - Tên sheet đích
 * @param {object} options - { clearFirst: boolean, addSummaryRow: boolean }
 */
async function importPlaywrightResults(reportPath, sheetName, options = {}) {
  const { clearFirst = false, addSummaryRow = true } = options;

  log('LOG', `Đang đọc Playwright report: ${reportPath}`);

  const rawReport = readJsonFile(reportPath);
  if (!rawReport) {
    log('ERROR', `Không đọc được file: ${reportPath}`);
    return;
  }

  const { headers, rows, results } = convertPlaywrightReport(rawReport);

  if (rows.length === 0) {
    log('WARN', 'Không có test nào trong report.');
    return;
  }

  log('LOG', `Tìm thấy ${rows.length} test result(s)`);

  // Đảm bảo sheet tồn tại
  await ensureSheetExists(sheetName);

  // Lấy sheetId để color coding
  let sheetId = null;
  try {
    const sheetsClient = await buildSheetsClient();
    const metaRes = await sheetsClient.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: 'sheets.properties',
    });
    const found = (metaRes.data.sheets || []).find(
      (s) => s.properties.title === sheetName,
    );
    sheetId = found?.properties?.sheetId;
  } catch (_) {}

  // Ghi headers (hoặc clear cũ + ghi mới)
  if (clearFirst) {
    await clearRange(sheetName);
    await writeHeaders(sheetName, headers);
    // Append data rows
    await appendRows(sheetName, rows);

    // Color coding từ row 2 (index 1)
    if (sheetId !== null) {
      await applyStatusColors(sheetName, sheetId, 1, results, 2);
    }
  } else {
    // Chỉ ghi header nếu sheet trống (kiểm tra A1)
    const { readSheet } = require('./sheet_reader');
    const existing = await readSheet(sheetName, 'A1:A1');
    if (!existing.headers || existing.headers.length === 0) {
      await writeHeaders(sheetName, headers);
    }

    // Lấy số row hiện tại để tính offset màu
    const currentData = await readSheet(sheetName);
    const existingRowCount = currentData.data.length + 1; // +1 cho header

    // Append data rows
    await appendRows(sheetName, rows);

    // Color coding từ vị trí sau data cũ
    if (sheetId !== null) {
      await applyStatusColors(sheetName, sheetId, existingRowCount + 1, results, 2);
    }
  }

  // Summary row
  if (addSummaryRow) {
    const passCount = results.filter((r) => r.status === 'PASS').length;
    const failCount = results.filter((r) => r.status === 'FAIL').length;
    const skipCount = results.filter((r) => r.status === 'SKIP').length;
    const totalDuration = results.reduce((s, r) => s + (Number(r.duration) || 0), 0);

    const summaryRow = [
      '--- SUMMARY ---',
      `Total: ${rows.length}`,
      `PASS: ${passCount} | FAIL: ${failCount} | SKIP: ${skipCount}`,
      `${(totalDuration / 1000).toFixed(2)}s`,
      '', '', '',
      new Date().toISOString(),
      '', '',
    ];
    await appendRows(sheetName, [summaryRow]);
  }

  log('LOG', `✅ Import hoàn tất: ${rows.length} test(s) → Sheet "${sheetName}"`);

  // Thống kê
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;
  const skipCount = results.filter((r) => r.status === 'SKIP').length;
  console.log('\n--- Kết quả import ---');
  console.log(`  ✅ PASS: ${passCount}`);
  console.log(`  ❌ FAIL: ${failCount}`);
  console.log(`  ⏭️  SKIP: ${skipCount}`);
  console.log(`  📊 Total: ${rows.length}`);
  console.log(`  🔗 URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

/**
 * Upload file Excel (.xlsx/.xls) lên Google Sheets
 * @param {string} excelPath - Đường dẫn file Excel
 * @param {string} sheetName - Tên sheet đích trên Google Sheets
 * @param {object} options - { sheetIndex: number, clearFirst: boolean, newlineReplacement: string }
 */
async function importExcel(excelPath, sheetName, options = {}) {
  const { sheetIndex = 0, clearFirst = true, newlineReplacement = ' | ' } = options;

  // Kiểm tra package xlsx
  let XLSX;
  try {
    XLSX = require('xlsx');
  } catch (_) {
    log('ERROR', 'Package "xlsx" chưa được cài. Chạy: npm install xlsx');
    process.exit(1);
  }

  // Kiểm tra file tồn tại
  if (!fs.existsSync(excelPath)) {
    log('ERROR', `Không tìm thấy file: ${excelPath}`);
    process.exit(1);
  }

  log('LOG', `Đọc file Excel: ${excelPath}`);
  const wb = XLSX.readFile(excelPath);

  if (sheetIndex >= wb.SheetNames.length) {
    log('ERROR', `File Excel chỉ có ${wb.SheetNames.length} sheet(s): ${wb.SheetNames.join(', ')}`);
    process.exit(1);
  }

  const excelSheetName = wb.SheetNames[sheetIndex];
  const ws = wb.Sheets[excelSheetName];
  const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Chuẩn hóa: thay newline trong cell bằng separator
  const rows = rawRows.map((row) =>
    row.map((cell) => String(cell).replace(/\r\n|\r|\n/g, newlineReplacement))
  );

  log('LOG', `Excel sheet: "${excelSheetName}" → ${rows.length} rows × ${rows[0]?.length || 0} cột`);
  log('LOG', `Google Sheet đích: "${sheetName}"`);

  // Đảm bảo sheet tồn tại
  await ensureSheetExists(sheetName);

  // Xóa data cũ nếu cần
  if (clearFirst) {
    log('LOG', `Xóa data cũ trong "${sheetName}"...`);
    const sheetsClient = await buildSheetsClient();
    await sheetsClient.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });
  }

  // Upload toàn bộ data
  log('LOG', `Đang upload ${rows.length} rows...`);
  const sheetsClient = await buildSheetsClient();
  await sheetsClient.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  log('LOG', `✅ Upload hoàn tất: ${rows.length} rows → Sheet "${sheetName}"`);
  console.log('\n--- Kết quả upload Excel ---');
  console.log(`  📁 File: ${path.basename(excelPath)}`);
  console.log(`  📋 Excel sheet: "${excelSheetName}" (index ${sheetIndex})`);
  console.log(`  📊 Rows: ${rows.length} | Cols: ${rows[0]?.length || 0}`);
  console.log(`  ✅ Google Sheet: "${sheetName}"`);
  console.log(`  🔗 URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

// ============ CLI ============

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || Object.keys(args).length === 0) {
    printUsage();
    return;
  }

  initEnv();

  const defaultResultsSheet = process.env.RESULTS_SHEET_NAME || 'Test Results';

  // Mode: Import Playwright results
  if (args.results) {
    const reportPath = path.resolve(process.cwd(), args.results);
    if (!fs.existsSync(reportPath)) {
      log('ERROR', `Không tìm thấy file: ${reportPath}`);
      process.exit(1);
    }
    const sheetName = args.sheet || defaultResultsSheet;
    const clearFirst = args.clear === true || args['clear-first'] === true;
    await importPlaywrightResults(reportPath, sheetName, { clearFirst });
    return;
  }

  // Mode: Upload Excel file
  if (args.excel) {
    const excelPath = path.resolve(process.cwd(), args.excel);
    const sheetName = args.sheet;
    if (!sheetName) {
      log('ERROR', 'Cần chỉ định tên sheet đích bằng --sheet <NAME>');
      process.exit(1);
    }
    const sheetIndex = args['sheet-index'] ? parseInt(args['sheet-index'], 10) : 0;
    const clearFirst = !(args['no-clear'] === true);
    await importExcel(excelPath, sheetName, { sheetIndex, clearFirst });
    return;
  }

  // Mode: Append JSON data
  if (args.append && args.data) {
    const sheetName = args.append;
    let data;
    try {
      data = JSON.parse(args.data);
    } catch (_) {
      log('ERROR', 'Giá trị --data không hợp lệ (phải là JSON array).');
      process.exit(1);
    }

    if (!Array.isArray(data)) {
      log('ERROR', 'Giá trị --data phải là JSON array.');
      process.exit(1);
    }

    await ensureSheetExists(sheetName);
    const { headers, rows } = objectsToRows(data);
    await appendRows(sheetName, [headers, ...rows]);
    return;
  }

  // Mode: Clear range
  if (args.clear && args.clear !== true) {
    const sheetName = args.clear;
    const range = args.range || 'A2:Z10000';
    await clearRange(sheetName, range);
    return;
  }

  // Mode: Tạo sheet mới
  if (args.create) {
    await ensureSheetExists(args.create);
    return;
  }

  log('WARN', 'Không nhận được lệnh hợp lệ. Chạy --help để xem hướng dẫn.');
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
║          GOOGLE SHEETS WRITER - Antigravity                 ║
║   Ghi kết quả test automation lên Google Sheets            ║
╚══════════════════════════════════════════════════════════════╝

Cách sử dụng:
  node sheet_writer.js [options]

Options:
  --excel <FILE>        Upload file Excel (.xlsx/.xls) lên Google Sheet ← MỚI
  --sheet <NAME>        Tên sheet đích trên Google Sheets (BẮT BUỘC với --excel)
  --sheet-index <N>     Index tab Excel cần đọc (0 = tab đầu tiên, default: 0)
  --no-clear            Giữ lại data cũ, chỉ ghi đè từ A1 (default: xóa trước)
  --results <FILE>      Import Playwright JSON report lên Sheets
  --clear-first         Xóa data cũ trước khi ghi (dùng với --results)
  --append <SHEET>      Append JSON data vào sheet chỉ định
  --data <JSON>         Dữ liệu JSON array để append (dùng với --append)
  --clear <SHEET>       Xóa dữ liệu trong sheet (giữ row 1 - header)
  --range <A1_RANGE>    Range cần xóa (dùng với --clear, default: A2:Z10000)
  --create <NAME>       Tạo sheet mới với tên chỉ định
  --help                Hiển thị hướng dẫn này

Ví dụ:
  # Upload file Excel lên Google Sheet
  node sheet_writer.js --excel ./requirements/crm_login.xlsx --sheet "CRM_TC_LOGIN"
  node sheet_writer.js --excel ./data.xlsx --sheet "Sheet1" --sheet-index 1
  node sheet_writer.js --excel ./data.xlsx --sheet "Existing" --no-clear

  # Import kết quả Playwright
  node sheet_writer.js --results ./test-results/results.json
  node sheet_writer.js --results ./results.json --sheet "Sprint 5 Results"
  node sheet_writer.js --results ./results.json --clear-first

  # Append data tùy chỉnh
  node sheet_writer.js --append "Test Data" --data '[{"Name":"John","Score":"95"}]'

  # Xóa data
  node sheet_writer.js --clear "Test Results"
  node sheet_writer.js --clear "Sheet1" --range "A5:G100"

  # Tạo sheet mới
  node sheet_writer.js --create "Sprint 6 Results"

Cấu trúc Test Results Sheet:
  | Test ID | Title | Status | Duration (ms) | Error | Suite | File | Run At | Retries | Annotations |
  
Màu sắc tự động:
  🟢 PASS  - Nền xanh lá
  🔴 FAIL  - Nền đỏ
  🟡 SKIP  - Nền vàng
  `);
}

// Export để dùng như module
module.exports = {
  ensureSheetExists,
  clearRange,
  appendRows,
  writeHeaders,
  writeRange,
  importPlaywrightResults,
  convertPlaywrightReport,
  importExcel,
};

if (require.main === module) {
  main().catch((err) => {
    log('ERROR', `Unexpected error: ${err.message}`);
    process.exit(1);
  });
}
