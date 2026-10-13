# 📊 Google Sheets Integration Scripts

> Bộ scripts Node.js kết nối Antigravity Testing Kit với Google Sheets API — đọc test data, ghi kết quả test automation, và quản lý dữ liệu kiểm thử.

---

## 📁 Cấu trúc thư mục

```
.agents/scripts/integrations/
└── google_sheet/                  # Self-contained Google Sheets integration
    ├── sheet_auth.js              # Kiểm tra xác thực và kết nối
    ├── sheet_reader.js            # Đọc dữ liệu từ Google Sheets
    ├── sheet_writer.js            # Ghi kết quả test lên Google Sheets
    ├── utils.js                   # Hàm utility dùng chung
    ├── .env.example               # Template biến môi trường
    ├── .env                       # Biến môi trường thực tế (KHÔNG commit)
    ├── service-account.json       # Service Account key (KHÔNG commit)
    ├── package.json               # Dependencies (googleapis, dotenv)
    ├── package-lock.json          # Lock file (BẮT BUỘC commit)
    ├── node_modules/              # (auto-generated)
    └── README.md                  # Tài liệu hướng dẫn (file này)
```

---

## ⚡ Cài đặt nhanh

### 1. Cài dependencies

```bash
cd .agents/scripts/integrations/google_sheet
npm install
```

### 2. Tạo file `.env`

```bash
cp .env.example .env
```

### 3. Cấu hình xác thực

