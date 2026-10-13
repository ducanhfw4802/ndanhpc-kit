# 📋 Jira & Xray Integration Scripts

> Bộ scripts Node.js kết nối Antigravity Testing Kit với Jira REST API và Xray Test Management.

---

## 📁 Cấu trúc thư mục

```
.agents/scripts/integrations/
└── jira/                        # Self-contained Jira integration
    ├── jira_fetcher.js          # Lấy Requirements / User Stories / Issues từ Jira
    ├── xray_auth.js             # Xác thực và quản lý Token Xray Cloud
    ├── xray_importer.js         # Import kết quả test (Playwright/JUnit) lên Xray
    ├── utils.js                 # Hàm utility dùng chung
    ├── .env.example             # Template biến môi trường
    ├── .env                     # Biến môi trường thực tế (KHÔNG commit)
    ├── package.json             # Dependencies (axios, dotenv)
    ├── package-lock.json        # Lock file (BẮT BUỘC commit)
    ├── node_modules/            # (auto-generated)
    └── README.md                # Tài liệu hướng dẫn (file này)
```

> 💡 Mỗi integration (google_sheet, redmine...) sẽ có thư mục riêng, tự quản lý dependencies và config.

---

## ⚡ Cài đặt nhanh

### 1. Cài dependencies

```bash
cd .agents/scripts/integrations/jira
npm install
```

### 2. Tạo file `.env`

```bash
cd .agents/scripts/integrations/jira
cp .env.example .env
```

### 3. Điền thông tin xác thực

Mở file **`.agents/scripts/integrations/jira/.env`** và điền:

```env
# Jira Cloud
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=PROJ

# Xray Cloud (nếu dùng)
XRAY_PLATFORM=cloud
XRAY_CLIENT_ID=your-client-id
XRAY_CLIENT_SECRET=your-client-secret
```

---

## 🔑 Cách lấy Credentials

### Jira API Token

> Script sử dụng xác thực **Basic Auth** (Email + API Token) cho Jira Cloud.

1. Truy cập: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Đặt label (ví dụ: `antigravity-automation`) → Click **Create**
4. **Copy token ngay** → Dán vào `JIRA_API_TOKEN` trong file `.env`

> ⚠️ Token chỉ hiển thị **MỘT LẦN**. Nếu mất, phải tạo mới.

### Xray Cloud API Key (nếu dùng Xray)

1. Jira → Apps → Xray → Settings → **API Keys**
2. Hoặc: https://app.getxray.app → Settings → API Keys
3. Tạo API Key → Copy **Client ID** và **Client Secret** vào `.env`

### Cách lấy JIRA_BASE_URL

Nhìn URL trên trình duyệt khi mở Jira:

```
https://your-domain.atlassian.net/jira/software/projects/PROJ/boards/1
└──────────── JIRA_BASE_URL ────────────┘
```

Chỉ lấy phần `https://your-domain.atlassian.net` (không có `/jira/...`)

### Cách lấy JIRA_PROJECT_KEY

Nhìn vào URL hoặc Issue Key:

```
URL:       .../projects/KAN/boards/1  →  Project Key = KAN
Issue Key: KAN-1                      →  Project Key = KAN
```

---

## 🚀 Sử dụng

### jira_fetcher.js — Lấy Issues từ Jira

```bash
# Xem hướng dẫn
node .agents/scripts/integrations/jira/jira_fetcher.js --help

# Lấy 1 issue cụ thể (output: JSON)
node .agents/scripts/integrations/jira/jira_fetcher.js --issue KAN-1

# Lấy 1 issue → xuất Markdown requirement
node .agents/scripts/integrations/jira/jira_fetcher.js --issue KAN-1 --format md

# Lấy tất cả Stories trong project
node .agents/scripts/integrations/jira/jira_fetcher.js --project KAN --type Story

# Lấy tối đa 10 Bugs
node .agents/scripts/integrations/jira/jira_fetcher.js --project KAN --type Bug --max 10

# Tìm bằng JQL tùy chỉnh
node .agents/scripts/integrations/jira/jira_fetcher.js --jql "project = KAN AND status = 'In Progress'"

# Lấy tất cả Story/Task thuộc Epic
node .agents/scripts/integrations/jira/jira_fetcher.js --epic KAN-5

# Lấy children của Epic → xuất Markdown
node .agents/scripts/integrations/jira/jira_fetcher.js --epic KAN-5 --format md

# Lấy kèm file đính kèm (attachments)
node .agents/scripts/integrations/jira/jira_fetcher.js --epic KAN-5 --format md --attachments

# Lấy 1 issue + tải attachments
node .agents/scripts/integrations/jira/jira_fetcher.js --issue KAN-4 --attachments

# Chỉ định thư mục output
node .agents/scripts/integrations/jira/jira_fetcher.js --issue KAN-1 --output ./my-output
```

**Options:**

| Option | Mô tả | Mặc định |
|--------|--------|----------|
| `--issue <KEY>` | Lấy 1 issue cụ thể | — |
| `--project <KEY>` | Lấy issues theo project | — |
| `--jql <QUERY>` | Tìm bằng JQL query | — |
| `--epic <KEY>` | Lấy tất cả Story/Task/Bug thuộc Epic | — |
| `--type <TYPE>` | Loại issue: Story, Bug, Task, Epic | Story |
| `--max <N>` | Số kết quả tối đa | 50 |
| `--format <FMT>` | Định dạng output: `json` hoặc `md` | json |
| `--attachments` | Tải kèm file đính kèm | không tải |
| `--output <DIR>` | Thư mục lưu file | `requirements/jira/` |

**Cấu trúc output:**

