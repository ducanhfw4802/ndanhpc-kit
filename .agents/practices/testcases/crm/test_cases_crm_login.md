# TEST CASES — CRM LOGIN MODULE

| Thông tin | Chi tiết |
|-----------|----------|
| **Dự án** | CRM (Perfex CRM - Anh Tester Demo) |
| **Module** | Login |
| **URL** | https://crm.anhtester.com/admin/authentication |
| **Phương pháp** | AI-RBT (Risk-Based Testing) — FULL 6 bước |
| **Ngày tạo** | 2026-04-08 |
| **Tổng số TC** | 30 |

---

## TỔNG HỢP RISK LEVEL

| Module | Risk Level | Số TC |
|--------|-----------|-------|
| M2: Login Authentication | 🔴 High | 13 |
| M5: Security | 🔴 High | 6 |
| M3: Forgot Password | 🟡 Medium | 5 |
| M4: Logout | 🟡 Medium | 2 |
| M1: Login Form UI | 🟢 Low | 4 |

---

## TRACEABILITY MATRIX

| Requirement | Test Cases |
|------------|------------|
| AC-01 | TC_005 |
| AC-02 | TC_006 |
| AC-03 | TC_007 |
| AC-04 | TC_008 |
| AC-05 | TC_009 |
| AC-06 | TC_010, TC_011, TC_012 |
| AC-07 | TC_013, TC_014 |
| AC-08 | TC_018 |
| AC-09 | TC_019 |
| AC-10 | TC_020 |
| AC-11 | TC_023 |
| NFR-01 | TC_003, TC_028 |
| NFR-02 | TC_002 |
| NFR-03 | TC_030 |
| NFR-04 | TC_001 |
| NFR-05 | TC_001, TC_004 |
| Gap (no AC) | TC_015, TC_016, TC_017, TC_021, TC_022, TC_024, TC_025, TC_026, TC_027, TC_029 |

---

## BẢNG TEST CASES

### M1: Login Form UI (🟢 Low Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_LOGIN_TC_001 | M1: Login Form UI | 🟢 Low | Verify trang Login hiển thị đầy đủ các thành phần giao diện | Không | 1. Mở trình duyệt Chrome<br>2. Truy cập URL: `https://crm.anhtester.com/admin/authentication`<br>3. Quan sát toàn bộ trang Login | 1. Trình duyệt mở thành công<br>2. Trang Login tải hoàn chỉnh<br>3. Hiển thị đầy đủ:<br>- Logo "Anh Tester - Automation Testing"<br>- Tiêu đề "Login" (H1)<br>- Trường "Email Address" (textbox)<br>- Trường "Password" (textbox)<br>- Checkbox "Remember me" (không tick mặc định)<br>- Nút "Login" (xanh dương, full width)<br>- Link "Forgot Password?" (màu cam) | Medium | N/A |
| CRM_LOGIN_TC_002 | M1: Login Form UI | 🟢 Low | Verify trường Password hiển thị dạng masked | Không | 1. Truy cập trang Login<br>2. Click vào trường Password<br>3. Nhập: `TestPassword123`<br>4. Quan sát hiển thị ký tự trong trường Password | 1. Trang Login hiển thị<br>2. Trường Password được focus<br>3-4. Ký tự hiển thị dạng dấu chấm (●●●) hoặc dấu sao (***), KHÔNG hiển thị plaintext | Medium | Password: `TestPassword123` |
| CRM_LOGIN_TC_003 | M1: Login Form UI | 🟢 Low | Verify CSRF token hidden field tồn tại trong form | Không | 1. Truy cập trang Login<br>2. Inspect HTML form bằng DevTools (F12)<br>3. Tìm hidden field có name="csrf_token_name" | 1. Trang Login hiển thị<br>2. DevTools mở thành công<br>3. Tồn tại `<input type="hidden" name="csrf_token_name">` với value không rỗng, value là chuỗi token duy nhất | Low | N/A |
| CRM_LOGIN_TC_004 | M1: Login Form UI | 🟢 Low | Verify giao diện responsive trên viewport nhỏ | Không | 1. Truy cập trang Login trên Chrome<br>2. Mở DevTools → Toggle Device Toolbar<br>3. Chọn viewport: iPhone 14 (390×844)<br>4. Quan sát bố cục trang Login<br>5. Chuyển sang viewport: iPad (768×1024)<br>6. Quan sát bố cục | 1-2. DevTools mở thành công<br>3-4. Form Login hiển thị đầy đủ, không bị tràn, nút Login full width, các trường input đọc được<br>5-6. Form Login hiển thị đẹp, căn giữa, responsive | Low | Viewport 1: 390×844<br>Viewport 2: 768×1024 |

