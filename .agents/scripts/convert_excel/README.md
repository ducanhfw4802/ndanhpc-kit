# 📊 MD to XLSX Converter

Convert file Markdown Test Cases sang Excel (`.xlsx`) có format đẹp, sẵn sàng chia sẻ.

## Yêu cầu

- **Node.js** ≥ 16

## Cài đặt

```bash
cd .agents/scripts/convert_excel
npm install
```

## Cách dùng

```bash
# Từ thư mục gốc project
node .agents/scripts/convert_excel/md_to_xlsx.js <input.md> [output.xlsx]
```

### Ví dụ

```bash
# Output tự động cùng thư mục, cùng tên (đuôi .xlsx)
node .agents/scripts/convert_excel/md_to_xlsx.js requirements/crm/test_cases_crm_login.md

# Chỉ định output path
node .agents/scripts/convert_excel/md_to_xlsx.js requirements/crm/test_cases_crm_login.md output/crm_login.xlsx
```

## Đầu vào (Input)

File Markdown chứa bảng test cases theo format:

```markdown
| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------| 
| TC_001 | ... | 🔴 High | ... | ... | Step 1<br>Step 2 | ... | Critical | ... |
```

> **Lưu ý:** Script tự động nhận diện tất cả các bảng có cột `TC ID` trong file.

## Đầu ra (Output)

File `.xlsx` với các tính năng:

| Tính năng | Mô tả |
|-----------|-------|
| **Column widths** | Tự động set độ rộng phù hợp cho từng cột |
| **Freeze panes** | Cố định dòng header khi cuộn |
| **AutoFilter** | Bộ lọc tự động trên header |
| **Line breaks** | Các bước test (`<br>`) chuyển thành xuống dòng trong cell |
| **Clean text** | Tự động xóa emoji, backtick markdown |