Xem phần **[Cách lấy Credentials](#-cách-lấy-credentials)** bên dưới.

### 4. Verify kết nối

```bash
# Verify kết nối Spreadsheet
node sheet_auth.js --verify

# Verify + đọc thử một sheet cụ thể
node sheet_auth.js --verify --sheet "Login"
```

---

## 🔑 Cách lấy Credentials

### Phương pháp 1: Service Account (Khuyến nghị)

> Dùng cho automation, CI/CD pipeline. Hỗ trợ đầy đủ đọc & ghi.

**Bước 1: Tạo Google Cloud Project**

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project hiện có

**Bước 2: Bật Google Sheets API**

1. APIs & Services → Library
2. Tìm **"Google Sheets API"** → Click **Enable**

**Bước 3: Tạo Service Account** _(bỏ qua nếu đã có)_

1. APIs & Services → **Credentials** → **Create Credentials** → **Service Account**
2. Điền tên (VD: `antigravity-automation`) → Click **Create and continue** → Done

**Bước 4: Tải file JSON Key** ⬅️ _Đây là bước quan trọng_

1. Vào **IAM & Admin** → **Service Accounts**
2. Click vào tên Service Account của bạn (VD: `antigravity-automation`)
3. Chọn tab **"Keys"** (thanh menu ngang phía trên)
4. Click **"Add key"** → **"Create new key"**

   > ⚠️ Nếu đã thấy key cũ trong danh sách (Status: Active) nhưng **không có file JSON**
   > → File đó đã tải về trước đó và Google **không cho tải lại**.
   > → Bạn cần tạo key mới bằng cách click **"Add key"** → **"Create new key"**.

5. Chọn **"JSON"** → Click **"Create"**
6. Trình duyệt sẽ **tự động tải file `.json`** về máy (thường vào thư mục Downloads)
7. **Đổi tên file** thành `service-account.json`
8. **Di chuyển file** vào thư mục này:
   ```
   .agents/scripts/integrations/google_sheet/service-account.json
   ```

> ⚠️ **Quan trọng:** File JSON chỉ được tải **đúng 1 lần** ngay lúc tạo. Nếu mất file, phải tạo key mới (lặp lại từ bước 4).

**Bước 5: Cấu hình file .env**

Mở file `.agents/scripts/integrations/google_sheet/.env` và điền:

```env
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account.json
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

**Bước 6: Share Spreadsheet cho Service Account**

> Bước này bắt buộc — nếu không, script sẽ báo lỗi `HTTP 403`.

1. Mở Google Spreadsheet cần tích hợp
2. Click **"Share"** (góc trên phải)
3. Nhập **email của Service Account** — tìm trong file `service-account.json`, trường `client_email`:
   ```json
   "client_email": "antigravity-automation@your-project.iam.gserviceaccount.com"
   ```
4. Cấp quyền **"Editor"** (để cả đọc + ghi)
5. Bỏ tích "Notify people" nếu muốn → Click **"Share"**

**Bước 7: Lấy Spreadsheet ID**

Nhìn vào URL khi mở Google Sheet trên trình duyệt:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
                                        ↑─────────────────────────────────────────────┘
                                                   Copy toàn bộ phần này
```

Dán vào `GOOGLE_SPREADSHEET_ID` trong file `.env`.

**Bước 8: Verify kết nối**

```bash
cd .agents/scripts/integrations/google_sheet
node sheet_auth.js --verify
```

---

### Phương pháp 2: API Key (Read-only)

> Chỉ dùng cho Sheets công khai, không cần xác thực phức tạp.

1. Tạo API Key tại: https://console.cloud.google.com/apis/credentials
2. Đặt Google Sheet ở chế độ **"Anyone with link can view"**
3. Cấu hình `.env`:

```env
GOOGLE_API_KEY=your-api-key-here
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
```

> ⚠️ API Key **không thể ghi data**. Dùng Service Account nếu cần import kết quả test.

---

## 🚀 Sử dụng

### sheet_auth.js — Kiểm tra kết nối

```bash
# Hiển thị hướng dẫn cài đặt
node .agents/scripts/integrations/google_sheet/sheet_auth.js --setup

# Verify kết nối Spreadsheet (liệt kê tất cả sheets)
node .agents/scripts/integrations/google_sheet/sheet_auth.js --verify

# Verify + đọc thử một sheet cụ thể ← truyền tên sheet trực tiếp
node .agents/scripts/integrations/google_sheet/sheet_auth.js --verify --sheet "Login"
node .agents/scripts/integrations/google_sheet/sheet_auth.js --verify --sheet "Test Results"
```

**Options:**

| Option | Mô tả |
|--------|--------|
| `--verify` | Kiểm tra kết nối và liệt kê tất cả sheets |
| `--verify --sheet <NAME>` | Verify + đọc thử sheet cụ thể (kiểm tra tồn tại & quyền đọc) |
| `--setup` | Hiển thị hướng dẫn cài đặt credentials chi tiết |

**Output mẫu `--verify`:**

```
[LOG] Đang kiểm tra kết nối Google Sheets API...
[LOG] ✅ Kết nối thành công!
[LOG] 📊 Spreadsheet: "Antigravity Integration - Anh Tester"
[LOG] 🔗 URL: https://docs.google.com/spreadsheets/d/.../edit
[LOG] 📋 Danh sách Sheets:
[LOG]    1. "Login" (ID: 0, Rows: 1000, Cols: 26)
[LOG]    2. "Test Results" (ID: 1, Rows: 1000, Cols: 26)
[LOG] 🔑 Auth: Service Account (antigravity-automation@project.iam.gserviceaccount.com)
```

**Output mẫu `--verify --sheet "Login"` (sheet có data):**

```
[LOG] ✅ Kết nối thành công!
[LOG] 📋 Danh sách Sheets:
[LOG]    1. "Login" (ID: 0, Rows: 1000, Cols: 26) ◀ đang verify
[LOG] 🔑 Auth: Service Account (...)
[LOG]
[LOG] 🔍 Đang verify sheet: "Login"...
[LOG] ✅ Sheet "Login" có thể đọc được — 2 row(s) đầu tiên tìm thấy.
[LOG]    Giá trị A1: "EMAIL"
```

**Output khi sheet không tồn tại:**

```
[LOG] 🔍 Đang verify sheet: "SheetKhongTonTai"...
[ERROR] ❌ Sheet "SheetKhongTonTai" không tồn tại trong Spreadsheet này.
[LOG] 💡 Các sheet hiện có: "Login", "Test Results"
```

---

### sheet_reader.js — Đọc dữ liệu từ Sheets

```bash
# Liệt kê tất cả sheets trong Spreadsheet
node .agents/scripts/integrations/google_sheet/sheet_reader.js --list

# Đọc toàn bộ sheet
node .agents/scripts/integrations/google_sheet/sheet_reader.js --sheet "Test Cases"

# Đọc một range cụ thể
node .agents/scripts/integrations/google_sheet/sheet_reader.js --sheet "Sheet1" --range "A1:G50"

# Xuất ra Markdown
node .agents/scripts/integrations/google_sheet/sheet_reader.js --sheet "Requirements" --format md

# Đọc nhiều sheets cùng lúc (batch)
node .agents/scripts/integrations/google_sheet/sheet_reader.js --batch "Test Cases,Requirements,Test Data"

# Chỉ định thư mục output
node .agents/scripts/integrations/google_sheet/sheet_reader.js --sheet "Test Cases" --output ./requirements
```

**Options:**

| Option | Mô tả | Mặc định |
|--------|--------|----------|
| `--list` | Liệt kê tất cả sheets | — |
| `--sheet <NAME>` | Tên sheet (tab) cần đọc | — |
| `--range <A1>` | Range VD: `A1:G100` | Toàn bộ sheet |
| `--batch <NAMES>` | Nhiều sheets, cách nhau dấu phẩy | — |
| `--format <FMT>` | Output: `json` hoặc `md` | `json` |
| `--output <DIR>` | Thư mục lưu file | `requirements/google_sheet/` |

**Cấu trúc output:**

```
requirements/google_sheet/
├── Test_Cases/
│   └── Test_Cases_data.json     # Dữ liệu JSON
├── Requirements/
│   └── Requirements.md          # Bảng Markdown
└── batch_20260405_163000/
    ├── _overview.md             # Tổng quan batch
    ├── Test_Cases.md
    └── Requirements.md
```

**Output mẫu (JSON):**

```json
{
  "readAt": "2026-04-05T09:30:00.000Z",
  "spreadsheetId": "1BxiMVs0...",
  "sheetName": "Test Cases",
  "totalRows": 25,
  "headers": ["ID", "Title", "Priority", "Status", "Steps"],
  "data": [
    { "ID": "TC-001", "Title": "Login with valid credentials", "Priority": "High", "Status": "Ready" }
  ]
}
```

---

### sheet_writer.js — Ghi kết quả test lên Sheets

#### 📁 Upload file Excel (.xlsx/.xls) ← MỚI

```bash
# Upload file Excel lên sheet mới hoặc sheet đã có
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --excel ./requirements/crm/test_cases_crm_login.xlsx \
  --sheet "CRM_TC_LOGIN"

# Upload tab thứ 2 trong file Excel (index bắt đầu từ 0)
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --excel ./data.xlsx --sheet "MySheet" --sheet-index 1

# Upload nhưng KHÔNG xóa data cũ (ghi đè từ A1)
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --excel ./data.xlsx --sheet "Existing" --no-clear
```

**Output mẫu `--excel`:**

```
[LOG] Đọc file Excel: test_cases_crm_login.xlsx
[LOG] Excel sheet: "Test Cases" → 31 rows × 9 cột
[LOG] Google Sheet đích: "CRM_TC_LOGIN"
[LOG] Sheet "CRM_TC_LOGIN" đã tồn tại.
[LOG] Xóa data cũ trong "CRM_TC_LOGIN"...
[LOG] Đang upload 31 rows...
[LOG] ✅ Upload hoàn tất: 31 rows → Sheet "CRM_TC_LOGIN"

--- Kết quả upload Excel ---
  📁 File: test_cases_crm_login.xlsx
  📋 Excel sheet: "Test Cases" (index 0)
  📊 Rows: 31 | Cols: 9
  ✅ Google Sheet: "CRM_TC_LOGIN"
  🔗 URL: https://docs.google.com/spreadsheets/d/.../edit
```

> **Lưu ý:** Ký tự xuống dòng (`\n`) trong nội dung cell sẽ tự động được thay bằng ` | ` để hiển thị phẳng trên Google Sheet.

---

#### 📊 Import Playwright JSON Report

```bash
# Import Playwright JSON report (mặc định sheet "Test Results")
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --results ./test-results/results.json

# Import vào sheet tùy chỉnh
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --results ./playwright-report/results.json \
  --sheet "Sprint 5 Results"

# Import + xóa data cũ trước (giữ header)
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --results ./results.json --clear-first

# Append custom data
node .agents/scripts/integrations/google_sheet/sheet_writer.js \
  --append "Test Data" \
  --data '[{"Name":"John Doe","Email":"john@test.com","Role":"Admin"}]'

# Xóa data trong sheet (giữ header row 1)
node .agents/scripts/integrations/google_sheet/sheet_writer.js --clear "Test Results"

# Tạo sheet mới
node .agents/scripts/integrations/google_sheet/sheet_writer.js --create "Sprint 6 Results"
```

**Options:**

| Option | Mô tả | Mặc định |
|--------|--------|----------|
| `--excel <FILE>` | Upload file Excel (.xlsx/.xls) lên Google Sheet | — |
| `--sheet <NAME>` | Sheet đích — BẮT BUỘC khi dùng `--excel` | `"Test Results"` |
| `--sheet-index <N>` | Index tab Excel (0 = đầu tiên) — dùng với `--excel` | `0` |
| `--no-clear` | Không xóa data cũ trước khi upload — dùng với `--excel` | false |
| `--results <FILE>` | Đường dẫn Playwright JSON report | — |
| `--clear-first` | Xóa data cũ trước khi ghi — dùng với `--results` | false |
| `--append <SHEET>` | Append data vào sheet | — |
| `--data <JSON>` | JSON array để append | — |
| `--clear <SHEET>` | Xóa data trong sheet | — |
| `--range <A1>` | Range cần xóa | `A2:Z10000` |
| `--create <NAME>` | Tạo sheet mới | — |

**Cấu trúc Test Results Sheet:**

| Test ID | Title | Status | Duration (ms) | Error | Suite | File | Run At | Retries | Annotations |
|---------|-------|--------|---------------|-------|-------|------|--------|---------|-------------|
| abc123 | Login test | **PASS** | 1250 | | Auth | login.spec.ts | 2026-04-05 09:30 | 0 | |
| def456 | Invalid login | **FAIL** | 2100 | Expected... | Auth | login.spec.ts | 2026-04-05 09:31 | 1 | |

**Màu sắc tự động:**
- 🟢 **PASS** — Nền xanh lá `#26CC60`
- 🔴 **FAIL** — Nền đỏ `#EA4335`
- 🟡 **SKIP** — Nền vàng `#FFC104`

---

## 🔧 Sử dụng như Module (Programmatic)

```javascript
const { readSheet, listSheets } = require('./sheet_reader');
const { importPlaywrightResults, importExcel, appendRows } = require('./sheet_writer');
const { verifyConnection } = require('./sheet_auth');

// Đọc dữ liệu test data từ Sheets
const testData = await readSheet('Test Data');
console.log(testData.data); // Array of objects

// Upload file Excel lên Google Sheet
await importExcel('./requirements/crm_login.xlsx', 'CRM_TC_LOGIN', {
  sheetIndex: 0,    // Tab đầu tiên của file Excel
  clearFirst: true, // Xóa data cũ trước khi upload
});

// Import kết quả Playwright
await importPlaywrightResults('./test-results.json', 'Test Results', {
  clearFirst: false,
  addSummaryRow: true,
});

// Kiểm tra kết nối (cấp Spreadsheet)
const ok = await verifyConnection();

// Kiểm tra kết nối + verify sheet cụ thể
const ok2 = await verifyConnection('Login');
```

---

## 🤖 Sử dụng trong Playwright Test

### Đọc test data từ Sheets

```typescript
// e2e/helpers/sheet-data.ts
import { readSheet } from '../../.agents/scripts/integrations/google_sheet/sheet_reader';

export async function getTestUsers(): Promise<object[]> {
  const result = await readSheet('Test Users');
  return result.data;
}
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';
import { getTestUsers } from './helpers/sheet-data';

test.describe('Data-driven Login Tests', () => {
  let testUsers: object[];
  
  test.beforeAll(async () => {
    testUsers = await getTestUsers();
  });

  for (const user of testUsers) {
    test(`Login with ${user['Role']}`, async ({ page }) => {
      await page.goto('/login');
      await page.fill('#email', user['Email']);
      await page.fill('#password', user['Password']);
      await page.click('#login-btn');
      await expect(page).toHaveURL('/dashboard');
    });
  }
});
```

### Cấu hình Playwright để xuất JSON report

```typescript
// playwright.config.ts
export default {
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
};
```

Sau khi chạy test:
```bash
npx playwright test
node .agents/scripts/integrations/google_sheet/sheet_writer.js --results ./test-results/results.json
```

---

## ❓ Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|------|-------------|-----------|
| `File .env không tồn tại` | Chưa tạo `.env` | `cp .env.example .env` |
| `HTTP 403` | Service Account không có quyền | Share Spreadsheet cho email SA với quyền Editor |
| `HTTP 404` | Spreadsheet ID sai | Kiểm tra `GOOGLE_SPREADSHEET_ID` trong `.env` |
| `Unable to parse range` | Tên sheet có khoảng trắng | Dùng `'Sheet Name'` hoặc kiểm tra tên sheet |
| `Không tìm thấy file service-account.json` | File key chưa được đặt | Tải JSON từ Google Cloud Console |
| `MODULE_NOT_FOUND` | Chưa cài npm | `npm install` |
| `Error: invalid_grant` | Service Account key hết hạn | Tạo key mới trong Google Cloud Console |
| `Quota exceeded` | Vượt giới hạn API | `googleapis` free: 60 requests/phút. Thêm delay nếu cần |

---

## 📌 Lưu ý bảo mật

- ❌ **KHÔNG** commit file `.env` lên Git
- ❌ **KHÔNG** commit file `service-account.json` (credentials thật)
- ✅ Chỉ commit file `.env.example` (template không chứa giá trị thật)
- ✅ Thêm `service-account.json` và `.env` vào `.gitignore`
- ✅ Dùng GitHub Secrets / CI environment variables trong CI/CD

---

## 📚 Tham khảo

- [Google Sheets API v4 Documentation](https://developers.google.com/sheets/api/reference/rest)
- [googleapis Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-account-overview)
- [A1 Notation Reference](https://developers.google.com/sheets/api/guides/concepts#cell)