---

### M2: Login Authentication (🔴 High Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_LOGIN_TC_005 | M2: Login Auth | 🔴 High | Đăng nhập thành công với Email và Password hợp lệ | Tài khoản admin đã tồn tại trong hệ thống | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: `123456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Email được nhập vào trường<br>3. Password được nhập (hiển thị masked)<br>4. Đăng nhập thành công:<br>- Chuyển hướng đến Dashboard (`/admin/`)<br>- Trang hiển thị tiêu đề "Dashboard"<br>- Không hiển thị thông báo lỗi | Critical | Email: `admin@example.com`<br>Password: `123456` |
| CRM_LOGIN_TC_006 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Để trống trường Email | Không | 1. Truy cập trang Login<br>2. Để trống trường Email<br>3. Nhập Password: `123456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Trường Email trống<br>3. Password được nhập<br>4. Hiển thị thông báo lỗi server-side:<br>- Text: **"The Email Address field is required."**<br>- Trong thẻ `<div class="alert alert-danger text-center">`<br>- Vẫn ở lại trang Login | High | Email: (trống)<br>Password: `123456` |
| CRM_LOGIN_TC_007 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Để trống trường Password | Không | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Để trống trường Password<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Email được nhập<br>3. Trường Password trống<br>4. Hiển thị thông báo lỗi server-side:<br>- Text: **"The Password field is required."**<br>- Trong thẻ `<div class="alert alert-danger text-center">`<br>- Vẫn ở lại trang Login | High | Email: `admin@example.com`<br>Password: (trống) |
| CRM_LOGIN_TC_008 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Để trống cả Email và Password | Không | 1. Truy cập trang Login<br>2. Để trống trường Email<br>3. Để trống trường Password<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Cả hai trường trống<br>4. Hiển thị **đồng thời 2 thông báo** lỗi server-side:<br>- **"The Email Address field is required."**<br>- **"The Password field is required."**<br>- Cả 2 trong `<div class="alert alert-danger text-center">`<br>- Vẫn ở lại trang Login | High | Email: (trống)<br>Password: (trống) |
| CRM_LOGIN_TC_009 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Email sai định dạng (thiếu @) | Không | 1. Truy cập trang Login<br>2. Nhập Email: `invalidemail`<br>3. Nhập Password: `123456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Email nhập không có ký tự @<br>3. Password được nhập<br>4. Trình duyệt **chặn form submit** và hiển thị HTML5 tooltip:<br>- **"Please include an '@' in the email address."** (hoặc tương đương theo ngôn ngữ trình duyệt)<br>- Form KHÔNG được gửi lên server<br>- Đây là client-side validation | High | Email: `invalidemail`<br>Password: `123456` |
| CRM_LOGIN_TC_010 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Email đúng định dạng nhưng không tồn tại | Không | 1. Truy cập trang Login<br>2. Nhập Email: `notexist_20260408@example.com`<br>3. Nhập Password: `WrongPass!456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Dữ liệu được nhập<br>4. Hiển thị thông báo lỗi server-side:<br>- Text: **"Invalid email or password"**<br>- Trong `<div class="alert alert-danger text-center">`<br>- Vẫn ở lại trang Login | High | Email: `notexist_20260408@example.com`<br>Password: `WrongPass!456` |
| CRM_LOGIN_TC_011 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Email đúng + Password sai | Tài khoản admin@example.com tồn tại | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: `SaiMatKhau!789`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Dữ liệu được nhập<br>4. Hiển thị thông báo:<br>- Text: **"Invalid email or password"**<br>- Thông báo **KHÔNG** tiết lộ rằng email tồn tại<br>- Vẫn ở lại trang Login | High | Email: `admin@example.com`<br>Password: `SaiMatKhau!789` |
| CRM_LOGIN_TC_012 | M2: Login Auth | 🔴 High | Đăng nhập thất bại - Email sai + Password đúng | Tài khoản admin@example.com tồn tại, password: 123456 | 1. Truy cập trang Login<br>2. Nhập Email: `wrong_admin@example.com`<br>3. Nhập Password: `123456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Dữ liệu được nhập<br>4. Hiển thị thông báo:<br>- Text: **"Invalid email or password"**<br>- Thông báo **KHÔNG** tiết lộ rằng password đúng<br>- Vẫn ở lại trang Login | High | Email: `wrong_admin@example.com`<br>Password: `123456` |
| CRM_LOGIN_TC_013 | M2: Login Auth | 🔴 High | Đăng nhập thành công với "Remember me" - Phiên duy trì sau đóng browser | Tài khoản admin đã tồn tại | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: `123456`<br>4. Tick checkbox "Remember me"<br>5. Click nút "Login"<br>6. Verify Dashboard hiển thị<br>7. Đóng hoàn toàn trình duyệt<br>8. Mở lại trình duyệt<br>9. Truy cập: `https://crm.anhtester.com/admin/` | 1. Trang Login hiển thị<br>2-3. Dữ liệu được nhập<br>4. Checkbox được tick<br>5-6. Đăng nhập thành công, Dashboard hiển thị<br>7-8. Trình duyệt đóng và mở lại<br>9. Truy cập trực tiếp Dashboard **KHÔNG** bị redirect về trang Login, phiên vẫn còn hiệu lực (duy trì 1 ngày) | Critical | Email: `admin@example.com`<br>Password: `123456`<br>Remember me: ✅ Tick |
| CRM_LOGIN_TC_014 | M2: Login Auth | 🔴 High | Đăng nhập KHÔNG tick "Remember me" - Phiên hết khi đóng browser | Tài khoản admin đã tồn tại | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: `123456`<br>4. KHÔNG tick "Remember me" (mặc định)<br>5. Click nút "Login"<br>6. Verify Dashboard hiển thị<br>7. Đóng hoàn toàn trình duyệt<br>8. Mở lại trình duyệt<br>9. Truy cập: `https://crm.anhtester.com/admin/` | 1. Trang Login hiển thị<br>2-3. Dữ liệu được nhập<br>4. Checkbox KHÔNG được tick<br>5-6. Đăng nhập thành công<br>7-8. Trình duyệt đóng và mở lại<br>9. Bị redirect về trang Login (`/admin/authentication`), phiên đã hết | High | Email: `admin@example.com`<br>Password: `123456`<br>Remember me: ❌ Không tick |
| CRM_LOGIN_TC_015 | M2: Login Auth | 🔴 High | Boundary - Nhập Email cực dài (1000+ ký tự) | Không | 1. Truy cập trang Login<br>2. Nhập Email: chuỗi 1001 ký tự `aaaaaa...aaa@example.com` (996 ký tự 'a' + @example.com)<br>3. Nhập Password: `123456`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Email dài được nhập (có thể bị cắt tùy browser)<br>3. Password được nhập<br>4. Hệ thống xử lý an toàn:<br>- Hiển thị thông báo lỗi HOẶC từ chối<br>- **KHÔNG crash, KHÔNG lỗi 500** | Medium | Email: 1001 ký tự (`aaa...a@example.com`)<br>Password: `123456` |
| CRM_LOGIN_TC_016 | M2: Login Auth | 🔴 High | Boundary - Nhập Password cực dài (1000+ ký tự) | Không | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: chuỗi 1001 ký tự `Aaaaaa...aaa1!` (lặp ký tự)<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2. Email được nhập<br>3. Password dài được nhập (masked)<br>4. Hệ thống xử lý an toàn:<br>- Hiển thị "Invalid email or password" HOẶC từ chối<br>- **KHÔNG crash, KHÔNG lỗi 500** | Medium | Email: `admin@example.com`<br>Password: 1001 ký tự |
| CRM_LOGIN_TC_017 | M2: Login Auth | 🔴 High | Truy cập trang Login khi đã đăng nhập → redirect Dashboard | Đã đăng nhập thành công, đang ở Dashboard | 1. Đăng nhập thành công với `admin@example.com`<br>2. Verify đang ở Dashboard<br>3. Thay đổi URL thủ công thành: `https://crm.anhtester.com/admin/authentication`<br>4. Nhấn Enter | 1-2. Đang ở Dashboard<br>3-4. Hệ thống tự động redirect về Dashboard (`/admin/`), **KHÔNG** hiển thị form Login khi đã authenticated | Medium | Email: `admin@example.com`<br>Password: `123456` |

