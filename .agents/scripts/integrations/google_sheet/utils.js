/**
 * Google Sheets Integration - Utility Functions
 * Các hàm xử lý chung cho việc tích hợp Google Sheets
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

/**
 * Load biến môi trường từ file .env
 * File .env nằm cùng thư mục scripts/integrations/google_sheet/
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
 * Tạo Google Auth client từ Service Account hoặc API Key
 * @returns {object} auth client hoặc apiKey string
 */
function buildGoogleAuth() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (keyPath) {
    const resolvedPath = path.resolve(__dirname, keyPath);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[ERROR] Không tìm thấy file Service Account key: ${resolvedPath}`);
      console.error('Hãy tải file JSON credentials từ Google Cloud Console.');
      process.exit(1);
    }
    const auth = new google.auth.GoogleAuth({
      keyFile: resolvedPath,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    });
    return { type: 'serviceAccount', auth };
  }

  if (apiKey) {
    return { type: 'apiKey', apiKey };
  }

  console.error('[ERROR] Thiếu thông tin xác thực Google.');
  console.error('Cần GOOGLE_SERVICE_ACCOUNT_KEY_PATH (Service Account) hoặc GOOGLE_API_KEY (chỉ read-only).');
  process.exit(1);
}

/**
 * Tạo Google Sheets API client
 * @returns {object} sheets API client
 */
async function buildSheetsClient() {
  const authInfo = buildGoogleAuth();

  if (authInfo.type === 'serviceAccount') {
    const authClient = await authInfo.auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
  }

  if (authInfo.type === 'apiKey') {
    return google.sheets({ version: 'v4', auth: authInfo.apiKey });
  }
}

/**
 * Chuyển đổi dữ liệu dạng rows (mảng 2D từ Sheets API) sang mảng objects
 * Row đầu tiên là header, các row sau là data
 * @param {string[][]} rows - Dữ liệu thô từ Sheets API
 * @returns {object[]} Mảng objects với key là tên cột
 */
function rowsToObjects(rows) {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0].map((h) => String(h).trim());
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    // Bỏ qua row trống hoàn toàn
    if (!row || row.every((cell) => !cell)) continue;

    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] !== undefined ? String(row[idx]) : '';
    });
    data.push(obj);
  }

  return data;
}

/**
 * Chuyển đổi mảng objects sang rows (mảng 2D) để ghi lên Sheets
 * @param {object[]} objects - Mảng dữ liệu
 * @param {string[]} [columns] - Danh sách cột theo thứ tự (nếu không truyền sẽ lấy từ keys)
 * @returns {{ headers: string[], rows: string[][] }}
 */
function objectsToRows(objects, columns) {
  if (!objects || objects.length === 0) return { headers: [], rows: [] };

  const headers = columns || Object.keys(objects[0]);
  const rows = objects.map((obj) => headers.map((h) => {
    const val = obj[h];
    if (val === null || val === undefined) return '';
    return String(val);
  }));

  return { headers, rows };
}

/**
 * Tính toán range A1 Notation cho một sheet
 * @param {string} sheetName - Tên sheet (tab)
 * @param {string} [range] - Range VD: "A1:Z100" (tuỳ chọn)
 * @returns {string} Full range string VD: "Sheet1!A1:Z100"
 */
function buildRange(sheetName, range) {
  const escapedName = sheetName.includes(' ') ? `'${sheetName}'` : sheetName;
  return range ? `${escapedName}!${range}` : escapedName;
}

/**
 * Format kết quả test thành row để ghi lên Sheets
 * @param {object} testResult - Kết quả test
 * @returns {string[]} Row values
 */
function formatTestResultRow(testResult) {
  const now = new Date();
  const timezone = process.env.TIMEZONE || 'Asia/Ho_Chi_Minh';
  const timestamp = now.toLocaleString('vi-VN', { timeZone: timezone });

  return [
    testResult.id || '',
    testResult.title || '',
    testResult.status || '',         // PASS | FAIL | SKIP
    testResult.duration || '',        // ms
    testResult.error || '',
    testResult.suite || '',
    testResult.file || '',
    timestamp,
    testResult.retries || '0',
    testResult.annotations || '',
  ];
}

/**
 * Đọc file JSON
 * @param {string} filePath - Đường dẫn file
 * @returns {object|null}
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
 * Lưu dữ liệu JSON ra file
 * @param {string} filePath
 * @param {object} data
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
 * @param {string} filePath
 * @param {string} content
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
 * @param {string} message
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

/**
 * Xử lý lỗi từ Google Sheets API
 * @param {Error} error
 * @param {string} context
 */
function handleApiError(error, context) {
  const status = error?.response?.status || error?.code;
  const message = error?.response?.data?.error?.message || error?.message;

  log('ERROR', `[${context}] ${status ? `HTTP ${status}: ` : ''}${message}`);

  if (status === 401 || status === 403) {
    log('ERROR', 'Lỗi xác thực. Kiểm tra Service Account có quyền truy cập vào Spreadsheet.');
    log('ERROR', 'Đảm bảo đã share Spreadsheet cho email của Service Account.');
  } else if (status === 404) {
    log('ERROR', 'Không tìm thấy Spreadsheet. Kiểm tra GOOGLE_SPREADSHEET_ID trong .env.');
  } else if (String(message).includes('Unable to parse range')) {
    log('ERROR', 'Range không hợp lệ. Kiểm tra tên Sheet và định dạng range (VD: Sheet1!A1:Z100).');
  }
}

/**
 * Chuyển đổi chỉ số cột (0-indexed) sang ký hiệu A1 (A, B, ... Z, AA, AB, ...)
 * @param {number} colIndex - 0-indexed
 * @returns {string}
 */
function colIndexToLetter(colIndex) {
  let letter = '';
  let index = colIndex;
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

module.exports = {
  loadEnv,
  validateEnvVars,
  buildGoogleAuth,
  buildSheetsClient,
  rowsToObjects,
  objectsToRows,
  buildRange,
  formatTestResultRow,
  readJsonFile,
  saveJsonToFile,
  saveTextToFile,
  getTimestamp,
  log,
  handleApiError,
  colIndexToLetter,
};
