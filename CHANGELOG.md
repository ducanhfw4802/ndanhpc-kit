# AG Kit Toolkit Changelog

## 2026.10.18 - Remote npx/npm CLI & Unified 1-Line Installer Release

### Added
- **Remote npx / npm CLI (`bin/ndanhpc-kit.js`)**:
  - Hỗ trợ thực thi từ xa không cần clone mã nguồn: `npx github:ducanhfw4802/ndanhpc-kit init` (hoặc `npx ndanhpc-kit init`).
  - Cung cấp các lệnh con chuyên dụng: `init`, `update`, `check`, `web`, `tui`, `doctor`, `uninstall`.
  - Tự động phát hiện môi trường, nạp trọn bộ 123 thành phần `.agents/` và chạy validation toàn vẹn.
- **Unified 1-Line Installer & Lifecycle Manager (`install.sh`)**:
  - Script POSIX độc lập cho Linux, macOS và WSL.
  - Cài đặt nhanh qua `curl -fsSL ... | bash` và cập nhật an toàn qua `bash install.sh update`.
  - Tự động sao lưu thư mục cũ sang `.agents.bak/` và bảo toàn 100% dữ liệu cấu hình dự án (`.agents/memory/`).
- **GitHub Actions Auto-Publish Workflow (`.github/workflows/publish-npm.yml`)**:
  - Tự động đóng gói và xuất bản package lên NPM Registry qua GitHub Action.
  - Bổ sung lệnh `npm run release:npm` phục vụ phát hành nhanh.
- **Tích Hợp UI/UX Pro Max Design Intelligence (v2.15.0)**:
  - Bổ sung skill `ui-ux-pro-max` nâng tổng số skill lên **62 Modular Skills**.
  - Tích hợp kho tri thức thiết kế định lượng: 79 UI styles, 192 color palettes (Hex tokens), 74 font pairings (Google Fonts), 119 UX guidelines, 25 chart types và 22 tech stacks.
  - Bổ sung workflow `/design-system` (`.agents/workflows/design-system.md`) nâng tổng số workflow lên **30 Workflows**.
  - Nâng cấp năng lực thiết kế định lượng cho 4 specialist agents: `ui-ux-designer`, `frontend-ui-developer`, `frontend-specialist`, và `ux-accessibility-reviewer`.

### Changed
- **Đồng Bộ Dữ Liệu Web Portal & Chống Crash Khởi Tạo (`web/app.js`, `web/manifest.json`)**:
  - Khôi phục cấu trúc array danh mục và bổ sung cơ chế chuẩn hóa dữ liệu tự động (data normalization) trong `initData()` của `web/app.js`, xử lý an toàn cả định dạng array lẫn object tránh lỗi TypeError khởi động.
  - Cập nhật số liệu dynamic cho toàn bộ huy hiệu bộ lọc (Tất cả: 123, Agents: 24, Skills: 62, Workflows: 30, Rules: 7) và hero stats real-time.
  - Tích hợp chuỗi cache-busting `?v=20261018.2` cho `styles.css` và `app.js` bảo đảm tải ngay bản mới nhất.
- **Nâng Cấp Terminal CLI (`ndanhpc_cli.py`)**:
  - Bổ sung menu item `[12]` (Cập nhật Kit) và `[13]` (Gỡ bỏ Kit).
  - Bổ sung tham số dòng lệnh `--update` và `--uninstall`.
  - Phân loại kỹ năng `ui-ux-pro-max` vào nhóm Frontend & Design, workflow `/design-system` vào Core Workflows và đồng bộ 123 thành phần trên menu TUI và overview.
- **Đồng Bộ Phiên Bản CalVer Toàn Hệ Thống**:
  - Nâng cấp đồng bộ `2026.10.18` trên `.agents/VERSION`, `package.json`, `package-lock.json`, `web/package.json`, `web/package-lock.json`, `web/manifest.json`, `web/data/manifest.json`, `web/app.js`, `web/index.html`, và `.agents/ARCHITECTURE.md`.

---

## 2026.10.17 - Cloudflare Light Theme & UI Modernization Release

### Added
- **Cloudflare Light Theme**:
  - Giao diện người dùng phong cách Cloudflare Dashboard với bảng màu chuyên nghiệp: cam đặc trưng Cloudflare (`#F6821F`), xám đậm (`#18181B`), nền sáng trang nhã (`#F9FAFB`), thẻ nội dung sạch sẽ (`#FFFFFF`) và viền thanh mảnh (`#E4E4E7`).
  - Hệ thống tokens và biến CSS hoàn chỉnh (`--cf-orange`, `--cf-bg`, `--cf-surface`, `--cf-border`, `--cf-text-primary`, `--cf-text-secondary`, `--cf-accent`).
  - Hỗ trợ đầy đủ badges trạng thái, code blocks tương phản cao và hiệu ứng hover tinh tế.