---

### M3: Forgot Password (🟡 Medium Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_LOGIN_TC_018 | M3: Forgot Password | 🟡 Medium | Click "Forgot Password?" chuyển đến trang khôi phục | Đang ở trang Login | 1. Truy cập trang Login<br>2. Click link "Forgot Password?" | 1. Trang Login hiển thị<br>2. Chuyển hướng đến URL: `https://crm.anhtester.com/admin/authentication/forgot_password`<br>- Hiển thị trường "Email Address"<br>- Hiển thị nút "Confirm" | High | N/A |
| CRM_LOGIN_TC_019 | M3: Forgot Password | 🟡 Medium | Gửi email khôi phục với email đã đăng ký | Đang ở trang Forgot Password, tài khoản admin@example.com tồn tại | 1. Truy cập trang Forgot Password<br>2. Nhập Email: `admin@example.com`<br>3. Click nút "Confirm" | 1. Trang Forgot Password hiển thị<br>2. Email được nhập<br>3. Hệ thống xử lý yêu cầu:<br>- Hiển thị thông báo xác nhận (ví dụ: email khôi phục đã được gửi)<br>- KHÔNG hiển thị thông báo lỗi | High | Email: `admin@example.com` |
| CRM_LOGIN_TC_020 | M3: Forgot Password | 🟡 Medium | Để trống Email trên trang Forgot Password → HTML5 validation | Đang ở trang Forgot Password | 1. Truy cập trang Forgot Password<br>2. Để trống trường Email<br>3. Click nút "Confirm" | 1. Trang Forgot Password hiển thị<br>2. Trường Email trống<br>3. Trình duyệt hiển thị HTML5 validation tooltip (trường có thuộc tính `required`):<br>- **"Please fill out this field."** (hoặc tương đương)<br>- Form KHÔNG được gửi lên server | High | Email: (trống) |
| CRM_LOGIN_TC_021 | M3: Forgot Password | 🟡 Medium | Nhập email chưa đăng ký trên trang Forgot Password | Đang ở trang Forgot Password | 1. Truy cập trang Forgot Password<br>2. Nhập Email: `khongtontai_20260408@example.com`<br>3. Click nút "Confirm" | 1. Trang Forgot Password hiển thị<br>2. Email được nhập<br>3. Hệ thống hiển thị thông báo chung (không tiết lộ email có tồn tại hay không):<br>- KHÔNG hiển thị "Email not found" hoặc tương tự<br>- Hành vi giống như email hợp lệ (bảo mật) | Medium | Email: `khongtontai_20260408@example.com` |
| CRM_LOGIN_TC_022 | M3: Forgot Password | 🟡 Medium | Nhập email sai định dạng trên trang Forgot Password | Đang ở trang Forgot Password | 1. Truy cập trang Forgot Password<br>2. Nhập Email: `emailkhonghople`<br>3. Click nút "Confirm" | 1. Trang Forgot Password hiển thị<br>2. Email sai định dạng được nhập<br>3. Trình duyệt hiển thị HTML5 validation tooltip:<br>- **"Please include an '@' in the email address."**<br>- Form KHÔNG được gửi lên server | Medium | Email: `emailkhonghople` |

