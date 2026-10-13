# Prompt Workflow Templates — Có Gọi Workflow

Thư mục này chứa các prompt mẫu **đã tích hợp sẵn lệnh gọi workflow** (slash command).
Khi paste vào Antigravity, agent sẽ tự động load đúng skill và thực thi theo quy trình.

---

## Khác biệt với prompt_template/ gốc

| | `prompt_template/` (gốc) | `prompt_workflow_template/` (đây) |
|---|---|---|
| Gọi workflow | Không | Có (dòng đầu tiên) |
| Agent load skill | Không (dùng context mặc định) | Có (load đúng skill từ workflow) |
| Phù hợp | Dùng nhanh bất kỳ AI nào | Dùng với Antigravity/Gemini |

## Danh Sách

| # | File | Workflow | Skill |
|---|------|----------|-------|
| 01 | [`prompt_01_generate_requirements.txt`](prompt_01_generate_requirements.txt) | `/generate_requirements_from_website` | `requirements_analyzer` |
| 02 | [`prompt_02_generate_test_cases.txt`](prompt_02_generate_test_cases.txt) | `/generate_manual_testcases_rbt` | `rbt_manual_testing` |
| 03 | [`prompt_03_create_framework_playwright.txt`](prompt_03_create_framework_playwright.txt) | `/generate_automation_framework` | `qa_automation_engineer` |
| 03 | [`prompt_03_create_framework_selenium.txt`](prompt_03_create_framework_selenium.txt) | `/generate_automation_framework` | `qa_automation_engineer` |
| 04 | [`prompt_04_generate_script_playwright.txt`](prompt_04_generate_script_playwright.txt) | `/generate_automation_from_testcases` | `qa_automation_engineer` |
| 04 | [`prompt_04_generate_script_selenium.txt`](prompt_04_generate_script_selenium.txt) | `/generate_automation_from_testcases` | `qa_automation_engineer` |
| 05 | [`prompt_05_convert_manual_to_automation.txt`](prompt_05_convert_manual_to_automation.txt) | `/generate_automation_from_testcases` | `qa_automation_engineer` |
| 07 | [`prompt_07_generate_test_data.txt`](prompt_07_generate_test_data.txt) | `/generate_test_data` | `test_data_generator` |
| 08 | [`prompt_08_analyze_flaky_tests.txt`](prompt_08_analyze_flaky_tests.txt) | `/analyze_flaky_tests` | `flaky_test_analyzer` |
| 09 | [`prompt_09_generate_api_tests.txt`](prompt_09_generate_api_tests.txt) | `/generate_api_tests_from_swagger` | `qa_automation_engineer` |

Lưu ý: prompt_06 (Review Code) không có workflow riêng nên không có trong thư mục này.

## Cách sử dụng

1. Chọn prompt phù hợp
2. Mở file .txt
3. Thay [...] bằng dữ liệu thực tế
4. Copy toàn bộ nội dung → paste vào Antigravity chat → gửi
5. Agent tự gọi workflow → load skill → thực thi