### Changed
- **Tối ưu hóa Responsive Toàn diện (Web Portal)**:
  - Khắc phục triệt để lỗi tràn layout màn hình (horizontal overflow) và loại bỏ thanh cuộn ngang ngoài ý muốn trên toàn bộ độ phân giải desktop, laptop, tablet và mobile.
  - Tối ưu hóa CSS Grid và Flexbox: thiết lập `min-width: 0` trên các thẻ flex child và container tránh vỡ layout.
  - Tối ưu hóa bảng hiển thị (tables), pre/code blocks, và badge containers với cơ chế scroll nội bộ an toàn.
  - Đạt điểm số tuyệt đối 100/100 trên Google Lighthouse (Performance, Accessibility, Best Practices, SEO).
- **Nâng cấp Terminal CLI TUI (`ndanhpc_cli.py`)**:
  - Cập nhật banner, màn hình overview, và các bảng điều khiển hiển thị phiên bản `2026.10.17`.
- **Đồng bộ Phiên bản CalVer Toàn diện**:
  - Nâng cấp đồng bộ `2026.10.17` trên `.agents/VERSION`, `package.json`, `package-lock.json`, `web/package.json`, `web/package-lock.json`, `web/manifest.json`, `web/data/manifest.json`, `web/app.js`, `web/index.html`, và `.agents/ARCHITECTURE.md`.

---

## 2026.10.13 - QA & Test Automation Supercharge Release

### Added
- **10 Specialized QA Skills**: Tích hợp toàn diện bộ kỹ năng kiểm thử chuẩn quốc tế từ Antigravity Testing Kit:
  - `rbt-manual-testing`: Sinh Manual Test Cases 6 bước AI-RBT (QUICK & FULL mode).
  - `qa-automation-workflow`: Quy trình tự động hóa E2E chuẩn POM, smart waits, tự fix lỗi.
  - `smart-locator`: Chiến lược chọn locator ổn định, ưu tiên semantic và data-testid.
  - `locator-healer`: Tự phát hiện và sửa locator hỏng (Self-healing).
  - `ui-debug`: Inspect DOM và điều tra UI chuyên sâu (desktop viewport 1920x1080 headed).
  - `flaky-test-analyzer`: Phân tích nguyên nhân gốc và khắc phục test chạy chập chờn.
  - `qa-framework-architect`: Scaffold framework POM cho Playwright, Selenium, Appium.
  - `test-data-generator`: Sinh dữ liệu unique, traceable và tổ hợp ma trận Pairwise.
  - `requirements-analyzer`: Khám phá và trích xuất requirements chuẩn từ web/tài liệu.
  - `jira-integration`: Tích hợp kéo requirements từ Jira và đẩy kết quả lên Xray.
- **16 Slash Command Workflows**: Bổ sung đầy đủ lệnh kiểm thử:
  - `/generate_manual_testcases_rbt`, `/generate_testcases_from_requirements`
  - `/generate_automation_from_testcases`, `/generate_automation_from_ui_flow`
  - `/generate_cross_module_test_plan`, `/generate_combinatorial_test_data`
  - `/generate_api_tests_from_swagger`, `/generate_automation_framework`
  - `/generate_locator`, `/analyze_flaky_tests`, `/fetch_jira_requirements`, `/import_test_results_xray`, v.v.
- **Quy Tắc QA Khắt Khe (`rules/qa-testing-rules.md`)**:
  - Bắt buộc Desktop Viewport 1920x1080 và Headed Mode khi debug UI.
  - Cấm đoán selector bừa bãi; cấm hard sleep (`Thread.sleep`, `waitForTimeout`).
  - Định dạng test data unique + traceable (timestamp/prefix).
  - Bắt buộc mô hình Page Object Model (POM) và tiêu chuẩn Definition of Done (PASS 2 lần liên tiếp trên UI).
- **Self-Contained Architecture**:
  - Di chuyển toàn bộ các thư mục hỗ trợ (`plans/`, `practices/`, `prompt_templates/`, `scripts/convert_excel`, `scripts/integrations`) vào bên trong `.agents/`.
  - Dự án mới chỉ cần copy đúng **duy nhất 1 thư mục `.agents/`** là sở hữu 100% năng lực hệ thống.

### Changed
- **Nâng cấp Agent**:
  - Trang bị trọn bộ 10 kỹ năng QA mới cho `qa-automation-engineer` (tổng cộng 15 skills).
  - Nâng cấp `test-engineer` với `rbt-manual-testing`, `test-data-generator`, `qa-automation-workflow`.
- **Nâng cấp Web Portal**:
  - Cập nhật giao diện Web Portal hiển thị đầy đủ 121 thành phần (24 Agents, 61 Skills, 29 Workflows, 7 Rules).
  - Bổ sung thông báo phát hành v2026.10.13 trên trang chủ Web Portal.
- Đồng bộ phiên bản toàn hệ thống lên `2026.10.13`.

---

