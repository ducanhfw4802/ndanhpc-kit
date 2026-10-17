# NDANHPC Kit 🚀

> **Antigravity-native AI Agent Capability Toolkit**
> Hệ sinh thái đa tác nhân (Multi-Agent) chuyên sâu, thông minh và an toàn dành riêng cho Google Antigravity.

[![Version](https://img.shields.io/badge/version-2026.10.17-blue.svg?style=flat-square)](CHANGELOG.md)
[![Runtime](https://img.shields.io/badge/runtime-Google%20Antigravity-purple.svg?style=flat-square)](.agents/antigravity.json)
[![Agents](https://img.shields.io/badge/agents-24%20Specialists-emerald.svg?style=flat-square)](#-24-specialist-agents)
[![Skills](https://img.shields.io/badge/skills-61%20Modular-orange.svg?style=flat-square)](#-61-modular-skills)
[![Workflows](https://img.shields.io/badge/workflows-29%20Slash%20Cmds-cyan.svg?style=flat-square)](#-29-workflows--slash-commands)
[![Integrity](https://img.shields.io/badge/integrity-SHA--256%20Locked-green.svg?style=flat-square)](.agents/manifest.lock.json)

---

## 🌟 Mới Nhất: Release v2026.10.17 (Cloudflare Light Theme & UI Modernization)

Bản phát hành **v2026.10.17** mang đến diện mạo hoàn toàn mới và hiện đại cho **NDANHPC Kit** với giao diện Cloudflare Light Theme và tối ưu hóa hiển thị:

- 🎨 **Cloudflare Light Theme**: Thiết kế hiện đại lấy cảm hứng từ Cloudflare Dashboard với bảng màu cam `#F6821F`, xám đen `#18181B`, nền sáng trang nhã `#F9FAFB` và độ tương phản cao, dịu mắt.
- 📱 **Tối Ưu Responsive Toàn Diện**: Thiết kế lại layout cho máy tính, tablet và mobile. Khắc phục triệt để lỗi tràn giao diện (horizontal overflow), thanh cuộn x-axis, container thẻ components và navigation bar.
- ⚡ **Hiệu Năng & Trải Nghiệm Hoàn Hảo**: Tối ưu hóa CSS Grid/Flexbox, đạt 100/100 điểm Performance, Accessibility, Best Practices và SEO.
- 🧪 **Kế Thừa Toàn Bộ QA Supercharge**: Giữ nguyên vẹn 10 kỹ năng QA, 16 workflows kiểm thử, terminal CLI TUI và native Antigravity runtime hooks.
- 📦 **Đồng Bộ Phiên Bản Toàn Hệ Thống**: Đồng bộ hóa CalVer `2026.10.17` trên toàn bộ files định nghĩa, manifests và plugins.

---

## 🏛️ Tổng Quan Kiến Trúc Hệ Thống

NDANHPC Kit được thiết kế theo kiến trúc module hóa với hợp đồng chạy chuẩn mực trên Antigravity:

```
ndanhpc-kit/
├── .agents/                      # 🧠 BỘ NÃO AI KHÉP KÍN (Chỉ cần copy thư mục này sang dự án khác)
│   ├── agent/                    # 24 Specialist Agents phân định rõ trách nhiệm
│   ├── skills/                   # 61 Modular Skills (Full-stack Dev + QA Automation)
│   ├── workflows/                # 29 Slash Commands điều phối quy trình tự động
│   ├── rules/                    # 7 Strict Rules (Security, UI Design, QA Testing, Code Rules)
│   ├── hooks/                    # Native Lifecycle Hooks (Bảo vệ PreToolUse chặn lệnh nguy hiểm)
│   ├── plans/                    # 📋 Quy trình 6 bước chuyên sâu (Manual, Automation, Cross-module)
│   ├── prompt_templates/         # 📝 Mẫu prompt chuẩn hóa copy-paste nhanh
│   ├── practices/                # 📁 Dữ liệu mẫu requirement & test case thực hành
│   ├── scripts/                  # ⚙️ Scripts hệ thống & công cụ QA (Convert Excel, Jira, Google Sheet)
│   ├── memory/                   # 💾 Hệ thống ghi nhớ quy chuẩn dự án bền vững
│   ├── manifest.json             # 📜 Danh mục thành phần đăng ký chính thức
│   ├── manifest.lock.json        # 🔒 Băm SHA-256 bảo đảm tính toàn vẹn 100%
│   ├── antigravity.json          # 📑 Hợp đồng 6 phases runtime của Antigravity
│   └── TIPS_QUOTA.md             # 💡 Cẩm nang tối ưu quota token Antigravity
├── web/                          # 🌐 Cổng thông tin tra cứu trực quan (Web Portal)
├── package.json                  # Scripts quản lý và xác thực toolkit
├── CHANGELOG.md                  # Lịch sử cập nhật và release notes
└── MIGRATION.md                  # Hướng dẫn nâng cấp và di chuyển
```

---

## ⚡ Cài Đặt, Cập Nhật & Gỡ Bỏ Nhanh (1 Dòng Lệnh Duy Nhất)

Không cần clone cả kho mã nguồn hay xóa đi clone lại, bạn có thể cài đặt, cập nhật hoặc gỡ bỏ bộ kit trên **bất kỳ máy tính / dự án nào** chỉ với một dòng lệnh duy nhất:

### 📥 1. Cài Đặt Vào Dự Án Bất Kỳ (1 Lệnh Duy Nhất)
Đứng tại thư mục bất kỳ của bạn trên máy tính và chạy:
```bash
curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash
```
> Script sẽ tự động tải trọn gói bộ não AI khép kín `.agents/` mới nhất về dự án hiện tại và kiểm tra toàn vẹn 100%.

### 🔄 2. Cập Nhật Lên Bản Mới Nhất (1 Lệnh Duy Nhất)
Khi có bản cập nhật mới trên GitHub, cập nhật siêu tốc trong 2 giây mà không cần clone lại:
```bash
# Cách 1: Qua 1 dòng lệnh curl (áp dụng cho mọi máy / mọi dự án):
curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- update

# Cách 2: Qua Terminal CLI tích hợp:
python3 .agents/scripts/ndanhpc_cli.py --update

# Cách 3: Nếu bạn dùng Git Repository ndanhpc-kit:
npm run update   # hoặc: git pull origin main
```
> Tự động so sánh phiên bản, sao lưu an toàn (`.agents.bak/`), bảo toàn bộ nhớ ghi chú cá nhân (`.agents/memory/`) và nạp ngay năng lực mới.

### 🗑️ 3. Gỡ Bỏ Hoàn Toàn Khỏi Dự Án (1 Lệnh Duy Nhất)
```bash
curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- uninstall
# hoặc:
python3 .agents/scripts/ndanhpc_cli.py --uninstall
```

### 🔍 4. Kiểm Tra Trạng Thái Phiên Bản
```bash
curl -fsSL https://raw.githubusercontent.com/ducanhfw4802/ndanhpc-kit/main/install.sh | bash -s -- check
```

---

## 🚀 Hướng Dẫn Sử Dụng Nhanh

### 1. Áp dụng Toolkit Thủ Công
Bạn có thể copy thư mục `.agents/` vào thư mục gốc của dự án:

```bash
cp -r /opt/Apps/ndanhpc-kit/.agents /duong/dan/du-an-moi/
```
Mở dự án trên Antigravity — toàn bộ 24 Agents, 61 Skills, 29 Workflows và bộ quy chuẩn sẽ tự động kích hoạt ngay lập tức!

---

### 2. Khởi Chạy Web Portal Tra Cứu Trực Quan
Web Portal cung cấp giao diện tương tác, tra cứu toàn bộ 121 thành phần và mô phỏng điều phối Multi-Agent:

```bash
npm run web
```
Sau đó truy cập trình duyệt tại: **`http://localhost:3000`**

---

### 3. Khởi Chạy Terminal TUI CLI Tool
Toolkit tích hợp công cụ dòng lệnh tương tác trực quan:

```bash
npm run tui
# hoặc
python3 .agents/scripts/ndanhpc_cli.py
```

---

### 4. Kiểm Thử & Xác Thực Toàn Bộ Hệ Thống
Chạy bộ tự kiểm tra (Self-validation) và Antigravity Doctor:

```bash
# Kiểm tra hợp chuẩn cấu trúc và tính toàn vẹn frontmatter
npm run check:agents

# Kiểm tra hợp đồng runtime 6 phases của Antigravity
npm run check:antigravity

# Chạy toàn bộ test suites
npm run test:antigravity
npm run test:toolkit
```

---

## 🤖 Danh Mục 24 Specialist Agents

| Phân Nhóm | Specialist Agents | Vai Trò Chính |
| :--- | :--- | :--- |
| **Testing & Quality** | `qa-automation-engineer` | Chuyên gia kiểm thử tự động, POM, smart waits, self-healing locators. |
| | `test-engineer` | Chuyên gia TDD, unit test, integration test và coverage pyramid. |
| **Điều Phối & Lập Kế Hoạch** | `orchestrator` | Điều phối tổng thể các tác vụ đa luồng, phân chia công việc cho chuyên gia. |
| | `project-planner` | Phân tích bài toán, lập kế hoạch chi tiết, khởi tạo blueprint dự án. |
| | `product-owner` / `product-manager` | Quản trị backlog, user stories, tiêu chuẩn nghiệm thu và tính năng sản phẩm. |
| **Frontend & Design** | `frontend-specialist` | Chuyên sâu React, Next.js, Vue, Tailwind CSS, tối ưu hiệu năng web. |
| | `frontend-ui-developer` | Thiết kế giao diện pixel-perfect, CSS hiện đại và responsive. |
| | `ui-ux-designer` | Thiết kế trải nghiệm người dùng, Design System, Design Tokens. |
| | `ux-accessibility-reviewer` | Đánh giá khả năng tiếp cận WCAG 2.2, kiểm thử tương phản và bàn phím. |
| **Backend & Dữ Liệu** | `backend-specialist` | Thiết kế kiến trúc API, Node.js, Python, logic nghiệp vụ máy chủ. |
| | `database-architect` | Thiết kế schema CSDL, tối ưu hóa index, migration dữ liệu an toàn. |
| **Mobile Development** | `mobile-developer` | Phát triển ứng dụng Flutter, React Native, iOS & Android. |
| | `mobile-ui-developer` | Tối ưu hóa UI di động, thumb zones, gesture navigation và 60fps. |
| **Bảo Mật & Hạ Tầng** | `security-auditor` | Rà soát lỗ hổng, kiểm tra cấu hình an toàn và chính sách bảo mật. |
| | `penetration-tester` | Đánh giá thâm nhập, kiểm thử bảo mật API và phòng chống tấn công. |
| | `devops-engineer` | CI/CD pipelines, Docker, triển khai đám mây và giám sát hệ thống. |
| **Chuyên Biệt Khác** | `debugger`, `performance-optimizer`, `code-archaeologist`, `game-developer`, `seo-specialist`, `documentation-writer`, `explorer-agent` | Các vai trò chuyên sâu hỗ trợ toàn diện mọi khía cạnh phần mềm. |

---

## ⚡ Các Slash Commands Nổi Bật

### 🛠️ Nhóm Phát Triển & Quản Trị Phần Mềm
* `/create`: Khởi tạo ứng dụng hoàn chỉnh từ đầu với kiến trúc chuẩn mực.
* `/orchestrate`: Lập kế hoạch và điều phối các specialist agents thực thi đa bước.
* `/coordinate`: Phân chia và chạy song song các tác vụ nghiên cứu / rà soát độc lập.
* `/plan`: Phân tích sâu yêu cầu và lập kế hoạch kỹ thuật trước khi code.
* `/debug`: Điều tra và sửa lỗi hệ thống có phương pháp (Systematic Debugging).
* `/verify`: Chứng minh tính đúng đắn của code bằng thực thi kiểm chứng thực tế.

### 🧪 Nhóm QA & Automation Testing
* `/generate_manual_testcases_rbt`: Sinh manual test cases theo quy trình AI-RBT 6 bước có đánh giá rủi ro.
* `/generate_testcases_from_requirements`: Sinh test cases nhanh từ requirements (Quick Mode).
* `/generate_automation_from_testcases`: Chuyển test cases manual thành script automation (Playwright/Selenium) theo chuẩn POM.
* `/generate_automation_from_ui_flow`: Trực tiếp khảo sát giao diện trên browser và sinh code test tự động.
* `/generate_cross_module_test_plan`: Phân tích kiểm thử tương tác đa module và sinh ma trận kết hợp Pairwise.
* `/generate_combinatorial_test_data`: Sinh dữ liệu kiểm thử tổ hợp Pairwise/Orthogonal Array.
* `/generate_automation_framework`: Scaffold khung tự động hóa hoàn chỉnh cho dự án.
* `/generate_api_tests_from_swagger`: Tự động tạo bộ test API từ Swagger / OpenAPI spec.
* `/analyze_flaky_tests`: Phân tích nguyên nhân và sửa chữa triệt để các test chạy chập chờn.
* `/fetch_jira_requirements` & `/import_test_results_xray`: Tích hợp kéo requirement từ Jira và đẩy kết quả test lên Xray.

---

## 📋 Release Notes & Lịch Sử Phiên Bản

Chi tiết toàn bộ thay đổi qua từng phiên bản được ghi nhận tại [**`CHANGELOG.md`**](CHANGELOG.md):

* **[v2026.10.17](CHANGELOG.md#20261017---cloudflare-light-theme--ui-modernization-release)**: Ra mắt giao diện Cloudflare Light Theme, tối ưu hóa responsive toàn diện (mobile/tablet/desktop), nâng cấp Web Portal và đồng bộ phiên bản toàn hệ sinh thái.
* **[v2026.10.13](CHANGELOG.md#20261013---qa--test-automation-supercharge-release)**: Hợp nhất toàn diện Antigravity Testing Kit (10 QA Skills, 16 Workflows, QA Rules, Self-contained structure, Web Portal 121 components).
* **[v2026.10.10](CHANGELOG.md#20261010---ndanhpc-kit-official-release)**: Phiên bản chính thức đầu tiên ra mắt Interactive Web Portal, Terminal TUI CLI, 24 Agents, 51 Skills và Native PreToolUse Hooks.

---

## 📄 Bản Quyền & Giấy Phép

Tài liệu và mã nguồn thuộc quyền sở hữu của **NDANHPC Kit**. Giữ nguyên vẹn các ghi chú bản quyền và quy chuẩn an toàn khi sử dụng.
