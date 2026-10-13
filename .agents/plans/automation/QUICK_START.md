# 📋 Hướng Dẫn Nhanh: Automation Testing 6 Bước

## Hai cách sử dụng

### Cách 1: One-Click (Tự động hoàn toàn — Đề xuất)

```
/generate_automation_from_testcases

URL: [https://your-app.com/login]
Tài khoản: [admin@test.com / Test@123]
Framework: [Playwright TypeScript / Selenium Java]

Manual Test Cases:
[Paste test cases vào đây]
```

→ Agent tự chạy hết 6 bước, tự fix đến khi test PASS.

---

### Cách 2: Tuần Tự (Từng bước)

| Bước | Prompt gửi Antigravity | Chờ User? |
|------|------------------------|-----------|
| **0** | Xem `project_architecture/README.md` | Setup 1 lần |
| **1** | Copy `plans/automation/01_context_and_roleplay/prompt.txt` + điền `[...]` | ✅ Chờ xác nhận |
| **2** | Copy `plans/automation/02_analysis_and_ui_recon/prompt.txt` + điền URL & TCs | ✅ Review locators |
| **3** | Copy `plans/automation/03_pom_design/prompt.txt` | Review POM |
| **4** | Copy `plans/automation/04_test_data_strategy/prompt.txt` | Review nhanh |
| **5** | Copy `plans/automation/05_script_generation/prompt.txt` | Chờ test PASS |
| **6** | Copy `plans/automation/06_review_and_refactor/prompt.txt` | Nhận clean code |

### Luồng thực hiện:

```
[Bước 1] Thiết lập role + tech stack
    ↓  AI xác nhận → OK
[Bước 2] Cung cấp URL + Test Cases
    ↓  AI tự mở browser, thu thập locators
    ↓  ⏸️ User review bảng locators
[Bước 3] AI thiết kế POM classes
    ↓  User review kiến trúc
[Bước 4] AI sinh Data Generator class
    ↓  User review nhanh
[Bước 5] AI sinh test script + tự chạy
    ↓  Tự fix loop đến khi PASS ✅
[Bước 6] AI cleanup code
    ↓  User nhận clean code → commit ✅
```

---

## Mẹo Tối Ưu

1. **Dùng Cách 1** cho 80% trường hợp — nhanh và hiệu quả nhất
2. **Dùng Cách 2** khi project lớn hoặc cần kiểm soát chi tiết từng module
3. **Luôn chạy trong cùng 1 conversation** để AI giữ context
4. **Cung cấp tài khoản test** nếu app yêu cầu login
