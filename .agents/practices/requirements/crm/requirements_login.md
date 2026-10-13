# TÀI LIỆU YÊU CẦU - MODULE LOGIN

| Thông tin | Chi tiết |
|-----------|----------|
| Module | Login |
| Hệ thống | Perfex CRM - Anh Tester Demo |
| URL | https://crm.anhtester.com/admin/authentication |
| Ngày tạo | 2026-04-02 |

---

## 1. TỔNG QUAN

Module Login là cổng vào chính của hệ thống CRM Perfex. Người dùng phải xác thực thành công bằng Email và Mật khẩu trước khi truy cập vào Dashboard, Customers, Projects và các module khác.

Tính năng phụ trợ:
- Ghi nhớ đăng nhập (Remember me)
- Khôi phục mật khẩu (Forgot Password)
- Bảo vệ CSRF token

---

## 2. YÊU CẦU CHỨC NĂNG

### 2.1. Đăng nhập (Login)

> Là một người dùng, tôi muốn đăng nhập bằng email và mật khẩu để truy cập trang quản trị CRM.

| ID | Tiêu chí chấp nhận |
|------|------|
| AC-01 | Nhập đúng Email và Password, click Login -> chuyển hướng đến Dashboard (/admin/) |
| AC-02 | Để trống Email -> thông báo "The Email Address field is required." |
| AC-03 | Để trống Password -> thông báo "The Password field is required." |
| AC-04 | Để trống cả hai trường -> hiển thị đồng thời cả hai thông báo AC-02 và AC-03 |
| AC-05 | Email sai định dạng (thiếu @) -> trình duyệt hiển thị cảnh báo HTML5 validation |
| AC-06 | Email/password sai -> thông báo "Invalid email or password" |
| AC-07 | Tick "Remember me" + đăng nhập thành công -> phiên được duy trì sau khi đóng trình duyệt |

### 2.2. Khôi phục Mật khẩu (Forgot Password)

> Là một người dùng quên mật khẩu, tôi muốn yêu cầu gửi email khôi phục để lấy lại quyền truy cập.

| ID | Tiêu chí chấp nhận |
|------|------|
| AC-08 | Click "Forgot Password?" -> chuyển đến /admin/authentication/forgot_password |
| AC-09 | Nhập email hợp lệ + click "Confirm" -> hệ thống gửi email khôi phục |
| AC-10 | Để trống Email + click "Confirm" -> trình duyệt cảnh báo HTML5 (trường có required) |

### 2.3. Đăng xuất (Logout)

| ID | Tiêu chí chấp nhận |
|------|------|
| AC-11 | Từ Dashboard, click profile dropdown -> chọn Logout -> chuyển về trang Login |

---

## 3. ĐẶC TẢ TRƯỜNG DỮ LIỆU

### 3.1. Trang Login

| Tên trường | Loại UI | HTML Type | Bắt buộc | ID | Name | Ghi chú |
|------------|---------|-----------|----------|----|------|---------|
| Email Address | Textbox | email | Có (*) | email | email | Server-side validation + HTML5 email format. Class: form-control |
| Password | Textbox (masked) | password | Có (*) | password | password | Hiển thị dạng masked. Class: form-control |
| Remember me | Checkbox | checkbox | Không | remember | remember | Mặc định: không tick. Value = "estimate" |
| Login | Button | submit | N/A | N/A | N/A | Class: btn btn-primary btn-block |
| Forgot Password? | Link | anchor | N/A | N/A | N/A | Chuyển đến trang forgot_password |
| csrf_token_name | Hidden | hidden | N/A | N/A | csrf_token_name | CSRF token tự động sinh bởi server |

(*) Không có thuộc tính "required" trên HTML, nhưng server-side validation kiểm tra và trả lỗi nếu để trống.

### 3.2. Trang Forgot Password

| Tên trường | Loại UI | HTML Type | Bắt buộc | ID | Name | Ghi chú |
|------------|---------|-----------|----------|----|------|---------|
| Email Address | Textbox | email | Có | email | email | Có thuộc tính "required" (client-side) |
| Confirm | Button | submit | N/A | N/A | N/A | Class: btn btn-primary btn-block |

---

## 4. LUỒNG XỬ LÝ

### 4.1. Đăng nhập thành công (Happy Path)

