# 📁 Practices — Tài Liệu Thực Hành AI Testing

> Thư mục chứa các **tài liệu thực hành** (requirements, test cases) được sinh bởi AI theo quy trình **AI-RBT (Risk-Based Testing)**, phục vụ học tập và demo trong dự án **Antigravity Testing Kit**.

---

## 🌐 Web Demo

Các ứng dụng web demo dùng để thực hành kiểm thử:

### 🔹 CRM — Perfex CRM

| Thông tin       | Chi tiết                                                  |
| --------------- | --------------------------------------------------------- |
| **URL**         | https://crm.anhtester.com/admin/authentication            |
| **Email**       | `admin@example.com`                                       |
| **Password**    | `123456`                                                  |
| **Mô tả**      | Hệ thống quản lý khách hàng (CRM) với các module: Login, Customers, Projects, ... |

### 🔹 Ecommerce

| Thông tin       | Chi tiết                                                  |
| --------------- | --------------------------------------------------------- |
| **URL**         | https://ecommerce.anhtester.com/login                     |
| **Email**       | `admin@example.com`                                       |
| **Password**    | `123456`                                                  |
| **Mô tả**      | Hệ thống thương mại điện tử với các module: Category, Brand, Products, ...  |

> [!NOTE]
> Đây là tài khoản demo công khai, dùng cho mục đích học tập và thực hành. Dữ liệu có thể được reset định kỳ.

---

## 📂 Cấu Trúc Thư Mục

```
practices/
├── requirements/                    # Tài liệu yêu cầu (Requirements)
│   ├── crm/                         # Requirements cho hệ thống CRM
│   │   ├── requirements_login.md        # Module Login
│   │   ├── requirements_customers.md    # Module Customers
│   │   └── requirements_projects.md     # Module Projects
│   ├── ecommerce/                   # Requirements cho hệ thống Ecommerce
│   │   └── requirements_category_brand.txt  # Module Category & Brand
│   └── jira/                        # Requirements lấy từ Jira
│       └── KAN-5/                       # Epic KAN-5
│           ├── KAN-5_overview.md            # Tổng quan epic
│           ├── KAN-1/                       # Story: Forgot Password
│           ├── KAN-4/                       # Task: Login
│           └── KAN-6/                       # Story: Logout
│
└── testcases/                       # Manual Test Cases
    └── crm/                         # Test cases cho hệ thống CRM
        ├── TC_CRM_LOGIN.md              # 27 TCs — AI-RBT Full Mode
        ├── TC_CRM_LOGIN.xlsx            # Export Excel
        ├── test_cases_crm_login.md      # TCs — Quick Mode
        └── test_cases_crm_login.xlsx    # Export Excel
```

---

## 📝 Nội Dung Chính

### 1. Requirements (`requirements/`)

Tài liệu yêu cầu chức năng được sinh từ việc phân tích website thực tế bằng AI, bao gồm:

- **Tổng quan module** — mô tả mục đích, phạm vi
- **Yêu cầu chức năng** — Acceptance Criteria (AC)
- **Đặc tả trường dữ liệu** — loại UI, HTML attributes, validation rules
- **Luồng xử lý** — Happy path & các kịch bản thất bại
- **Yêu cầu phi chức năng** — bảo mật, tương thích, hiệu năng
- **Câu hỏi cần làm rõ** — các điểm chưa xác nhận với PO/User

### 2. Test Cases (`testcases/`)

Manual test cases được sinh theo phương pháp **AI-RBT 6 bước**, bao gồm:

- **Test case chi tiết** — ID, Pre-condition, Steps, Expected Result, Priority
- **Risk assessment** — đánh giá rủi ro (High / Medium / Low) cho từng module
- **Traceability Matrix** — ma trận truy vết Requirements ↔ Test Cases
- **Kỹ thuật áp dụng** — EP, BVA, Decision Table, State Transition
- **Xuất Excel** — file `.xlsx` tiện cho quản lý và báo cáo

---

## 🚀 Hướng Dẫn Sử Dụng

### Sinh Requirements từ Website

```
/generate_requirements_from_website
```
Cung cấp URL module → AI sẽ inspect DOM thực tế và sinh tài liệu requirements.

### Phân Tích Requirement Document

```
/analyze_requirement_document
```
Cung cấp file .doc / Jira ticket / requirement document → AI phân tích chi tiết: AC breakdown, dependencies, ambiguities, risks. **KHÔNG sinh test cases.**

### Sinh Test Cases từ Requirements

```
/generate_testcases_from_requirements     # Quick Mode — sinh nhanh
/generate_manual_testcases_rbt            # Full RBT — 6 bước đầy đủ
```

### Sinh Test Cases từ Jira

```
/fetch_jira_requirements                  # Lấy requirements từ Jira
/generate_testcases_from_requirements     # Sinh TCs từ requirements đã lấy
```

### Chuyển Manual → Automation

```
/generate_automation_from_testcases       # Convert TCs → automation scripts
```

---

## 🔗 Liên Kết Hữu Ích

| Tài liệu                              | Đường dẫn                                          |
| -------------------------------------- | --------------------------------------------------- |
| Quy trình AI-RBT Manual Testing       | `.agent/skills/rbt_manual_testing/SKILL.md`         |
| Quy trình QA Automation               | `.agent/skills/qa_automation_engineer/SKILL.md`     |
| Kế hoạch Manual Testing               | `plans/manual/QUICK_START.md`                       |
| Kế hoạch Automation                   | `plans/automation/QUICK_START.md`                   |

---

> **Antigravity Testing Kit** — Bộ công cụ AI-powered cho QA Testing 🚀