---

### M4: Logout (🟡 Medium Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_LOGIN_TC_023 | M4: Logout | 🟡 Medium | Đăng xuất từ Dashboard → quay về trang Login | Đã đăng nhập thành công, đang ở Dashboard | 1. Đăng nhập thành công<br>2. Verify đang ở Dashboard<br>3. Click vào profile dropdown (góc trên bên phải)<br>4. Click "Logout" | 1-2. Đang ở Dashboard<br>3. Dropdown menu hiển thị<br>4. Đăng xuất thành công:<br>- Chuyển hướng về trang Login (`/admin/authentication`)<br>- Form Login hiển thị<br>- KHÔNG còn hiển thị Dashboard | Critical | Email: `admin@example.com`<br>Password: `123456` |
| CRM_LOGIN_TC_024 | M4: Logout | 🟡 Medium | Sau logout, nhấn nút Back → không quay lại được Dashboard | Vừa đăng xuất thành công, đang ở trang Login | 1. Đăng nhập thành công<br>2. Đăng xuất (Logout)<br>3. Verify đang ở trang Login<br>4. Nhấn nút **Back** trên trình duyệt<br>5. Quan sát trang hiển thị | 1-2. Đăng nhập và đăng xuất thành công<br>3. Đang ở trang Login<br>4-5. Hệ thống **redirect về trang Login**, KHÔNG hiển thị lại Dashboard:<br>- Session đã bị hủy hoàn toàn<br>- Dữ liệu Dashboard KHÔNG hiển thị từ cache | High | Email: `admin@example.com`<br>Password: `123456` |