Mỗi story/task được tách thành thư mục riêng — gom file `.md` + attachments cùng folder, tiện cho việc gen test case:

```
requirements/jira/
└── KAN-5/                                  # Thư mục Epic
    ├── KAN-5_overview.md                   # Tổng quan (danh sách + link)
    ├── KAN-1/                              # Story — self-contained
    │   ├── KAN-1_requirement.md            # Requirement riêng
    │   └── forgot_password_ui.png          # Attachment cùng folder
    └── KAN-4/                              # Task — self-contained
        ├── KAN-4_requirement.md
        ├── login_form.png
        └── error_message.png
```

> 💡 **Tip:** Trỏ vào folder `KAN-1/` → gen test case cho 1 story. Trỏ vào `KAN-5/` → gen cho cả Epic.

**Output mẫu (JSON):**

```json
{
  "fetchedAt": "2026-04-03T04:39:18.000Z",
  "mode": "project",
  "total": 3,
  "issues": [
    {
      "key": "KAN-1",
      "summary": "Authentication CRM",
      "status": "To Do",
      "priority": "High",
      "issueType": "Story",
      "assignee": "Unassigned",
      "reporter": "Người Tình Quê"
    }
  ]
}
```

**Output mẫu (Markdown):**

```markdown
# KAN-1: Authentication CRM

| Thuộc tính | Giá trị |
|---|---|
| **Issue Key** | KAN-1 |
| **Loại** | Story |
| **Trạng thái** | To Do |
| **Độ ưu tiên** | High |

## Mô tả (Description)
Xác thực hệ thống CRM
```

---

### xray_auth.js — Xác thực Xray

```bash
# Lấy token mới
node .agents/scripts/integrations/jira/xray_auth.js

# Verify token đang dùng
node .agents/scripts/integrations/jira/xray_auth.js --verify
```

Token được cache tự động tại `.xray_token_cache.json` (hết hạn sau 1 giờ).

---

### xray_importer.js — Đẩy kết quả test lên Xray

```bash
# Xem hướng dẫn
node .agents/scripts/integrations/jira/xray_importer.js --help

# Import Playwright JSON report
node .agents/scripts/integrations/jira/xray_importer.js \
  --format playwright \
  --file ./test-results.json \
  --project KAN

# Import JUnit XML
node .agents/scripts/integrations/jira/xray_importer.js \
  --format junit \
  --file ./junit-results.xml \
  --project KAN

# Import Xray JSON (đã format sẵn)
node .agents/scripts/integrations/jira/xray_importer.js \
  --format xray \
  --file ./xray-payload.json
```

**Options:**

| Option | Mô tả | Mặc định |
|--------|--------|----------|
| `--format <FMT>` | Format: `playwright`, `junit`, `xray` | xray |
| `--file <PATH>` | Đường dẫn file report | — |
| `--project <KEY>` | Jira Project Key | Từ `.env` |
| `--testplan <KEY>` | Link vào Test Plan (optional) | — |

> 💡 **Tip:** Đặt Jira key trong tên test để Xray mapping tự động:
> ```typescript
> test('[KAN-1] Login should work', async ({ page }) => { ... });
> ```

---

## 🔧 Sử dụng như Module (Programmatic)

Ngoài CLI, bạn có thể import và sử dụng trong code:

```javascript
const { fetchIssue, searchIssues, issueToRequirementMarkdown } = require('./jira_fetcher');
const { getXrayCloudToken, buildXrayHeaders } = require('./xray_auth');
const { importToXrayCloud, convertPlaywrightToXray } = require('./xray_importer');

// Lấy 1 issue
const issue = await fetchIssue('KAN-1');

// Tìm kiếm
const issues = await searchIssues('project = KAN AND issuetype = Story', 20);

// Chuyển thành Markdown
const md = issueToRequirementMarkdown(issue);
```

---

## 🤖 Sử dụng qua Antigravity Agent

Bạn có thể gọi các slash commands sau trong Antigravity (Gemini):

| Command | Mô tả |
|---------|--------|
| `/fetch_jira_requirements` | Agent hỏi issue key rồi tự chạy script |
| `/import_test_results_xray` | Agent tìm report file rồi đẩy lên Xray |

---

## ❓ Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|------|-------------|-----------|
| `File .env không tồn tại` | Chưa tạo `.env` | `cd .agents/scripts/integrations && cp .env.example .env` |
| `HTTP 401` | Token sai | Tạo lại API Token tại id.atlassian.com |
| `HTTP 403` | Không có quyền | Kiểm tra account có access vào project |
| `HTTP 404` | URL sai / issue không tồn tại | Kiểm tra `JIRA_BASE_URL` (không có `/` cuối) |
| `MODULE_NOT_FOUND` | Chưa cài npm | `cd .agents/scripts/integrations && npm install` |
| `ENOTFOUND` | Domain sai | Kiểm tra domain trong `JIRA_BASE_URL` |
| `Xray Auth failed` | Client ID/Secret sai | Tạo lại API Key trong Xray Settings |

---

## 📌 Lưu ý bảo mật

- ❌ **KHÔNG** commit file `.env` lên Git (đã có trong `.gitignore`)
- ❌ **KHÔNG** commit file `.xray_token_cache.json`
- ✅ Chỉ commit file `.env.example` (template không chứa giá trị thật)
- ✅ Mỗi thành viên tự tạo `.env` riêng với credentials cá nhân

---

## 📚 Tham khảo

- [Jira Cloud REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Xray Cloud REST API v2](https://docs.getxray.app/display/XRAYCLOUD/REST+API)
- [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- [JQL Syntax Guide](https://support.atlassian.com/jira-software-cloud/docs/use-advanced-search-with-jira-query-language-jql/)
