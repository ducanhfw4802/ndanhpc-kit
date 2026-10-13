/**
 * Google Sheets Auth - Kiểm tra và xác minh kết nối Google Sheets
 *
 * Hỗ trợ:
 *   - Service Account (khuyến nghị cho automation / CI-CD)
 *   - API Key (chỉ dùng cho Sheets công khai, read-only)
 *
 * Sử dụng:
 *   node sheet_auth.js --verify                     Kiểm tra kết nối Spreadsheet
 *   node sheet_auth.js --verify --sheet "Login"     Verify + đọc thử sheet cụ thể
 *   node sheet_auth.js --setup                      Hướng dẫn cài đặt credentials
 *   node sheet_auth.js                              Hiển thị hướng dẫn
 */

const path = require('path');
const fs = require('fs');
const {
  loadEnv,
  buildSheetsClient,
  buildGoogleAuth,
  log,
  handleApiError,
} = require('./utils');

function initEnv() {
  loadEnv();
}

/**
 * Verify kết nối và quyền truy cập Spreadsheet
 * @param {string|null} sheetName - Tên sheet cụ thể cần verify (tuỳ chọn)
 */
async function verifyConnection(sheetName = null) {
  initEnv();

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId || spreadsheetId === 'your-spreadsheet-id-here') {
    log('ERROR', 'GOOGLE_SPREADSHEET_ID chưa được cấu hình trong .env');
    process.exit(1);
  }

  log('LOG', 'Đang kiểm tra kết nối Google Sheets API...');

  try {
    const sheets = await buildSheetsClient();

    // Lấy thông tin Spreadsheet (metadata)
    const metaRes = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'spreadsheetId,properties,sheets',
    });

    const meta = metaRes.data;
    log('LOG', `✅ Kết nối thành công!`);
    log('LOG', `📊 Spreadsheet: "${meta.properties?.title}"`);
    log('LOG', `🔗 URL: https://docs.google.com/spreadsheets/d/${meta.spreadsheetId}/edit`);
    log('LOG', `📋 Danh sách Sheets:`);

    const sheetList = meta.sheets || [];
    sheetList.forEach((s, i) => {
      const props = s.properties;
      const marker = sheetName && props.title === sheetName ? ' ◀ đang verify' : '';
      log('LOG', `   ${i + 1}. "${props.title}" (ID: ${props.sheetId}, Rows: ${props.gridProperties?.rowCount || '?'}, Cols: ${props.gridProperties?.columnCount || '?'})${marker}`);
    });

    // Xác thực auth type
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
    if (keyPath) {
      const resolvedPath = path.resolve(__dirname, keyPath);
      const keyData = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
      log('LOG', `🔑 Auth: Service Account (${keyData.client_email})`);
    } else {
      log('LOG', `🔑 Auth: API Key (read-only mode)`);
    }

    // Verify sheet cụ thể nếu có --sheet
    if (sheetName) {
      log('LOG', ``);
      log('LOG', `🔍 Đang verify sheet: "${sheetName}"...`);

      const sheetExists = sheetList.some((s) => s.properties.title === sheetName);
      if (!sheetExists) {
        log('ERROR', `❌ Sheet "${sheetName}" không tồn tại trong Spreadsheet này.`);
        log('LOG', `💡 Các sheet hiện có: ${sheetList.map((s) => `"${s.properties.title}"`).join(', ')}`);
        return false;
      }

      // Thử đọc thực tế từ sheet
      try {
        const readRes = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1:A5`,
          valueRenderOption: 'FORMATTED_VALUE',
        });
        const rows = readRes.data.values || [];
        if (rows.length === 0) {
          log('WARN', `⚠️  Sheet "${sheetName}" tồn tại nhưng chưa có dữ liệu (trống).`);
        } else {
          log('LOG', `✅ Sheet "${sheetName}" có thể đọc được — ${rows.length} row(s) đầu tiên tìm thấy.`);
          log('LOG', `   Giá trị A1: "${rows[0]?.[0] || '(trống)'}"`);
        }
      } catch (readError) {
        log('ERROR', `❌ Không thể đọc sheet "${sheetName}": ${readError.message}`);
        return false;
      }
    }

    return true;
  } catch (error) {
    handleApiError(error, 'Verify Connection');
    return false;
  }
}

/**
 * Hiển thị hướng dẫn cài đặt
 */
function printSetupGuide() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║          GOOGLE SHEETS INTEGRATION - Hướng Dẫn Cài Đặt             ║
╚══════════════════════════════════════════════════════════════════════╝

📌 CÁCH 1: Service Account (Khuyến nghị - Full quyền đọc & ghi)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bước 1: Tạo Google Cloud Project
  → Truy cập: https://console.cloud.google.com/
  → Tạo project mới hoặc chọn project hiện có

Bước 2: Bật Google Sheets API
  → APIs & Services → Library → Tìm "Google Sheets API" → Enable

Bước 3: Tạo Service Account
  → APIs & Services → Credentials → Create Credentials → Service Account
  → Đặt tên (VD: "antigravity-automation") → Create
  → Vào Service Account vừa tạo → Keys → Add Key → JSON → Download

Bước 4: Cấu hình .env
  → Sao chép file JSON vào thư mục này (VD: service-account.json)
  → Mở .env → GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json

Bước 5: Cấp quyền Share Spreadsheet
  → Mở Spreadsheet → Share
  → Nhập email của Service Account (có trong file JSON: client_email)
  → Cấp quyền "Editor" (để cả đọc + ghi)
  → Click "Share"

Bước 6: Lấy Spreadsheet ID
  → URL của Google Sheet:
    https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
  → Copy phần <SPREADSHEET_ID> → Dán vào GOOGLE_SPREADSHEET_ID trong .env

Bước 7: Verify kết nối
  → node sheet_auth.js --verify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 CÁCH 2: API Key (Read-only - Chỉ cho Sheets công khai)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bước 1: Tạo API Key tại:
  → https://console.cloud.google.com/apis/credentials
  → Create Credentials → API Key

Bước 2: Cấu hình .env
  → GOOGLE_API_KEY=your-api-key-here

Bước 3: Đặt Google Sheet ở chế độ "Anyone with the link can view"

LƯU Ý: API Key KHÔNG thể ghi data lên Sheets. Dùng Service Account nếu
cần ghi kết quả test.
`);
}

// ============ CLI ============

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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.verify) {
    const sheetName = args.sheet || null;
    const ok = await verifyConnection(sheetName);
    process.exit(ok ? 0 : 1);
  }

  if (args.setup) {
    printSetupGuide();
    return;
  }

  // Default: hiển thị hướng dẫn
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║         GOOGLE SHEETS AUTH - Antigravity                  ║
╚═══════════════════════════════════════════════════════════╝

Cách sử dụng:
  node sheet_auth.js [options]

Options:
  --verify              Kiểm tra kết nối và quyền truy cập Spreadsheet
  --verify --sheet NAME Verify + đọc thử một sheet cụ thể
  --setup               Hiển thị hướng dẫn cài đặt credentials chi tiết

Ví dụ:
  node sheet_auth.js --verify
  node sheet_auth.js --verify --sheet "Login"
  node sheet_auth.js --verify --sheet "Test Results"
  node sheet_auth.js --setup
  `);
}

if (require.main === module) {
  main().catch((err) => {
    log('ERROR', `Unexpected error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { verifyConnection };