---

### M5: Security (🔴 High Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|-----------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_LOGIN_TC_025 | M5: Security | 🔴 High | SQL Injection vào trường Email | Không | 1. Truy cập trang Login<br>2. Nhập Email: `' OR 1=1 --`<br>3. Nhập Password: `anything`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Dữ liệu injection được nhập<br>4. Hệ thống xử lý an toàn:<br>- **KHÔNG** đăng nhập thành công<br>- Hiển thị thông báo lỗi validation HOẶC "Invalid email or password"<br>- **KHÔNG** lỗi SQL / lỗi 500<br>- **KHÔNG** tiết lộ cấu trúc database | Critical | Email: `' OR 1=1 --`<br>Password: `anything` |
| CRM_LOGIN_TC_026 | M5: Security | 🔴 High | XSS Script Injection vào trường Email | Không | 1. Truy cập trang Login<br>2. Nhập Email: `<script>alert('XSS')</script>`<br>3. Nhập Password: `123456`<br>4. Click nút "Login"<br>5. Quan sát trang kết quả | 1. Trang Login hiển thị<br>2-3. Dữ liệu XSS được nhập<br>4-5. Hệ thống xử lý an toàn:<br>- **KHÔNG** execute script (không popup alert)<br>- Script được escape/sanitize<br>- Hiển thị thông báo lỗi bình thường<br>- **KHÔNG** lỗi 500 | Critical | Email: `<script>alert('XSS')</script>`<br>Password: `123456` |
| CRM_LOGIN_TC_027 | M5: Security | 🔴 High | SQL Injection vào trường Password | Không | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com`<br>3. Nhập Password: `' OR '1'='1`<br>4. Click nút "Login" | 1. Trang Login hiển thị<br>2-3. Dữ liệu injection được nhập<br>4. Hệ thống xử lý an toàn:<br>- **KHÔNG** đăng nhập thành công<br>- Hiển thị "Invalid email or password"<br>- **KHÔNG** lỗi SQL / lỗi 500 | Critical | Email: `admin@example.com`<br>Password: `' OR '1'='1` |
| CRM_LOGIN_TC_028 | M5: Security | 🔴 High | CSRF token bị xóa/thay đổi → form submit bị từ chối | Không | 1. Truy cập trang Login<br>2. Mở DevTools (F12) → Inspect form<br>3. Tìm hidden field `csrf_token_name`<br>4. Thay đổi value thành: `invalid_token_12345`<br>5. Nhập Email: `admin@example.com`<br>6. Nhập Password: `123456`<br>7. Click nút "Login" | 1-3. CSRF token field tìm thấy<br>4. Value bị thay đổi thành token giả<br>5-6. Dữ liệu hợp lệ được nhập<br>7. Hệ thống **từ chối request**:<br>- KHÔNG đăng nhập thành công<br>- Hiển thị lỗi CSRF hoặc trang lỗi 403<br>- Bảo vệ chống CSRF hoạt động đúng | High | Email: `admin@example.com`<br>Password: `123456`<br>CSRF Token: `invalid_token_12345` |
| CRM_LOGIN_TC_029 | M5: Security | 🔴 High | Đăng nhập sai nhiều lần liên tiếp (Brute-force) | Không | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com` + Password: `SaiPass_1` → Click Login<br>3. Lặp lại bước 2 với password khác: `SaiPass_2`, `SaiPass_3`, ..., `SaiPass_10`<br>4. Quan sát sau 10 lần đăng nhập sai liên tiếp | 1. Trang Login hiển thị<br>2-3. Mỗi lần hiển thị "Invalid email or password"<br>4. **Ghi nhận hiện trạng** (RISK):<br>- Nếu hệ thống KHÔNG lockout → ghi bug/risk<br>- Hệ thống không crash, không lỗi 500 | High | Email: `admin@example.com`<br>Passwords: `SaiPass_1` → `SaiPass_10` (10 lần sai liên tiếp) |
| CRM_LOGIN_TC_030 | M5: Security | 🔴 High | Thông báo lỗi không tiết lộ email tồn tại hay không | Tài khoản admin@example.com tồn tại | 1. Truy cập trang Login<br>2. Nhập Email: `admin@example.com` (tồn tại) + Password sai: `WrongP@ss1`<br>3. Click Login → ghi nhận thông báo lỗi A<br>4. Nhập Email: `khongtontai@example.com` (không tồn tại) + Password: `WrongP@ss1`<br>5. Click Login → ghi nhận thông báo lỗi B<br>6. So sánh thông báo A và B | 1. Trang Login hiển thị<br>2-3. Thông báo A: "Invalid email or password"<br>4-5. Thông báo B: "Invalid email or password"<br>6. **Thông báo A = thông báo B** (giống hệt nhau):<br>- KHÔNG phân biệt "Email not found" vs "Wrong password"<br>- Thiết kế bảo mật đúng chuẩn | High | Email tồn tại: `admin@example.com`<br>Email không tồn tại: `khongtontai@example.com`<br>Password sai: `WrongP@ss1` |