1. Truy cập https://crm.anhtester.com/admin/authentication
2. Trang Login hiển thị form: Email, Password, Remember me, nút Login, link Forgot Password
3. Nhập Email hợp lệ (vd: admin@example.com)
4. Nhập Password đúng (vd: 123456)
5. (Tùy chọn) Tick "Remember me"
6. Click "Login"
7. Xác thực thành công -> chuyển hướng đến Dashboard (https://crm.anhtester.com/admin/)
8. Trang Dashboard hiển thị với tiêu đề "Dashboard"

### 4.2. Thất bại - Để trống tất cả trường

1. Truy cập trang Login
2. Không nhập gì, click "Login"
3. Hiển thị 2 thông báo lỗi server-side: "The Email Address field is required." và "The Password field is required."
4. Thông báo trong `<div class="alert alert-danger text-center">`
5. Vẫn ở lại trang Login

### 4.3. Thất bại - Để trống Email

1. Để trống Email, nhập Password bất kỳ
2. Click "Login"
3. Thông báo: "The Email Address field is required."

### 4.4. Thất bại - Để trống Password

1. Nhập Email hợp lệ, để trống Password
2. Click "Login"
3. Thông báo: "The Password field is required."

### 4.5. Thất bại - Email sai định dạng

1. Nhập Email không có @ (vd: "invalidemail")
2. Click "Login"
3. Trình duyệt chặn form, hiển thị HTML5 tooltip: "Please include an '@' in the email address."
4. Đây là client-side validation, không phải server-side

### 4.6. Thất bại - Sai tài khoản/mật khẩu

1. Nhập Email hợp lệ nhưng sai (vd: wrong@example.com) + Password bất kỳ
2. Click "Login"
3. Thông báo server-side: "Invalid email or password"
4. Thông báo chung, không tiết lộ email sai hay password sai (thiết kế bảo mật)

### 4.7. Khôi phục mật khẩu

1. Click "Forgot Password?" từ trang Login
2. Chuyển đến /admin/authentication/forgot_password
3. Nhập Email đã đăng ký
4. Click "Confirm"
5. Hệ thống gửi email hướng dẫn đặt lại mật khẩu

---

## 5. TỔNG HỢP THÔNG BÁO LỖI

| # | Thông báo | Loại | Điều kiện |
|---|-----------|------|-----------|
| 1 | The Email Address field is required. | Server-side (alert-danger) | Email để trống |
| 2 | The Password field is required. | Server-side (alert-danger) | Password để trống |
| 3 | Invalid email or password | Server-side (alert-danger) | Email/password sai |
| 4 | Please include an '@' in the email address. | Client-side (HTML5 tooltip) | Email thiếu @ |

- Server-side: hiển thị trong `<div class="alert alert-danger text-center">`, phía trên form
- Client-side: tooltip của trình duyệt khi input type="email" nhận giá trị không hợp lệ

---

## 6. CẤU TRÚC GIAO DIỆN

```
+--------------------------------------------------+
|      [Logo: Anh Tester - Automation Testing]     |
|                  Login (H1)                      |
|  +--------------------------------------------+  |
|  |  [Thông báo lỗi - nếu có]                 |  |
|  |  Email Address                             |  |
|  |  [____________________________________]   |  |
|  |  Password                                  |  |
|  |  [____________________________________]   |  |
|  |  [ ] Remember me                          |  |
|  |  [=========== Login ===========]          |  |
|  |  Forgot Password?                         |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

- Background: màu xám nhạt (#eef0f8)
- Form card: màu trắng, bo tròn, shadow nhẹ
- Nút Login: xanh dương (btn-primary), full width (btn-block)
- Link Forgot Password: màu cam, dưới nút Login

---

## 7. YÊU CẦU PHI CHỨC NĂNG

| ID | Nội dung |
|----|----------|
| NFR-01 | Bảo mật: CSRF token (trường ẩn csrf_token_name) |
| NFR-02 | Bảo mật: Password hiển thị dạng masked, không hiện plaintext |
| NFR-03 | Bảo mật: Thông báo chung "Invalid email or password" không tiết lộ tài khoản tồn tại |
| NFR-04 | Tương thích: HTML5 input type="email", Chrome/Firefox/Edge/Safari |
| NFR-05 | Giao diện: Responsive, Bootstrap (form-control, btn, alert) |
| NFR-06 | Hiệu năng: Form POST /admin/authentication, tải nhanh |

---

## 8. CÂU HỎI CẦN LÀM RÕ VỚI PO/USER

| ID | Câu hỏi |
|----|---------|
| Q-01 | Có giới hạn số lần đăng nhập sai liên tiếp không? (Account lockout) |
| Q-02 | Có yêu cầu độ phức tạp mật khẩu tối thiểu không? |
| Q-03 | "Remember me" duy trì phiên trong bao lâu? |
| Q-04 | Link khôi phục mật khẩu có thời hạn hết hạn không? |
| Q-05 | Có hỗ trợ Social Login / SSO không? |
| Q-06 | Có CAPTCHA sau nhiều lần đăng nhập thất bại không? |
| Q-07 | Email có giới hạn độ dài tối đa không? (HTML không có maxlength) |
| Q-08 | Password có giới hạn độ dài min/max không? (HTML không có minlength/maxlength) |