## 2026.10.10 - NDANHPC Kit Official Release

### Added
- **Interactive Web Portal (`web/`)**: Cổng tra cứu trực quan và mô phỏng điều phối Multi-Agent trên nền tảng Web.
- **Terminal TUI Tool (`ndanhpc_cli.py`)**: Giao diện dòng lệnh tương tác trực quan cho Antigravity Toolkit.
- **24 Specialist Agents & 51 Modular Skills**: Hệ sinh thái AI Agent toàn diện cho Full-stack Software Engineering.
- **Native Lifecycle Hooks**: Bảo vệ hệ thống với `PreToolUse` hook chặn lệnh nguy hiểm trước khi thực thi.

---

## 2026.8.31

### Added

- Embedded mandatory `DESIGN.md` (Design Source-of-Truth) gate into `app-builder` orchestration pipeline, scaffolding structure, and Next.js templates.
- Added 2026 AI Application Pattern (Vercel AI SDK streaming, PostgreSQL pgvector, vector search, LLM API rate limiting) and SQL-first Drizzle ORM options in `tech-stack.md`.
- Added project type detection for AI/Chatbot applications and Game applications (`game-development` skill routing).
- Integrated automatic preview verification (`auto_preview.py`) into iterative enhancement and DevOps handoff.

### Changed

- Advanced toolkit version to `2026.8.31`.
- Bumped `app-builder` skill version to `1.1.0`.
- Standardized `globals.css` path to `src/app/globals.css` across Next.js templates.
- Fixed Express API template dependencies to include `@prisma/client` in dependencies and `prisma` as devDependency.
- Updated the `mcp-builder` skill for the stable MCP `2026-07-28` specification: stateless per-request metadata, `server/discover`, explicit state handles, extension negotiation, JSON Schema 2020-12, compatibility behavior, and migration guidance for deprecated features.
- Reworked the orchestrator and `parallel-agents` guidance around Antigravity-native agents and tasks while retaining best-effort portability for other runtimes.

### Security

- Added required safeguards for external `$ref` resolution, schema-validation resource limits, untrusted tool annotations, explicit consent, least privilege, secret handling, and execution isolation.
- Added explicit trust boundaries for repository content, MCP responses, tool annotations, web content, logs, and subagent outputs.
- Added finite agent, delegation-depth, turn/retry, timeout, cancellation, and no-progress controls to prevent recursive delegation and indefinite ReAct loops.


## 2026.7.26

### Added

- Antigravity runtime contract with six production integration phases.
- Native `PreToolUse` hook and destructive-command policy.
- Antigravity Doctor, MCP synchronization helper, plugin builder, schemas, and regression tests.
- Complete migration, production checklist, security, and operator documentation.

### Changed

- Toolkit version advanced from `2026.7.18` to `2026.7.26`.
- Google Antigravity is the primary production runtime; other Markdown-compatible tools are best-effort consumers.
- Component manifest now records Antigravity runtime metadata.
- Integrity lock now covers `antigravity.json`, `hooks.json`, and the complete `hooks/` runtime-tooling tree.
- Self-validation and Antigravity Doctor enforce synchronized root, CLI, web, and toolkit versions.

### Security

- High-confidence root/disk destructive commands are blocked before tool execution.
- Invalid or unknown hook payloads fail open with a warning to avoid runtime-wide lockout.
- MCP writes remain explicit, placeholder-blocked, conflict-aware, and backup-protected.
- Plugin artifacts are reviewable and contain no home-directory configuration or environment secrets.

### Compatibility

- Existing agent, skill, workflow, rule, and memory names remain compatible.
- The native safety hook is enabled by default and can be temporarily disabled for compatibility diagnosis.
- Plugin installation is optional; repository `.agents/` remains the project source of truth.

## 2026.7.18

### Added

- Strict SemVer metadata for all 20 agents, 47 skills, 13 workflows, and 6 rules.
- Machine-readable `manifest.json` with agent-to-skill and workflow dependencies.
- Deterministic `manifest.lock.json` with SHA-256 integrity hashes.
- Generated `DEPENDENCY_GRAPH.md` for workflow → agent → skill orchestration.
- JSON schemas for component metadata, manifest, lock, and memory topics.
- Standard memory topic files for user preferences, technical decisions, and feedback history.
- Registry and graph generation scripts with non-mutating `--check` modes.

### Changed

- Toolkit version advanced from `2026.7.12` to `2026.7.18`.
- Self-validation now checks component versions, workflow references, dependency compatibility, registry drift, lock integrity, graph drift, and memory contracts.
- CI now treats generated registry files as release artifacts that must remain synchronized.

### Compatibility

- Official runtime support remained Gemini CLI and Google Antigravity for that release.
- The component metadata and dependency format remain portable and avoid unnecessary platform coupling.

## 2026.7.12

- Release-safety upgrade, non-destructive CLI updates, rollback support, CI, dependency review, and hardened publishing.