---

## TỔNG HỢP AMBIGUITIES ĐÃ GIẢI QUYẾT

| # | Ambiguity | Giải quyết bằng |
|---|-----------|-----------------|
| AMB-01 | Không có account lockout | Assumption → TC_029 verify hiện trạng, ghi risk |
| AMB-02 | Không có min/max Password | Assumption → TC_016 test boundary 1001 ký tự |
| AMB-03 | Không có max Email | Assumption → TC_015 test boundary 1001 ký tự |
| AMB-04 | Hành vi email không tồn tại (Forgot Password) | Assumption → TC_021 verify thông báo chung |
| AMB-05 | Thời hạn link khôi phục | Không sinh TC (không thể verify manual) |
| AMB-06 | Thời gian Remember me | User trả lời: **1 ngày** → TC_013 |
| AMB-07 | Redirect khi đã authenticated | Assumption → TC_017 |
| AMB-08 | Back button sau logout | Assumption → TC_024 |
| AMB-09 | Copy-paste password | Không sinh TC riêng (hành vi mặc định browser) |
| AMB-10 | Không có CAPTCHA | Ghi nhận risk trong TC_029 |
| AMB-11 | Checkbox value="estimate" | Assumption → test chức năng thực tế (TC_013, TC_014) |
| AMB-12 | Nội dung email khôi phục | Không sinh TC (ngoài scope UI test) |

---

## THỐNG KÊ

| Tiêu chí | Số lượng |
|----------|----------|
| **Tổng TC** | **30** |
| Critical Priority | 5 (TC_005, TC_013, TC_023, TC_025, TC_026) |
| High Priority | 14 |
| Medium Priority | 8 |
| Low Priority | 3 |
| Kỹ thuật EP (Equivalence Partitioning) | TC_005-TC_012 (phân nhóm: đúng/sai/trống) |
| Kỹ thuật BVA (Boundary Value) | TC_015, TC_016 (email/password cực dài) |
| Kỹ thuật Decision Table | TC_006-TC_008 (tổ hợp Email trống + Password trống) |
| Kỹ thuật State Transition | TC_013, TC_014, TC_017, TC_023, TC_024 (trạng thái login/logout/session) |
