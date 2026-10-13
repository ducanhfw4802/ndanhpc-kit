# TEST CASES — CRM CUSTOMERS MODULE

| Thông tin | Chi tiết |
|-----------|----------|
| **Dự án** | CRM (Perfex CRM - Anh Tester Demo) |
| **Module** | Customers (Clients) |
| **URL** | https://crm.anhtester.com/admin/clients |
| **Phương pháp** | AI-RBT (Risk-Based Testing) — FULL 6 bước |
| **Ngày tạo** | 2026-05-21 |
| **Tổng số TC** | 48 |

---

## TỔNG HỢP RISK LEVEL

| Module / Sub-module | Risk Level | Số TC |
|---------------------|-----------|-------|
| SUB-02: Create & Edit Customer | 🔴 High | 13 |
| SUB-04: Contacts Management | 🔴 High | 10 |
| SUB-05: Data Integration (Import/Export) | 🔴 High | 8 |
| SUB-06: Bulk Actions & Advanced Filters | 🟡 Medium | 7 |
| SUB-01: Summary & List View | 🟡 Medium | 6 |
| SUB-03: Customer Detail Profile & Sidebar | 🟢 Low | 4 |

---

## TRACEABILITY MATRIX

| Mã Yêu Cầu (Requirement ID) | Test Cases (TC ID) |
|:----------------------------|:-------------------|
| **FR-CUST-001** (Xem danh sách) | CRM_CUST_TC_002, CRM_CUST_TC_003, CRM_CUST_TC_004, CRM_CUST_TC_005, CRM_CUST_TC_006, CRM_CUST_TC_007 |
| **FR-CUST-002** (Tạo mới) | CRM_CUST_TC_008, CRM_CUST_TC_009, CRM_CUST_TC_010, CRM_CUST_TC_011, CRM_CUST_TC_012, CRM_CUST_TC_013, CRM_CUST_TC_014, CRM_CUST_TC_015, CRM_CUST_TC_016, CRM_CUST_TC_017, CRM_CUST_TC_018, CRM_CUST_TC_019 |
| **FR-CUST-003** (Chi tiết & Chỉnh sửa) | CRM_CUST_TC_020, CRM_CUST_TC_021, CRM_CUST_TC_022, CRM_CUST_TC_023 |
| **FR-CUST-004** (Xóa khách hàng) | CRM_CUST_TC_024, CRM_CUST_TC_025 |
| **FR-CUST-005** (Quản lý Contacts) | CRM_CUST_TC_026, CRM_CUST_TC_027, CRM_CUST_TC_028, CRM_CUST_TC_029, CRM_CUST_TC_030, CRM_CUST_TC_031, CRM_CUST_TC_032, CRM_CUST_TC_033, CRM_CUST_TC_034 |
| **FR-CUST-006** (Import khách hàng) | CRM_CUST_TC_035, CRM_CUST_TC_036, CRM_CUST_TC_037, CRM_CUST_TC_038 |
| **FR-CUST-007** (Export dữ liệu) | CRM_CUST_TC_039, CRM_CUST_TC_040, CRM_CUST_TC_041, CRM_CUST_TC_042 |
| **FR-CUST-008** (Bulk Actions) | CRM_CUST_TC_043, CRM_CUST_TC_044, CRM_CUST_TC_045 |
| **FR-CUST-009** (Tìm kiếm & Lọc) | CRM_CUST_TC_046, CRM_CUST_TC_047, CRM_CUST_TC_048 |
| **Summary Statistics** | CRM_CUST_TC_001 |

---

## BẢNG TEST CASES

### SUB-01: Summary & List View (🟡 Medium Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_001 | SUB-01: List View | 🟡 Medium | Verify tóm tắt thống kê Customers Summary hiển thị đúng chỉ số | Admin đã đăng nhập và đang ở trang danh sách khách hàng | 1. Quan sát phần đầu trang tại `/admin/clients`<br>2. So sánh tổng số khách hàng thực tế trong DataTable với số lượng hiển thị ở bảng tóm tắt | 1. Hiển thị đầy đủ 6 chỉ số:<br>- Total Customers<br>- Active Customers<br>- Inactive Customers<br>- Active Contacts<br>- Inactive Contacts<br>- Contacts Logged In Today<br>2. Số lượng ở bảng thống kê khớp chính xác với dữ liệu thực tế | Medium | N/A |
| CRM_CUST_TC_002 | SUB-01: List View | 🟡 Medium | Verify DataTable hiển thị đầy đủ các cột thông tin khách hàng | Admin đã đăng nhập | 1. Truy cập `/admin/clients`<br>2. Quan sát tiêu đề các cột của DataTable danh sách khách hàng | 1. DataTable tải thành công<br>2. Hiển thị đúng các cột:<br>- Checkbox ở cột đầu tiên<br>- `#` (ID)<br>- Company<br>- Primary Contact<br>- Primary Email<br>- Phone<br>- Active (Toggle switch)<br>- Groups<br>- Date Created | High | N/A |
| CRM_CUST_TC_003 | SUB-01: List View | 🟡 Medium | Verify chức năng phân trang (Pagination) trên DataTable | Hệ thống có trên 25 khách hàng | 1. Truy cập danh sách khách hàng<br>2. Chọn số lượng hiển thị là 25 khách hàng từ dropdown<br>3. Click nút chuyển trang tiếp theo (`Next`) ở cuối DataTable<br>4. Chọn số lượng hiển thị là 50 khách hàng | 1. Danh sách hiển thị trang 1<br>2. Bảng hiển thị tối đa 25 dòng<br>3. Chuyển trang thành công, hiển thị các khách hàng tiếp theo, thông tin phân trang cập nhật đúng<br>4. Bảng thay đổi số lượng hiển thị thành tối đa 50 dòng | Medium | Phân trang: 25, 50 dòng |
| CRM_CUST_TC_004 | SUB-01: List View | 🟡 Medium | Verify chức năng sắp xếp (Sort) tăng/giảm dần theo cột Company | Hệ thống có nhiều khách hàng với tên công ty khác nhau | 1. Truy cập danh sách khách hàng<br>2. Click vào tiêu đề cột `Company`<br>3. Click vào tiêu đề cột `Company` lần nữa | 1. Trang danh sách hiển thị<br>2. Cột Company được sắp xếp theo thứ tự chữ cái A-Z<br>3. Cột Company đảo ngược sắp xếp theo thứ tự Z-A | Medium | N/A |
| CRM_CUST_TC_005 | SUB-01: List View | 🟡 Medium | Verify bật/tắt nhanh trạng thái Active/Inactive của khách hàng bằng toggle switch | Có ít nhất 1 khách hàng đang hoạt động trong danh sách | 1. Truy cập danh sách khách hàng<br>2. Tìm khách hàng đang có toggle switch là ON (Active)<br>3. Click vào toggle switch của khách hàng này để chuyển sang OFF (Inactive)<br>4. Tải lại trang (F5) và kiểm tra lại trạng thái khách hàng đó | 1. Trang danh sách hiển thị<br>2-3. Toggle chuyển từ màu xanh (ON) sang màu xám (OFF). Không có reload trang, thông báo cập nhật thành công hiển thị nhanh góc màn hình<br>4. Trạng thái khách hàng vẫn được lưu là Inactive sau khi F5 | High | Khách hàng: `Anh Tester Company` |
| CRM_CUST_TC_006 | SUB-01: List View | 🟡 Medium | Verify các liên kết điều hướng trên DataTable hoạt động đúng | Có sẵn khách hàng có đầy đủ tên Company và số điện thoại | 1. Truy cập danh sách khách hàng<br>2. Click vào link tên công ty ở cột `Company`<br>3. Quay lại trang danh sách, click vào link số điện thoại ở cột `Phone` | 1. Trang danh sách hiển thị<br>2. Chuyển hướng thành công sang trang chi tiết khách hàng `/admin/clients/client/{id}`<br>3. Trình duyệt kích hoạt ứng dụng gọi điện mặc định trên thiết bị (hoặc hiển thị tel link) | Medium | N/A |

### SUB-02: Create & Edit Customer (🔴 High Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_007 | SUB-02: Create/Edit | 🔴 High | Mở form tạo mới Customer thành công | Đang ở trang danh sách khách hàng | 1. Click nút "+ New Customer" ở trên đầu trang | 1. Chuyển hướng thành công sang `/admin/clients/client`<br>2. Form "Add new customer" hiển thị đầy đủ các trường nhập liệu<br>3. Tab "Customer Details" được chọn làm mặc định | High | N/A |
| CRM_CUST_TC_008 | SUB-02: Create/Edit | 🔴 High | Tạo mới khách hàng thành công với thông tin tối thiểu (Happy Path) | Form tạo mới đang mở | 1. Nhập trường bắt buộc: Company = `Company_Auto_17120492` (chuỗi ngẫu nhiên)<br>2. Để trống tất cả các trường khác<br>3. Click nút "Save" ở góc dưới bên phải | 1. Lưu thông tin thành công<br>2. Hệ thống chuyển hướng về trang chi tiết khách hàng mới tạo (`/admin/clients/client/{id}`)<br>3. Hiển thị thông báo lưu thành công màu xanh lá | Critical | Company: `Company_Auto_17120492` |
| CRM_CUST_TC_009 | SUB-02: Create/Edit | 🔴 High | Tạo mới khách hàng thành công với đầy đủ thông tin trên cả 2 tab (Happy Path) | Form tạo mới đang mở, các Groups, Currency, Country đã được cấu hình trong hệ thống | 1. Nhập thông tin tab **Customer Details**:<br>- Company: `Perfex_Auto_VIP_1712`<br>- VAT: `VAT987654321`<br>- Phone: `0987654321`<br>- Website: `https://anhtester.com`<br>- Groups: Chọn "VIP" và "Wholesale"<br>- Currency: Chọn "USD"<br>- Default Language: Chọn "Vietnamese"<br>- Address: `123 Đường CMT8, Quận 1`<br>- City: `Hồ Chí Minh`<br>- State: `Sài Gòn`<br>- Zip Code: `700000`<br>- Country: Chọn "Vietnam"<br>2. Chuyển sang tab **Billing & Shipping**:<br>- Click link `"Same as Customer Info"` ở phần Billing Address<br>- Click link `"Copy Billing Address"` ở phần Shipping Address<br>3. Click nút "Save" | 1. Dữ liệu tab Customer Details được điền đầy đủ<br>2. Dữ liệu địa chỉ ở tab 2 tự động điền giống thông tin đã nhập ở tab 1<br>3. Lưu thành công, chuyển hướng đến trang chi tiết khách hàng mới và hiển thị đầy đủ các thông tin đã nhập chính xác | Critical | Toàn bộ dữ liệu nhập bên cột Test Data |
| CRM_CUST_TC_010 | SUB-02: Create/Edit | 🔴 High | Validate trường Company bắt buộc nhập (Required validation) | Form tạo mới đang mở | 1. Để trống trường Company<br>2. Click nút "Save" | 1. Form không được submit<br>2. Dưới trường Company hiển thị thông báo lỗi màu đỏ: `"This field is required."`<br>3. Trình duyệt không chuyển trang | Critical | Company: (trống) |
| CRM_CUST_TC_011 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Validate độ dài tối đa (maxlength) trường Company | Form tạo mới đang mở | 1. Nhập chuỗi 256 ký tự vào trường `Company` (vượt quá giới hạn max 255 ký tự)<br>2. Click nút "Save" | 1. Hệ thống xử lý an toàn: Có thể tự động cắt chuỗi còn 255 ký tự HOẶC chặn submit hiển thị thông báo lỗi phù hợp<br>2. Không xảy ra lỗi crash hệ thống (lỗi 500) | High | Company: Chuỗi 256 ký tự 'a' |
| CRM_CUST_TC_012 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Chống XSS Script Injection vào trường Company | Form tạo mới đang mở | 1. Nhập mã XSS vào trường Company: `<script>alert('XSS_CUST')</script>`<br>2. Click nút "Save"<br>3. Kiểm tra tên công ty hiển thị trên giao diện chi tiết và danh sách DataTable | 1-2. Hệ thống lưu thành công hoặc báo lỗi an toàn, không crash<br>3. Tên công ty hiển thị dưới dạng chuỗi văn bản thông thường (HTML escaped), **KHÔNG** kích hoạt script chạy popup cảnh báo | Critical | Company: `<script>alert('XSS_CUST')</script>` |
| CRM_CUST_TC_013 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Chống SQL Injection vào trường Company | Form tạo mới đang mở | 1. Nhập mã SQL Injection vào trường Company: `ClientTest' OR 1=1 --`<br>2. Click nút "Save"<br>3. Kiểm tra hệ thống lưu dữ liệu | 1-2. Hệ thống lưu thành công hoặc báo lỗi an toàn, không crash<br>3. Bản ghi được tạo mới với tên công ty đúng như chuỗi nhập vào, cấu trúc database an toàn không bị phá vỡ | Critical | Company: `ClientTest' OR 1=1 --` |
| CRM_CUST_TC_014 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Validate định dạng nhập liệu trường Phone | Form tạo mới đang mở | 1. Nhập chữ cái và ký tự lạ vào trường Phone: `Phone1234abcd!@`<br>2. Click "Save" | 1. Dữ liệu được chấp nhận hoặc hệ thống tự động lọc bỏ ký tự không hợp lệ tùy quy tắc backend<br>2. Không xảy ra lỗi crash hệ thống | High | Phone: `Phone1234abcd!@` |
| CRM_CUST_TC_015 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Validate định dạng nhập liệu trường Website | Form tạo mới đang mở | 1. Nhập chuỗi không phải định dạng URL vào trường Website: `invalid-website-format`<br>2. Click "Save" | 1. Hệ thống xử lý an toàn (chấp nhận lưu dạng text hoặc báo lỗi định dạng URL không hợp lệ)<br>2. Không xảy ra lỗi crash hệ thống | High | Website: `invalid-website-format` |
| CRM_CUST_TC_016 | SUB-02: Create/Edit | 🔴 High | Field-Level Validation: Chọn nhiều giá trị cho dropdown Groups | Form tạo mới đang mở, có sẵn các Groups: "VIP", "Wholesale", "Retail" | 1. Click vào trường dropdown Groups<br>2. Chọn lần lượt "VIP" và "Wholesale"<br>3. Click ra ngoài dropdown và kiểm tra hiển thị lựa chọn | 1. Dropdown mở ra danh sách group<br>2. Cả 2 nhóm "VIP" và "Wholesale" được tích chọn<br>3. Trường Groups hiển thị 2 nhãn (tags) đại diện cho 2 group đã chọn | Medium | Groups: VIP, Wholesale |
| CRM_CUST_TC_017 | SUB-02: Create/Edit | 🔴 High | Tạo mới khách hàng bằng nút "Save and create contact" | Form tạo mới đang mở | 1. Nhập Company: `Company_Contact_Link_01`<br>2. Click nút "Save and create contact" | 1. Hệ thống lưu khách hàng thành công<br>2. Chuyển hướng trực tiếp sang modal/form tạo mới Contact của khách hàng đó (`Add contact`) | High | Company: `Company_Contact_Link_01` |
| CRM_CUST_TC_018 | SUB-02: Create/Edit | 🔴 High | Chỉnh sửa thông tin khách hàng hiện tại thành công | Đã có khách hàng hiện hữu trong hệ thống | 1. Vào trang chi tiết khách hàng `/admin/clients/client/{id}`<br>2. Tại tab Customer Details, sửa trường Company từ `Tên Cũ` thành `Tên Mới Được Cập Nhật`<br>3. Click nút "Save" ở góc dưới bên phải | 1. Vào trang chi tiết thành công<br>2. Tên mới được nhập vào trường<br>3. Lưu thay đổi thành công, hệ thống hiển thị thông báo cập nhật thành công, tên mới được áp dụng và giữ lại sau khi reload trang | High | Company: `Tên Mới Được Cập Nhật` |
| CRM_CUST_TC_019 | SUB-02: Create/Edit | 🔴 High | Tự động điền thông tin địa chỉ với nút "Same as Customer Info" và "Copy Billing Address" | Form tạo mới đang mở | 1. Tại tab Customer Details, nhập Address = `456 CMT8`, City = `Cần Thơ`, Country = `Vietnam`<br>2. Chuyển qua tab Billing & Shipping<br>3. Click nút `"Same as Customer Info"` ở cột Billing Address<br>4. Click nút `"Copy Billing Address"` ở cột Shipping Address | 1-2. Thông tin cơ bản được điền<br>3. Thông tin địa chỉ Billing Address tự động điền giống thông tin Customer Details (Street: 456 CMT8, City: Cần Thơ, Country: Vietnam)<br>4. Thông tin Shipping Address tự động điền giống Billing Address | Medium | N/A |

### SUB-03: Customer Detail Profile & Sidebar Navigation (🟢 Low Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_020 | SUB-03: Detail View | 🟢 Low | Verify hiển thị tiêu đề Header và tab Profile mặc định | Đang ở trang chi tiết một khách hàng cụ thể | 1. Truy cập `/admin/clients/client/{customer_id}`<br>2. Quan sát Header và nội dung chính bên phải | 1. Header hiển thị đúng format: `#{ID} {Tên Công Ty}`<br>2. Label "Profile" hiển thị ở bên phải header<br>3. Tab Profile được chọn mặc định và hiển thị form chỉnh sửa | Low | ID: `1`, Company: `Anh Tester Company` |
| CRM_CUST_TC_021 | SUB-03: Detail View | 🟢 Low | Verify điều hướng mượt mà qua các Tab ở sidebar trái | Đang ở trang chi tiết khách hàng | 1. Click lần lượt vào các tab ở sidebar trái: `Contacts`, `Notes`, `Statement`, `Invoices`, `Projects`, `Tasks`, `Tickets`<br>2. Quan sát nội dung tải tương ứng bên phải | 1. Chuyển tab nhanh chóng mà không reload lại toàn bộ trang<br>2. Mỗi tab hiển thị đúng nội dung và bảng thông tin tương ứng với tab đó | Medium | N/A |
| CRM_CUST_TC_022 | SUB-03: Detail View | 🟢 Low | Verify tính năng gán quản lý trong tab Customer Admins | Đang ở trang chi tiết khách hàng, có sẵn nhân viên Staff trong hệ thống | 1. Tại tab Profile, click sub-tab `Customer Admins`<br>2. Click dropdown Chọn Admins và chọn 1 nhân viên: `Staff_Tester_01`<br>3. Click "Save" | 1. Sub-tab Customer Admins hiển thị đúng<br>2. Nhân viên được chọn hiển thị trong dropdown<br>3. Lưu thành công, nhân viên được gán thành công làm quản lý cho khách hàng này | Medium | Admin gán: `Staff_Tester_01` |
| CRM_CUST_TC_023 | SUB-03: Detail View | 🟢 Low | Verify hủy bỏ thao tác xóa khách hàng (Cancel Delete) | Đang ở trang chi tiết khách hàng | 1. Click vào biểu tượng dropdown action bên cạnh tên công ty trên header<br>2. Click nút "Delete"<br>3. Khi popup xác nhận hiện ra, click nút "Cancel" | 1-2. Popup xác nhận hiển thị với câu hỏi có chắc chắn muốn xóa không<br>3. Popup đóng lại, khách hàng KHÔNG bị xóa, hệ thống vẫn ở trang chi tiết | Medium | N/A |

### SUB-04: Contacts Management (🔴 High Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_024 | SUB-04: Contacts | 🔴 High | Verify bảng Contacts trống khi khách hàng mới tạo chưa có contact | Khách hàng mới được tạo thành công và chưa được gán contact nào | 1. Vào trang chi tiết khách hàng<br>2. Click tab `Contacts` ở sidebar trái | 1. Tab Contacts tải thành công<br>2. Bảng Contacts trống và hiển thị thông báo: `"No entries found"` | Low | N/A |
| CRM_CUST_TC_025 | SUB-04: Contacts | 🔴 High | Thêm mới Contact cho khách hàng thành công (Happy Path) | Đang ở tab Contacts của một khách hàng cụ thể | 1. Click nút "New Contact"<br>2. Điền đầy đủ thông tin trong form Popup:<br>- First Name: `An`<br>- Last Name: `Tester`<br>- Email: `an_tester_1712@auto.test` (unique)<br>- Password: `SecurePass123`<br>3. Click nút "Save" | 1. Popup "Add new contact" hiển thị<br>2. Thông tin được điền đầy đủ<br>3. Lưu thành công, popup đóng lại, hiển thị thông báo thành công và contact `An Tester` xuất hiện trên bảng Contacts của khách hàng | Critical | First Name: `An`<br>Last Name: `Tester`<br>Email: `an_tester_1712@auto.test`<br>Password: `SecurePass123` |
| CRM_CUST_TC_026 | SUB-04: Contacts | 🔴 High | Field-Level Validation: Validate trường First Name của Contact để trống | Đang mở popup Add new contact | 1. Để trống trường First Name<br>2. Điền các trường khác hợp lệ<br>3. Click nút "Save" | 1. Popup báo lỗi dưới trường First Name: `"This field is required."`<br>2. Form không được lưu, popup không đóng | High | First Name: (trống)<br>Last Name: `Tester`<br>Email: `test_contact_01@auto.test` |
| CRM_CUST_TC_027 | SUB-04: Contacts | 🔴 High | Field-Level Validation: Validate trường Last Name của Contact để trống | Đang mở popup Add new contact | 1. Điền First Name: `An`<br>2. Để trống trường Last Name<br>3. Click "Save" | 1. Popup báo lỗi dưới trường Last Name: `"This field is required."`<br>2. Form không được lưu | High | First Name: `An`<br>Last Name: (trống)<br>Email: `test_contact_02@auto.test` |
| CRM_CUST_TC_028 | SUB-04: Contacts | 🔴 High | Field-Level Validation: Validate trường Email của Contact để trống | Đang mở popup Add new contact | 1. Nhập First/Last name<br>2. Để trống trường Email<br>3. Click "Save" | 1. Popup báo lỗi dưới trường Email: `"This field is required."`<br>2. Form không được lưu | High | First Name: `An`<br>Last Name: `Tester`<br>Email: (trống) |
| CRM_CUST_TC_029 | SUB-04: Contacts | 🔴 High | Field-Level Validation: Validate định dạng Email của Contact sai (thiếu @) | Đang mở popup Add new contact | 1. Nhập Email: `invalid-email-format`<br>2. Click "Save" | 1. Trình duyệt chặn submit và hiển thị tooltip validation HTML5: `"Please include an '@' in the email address."`<br>2. Form không được gửi | High | Email: `invalid-email-format` |
| CRM_CUST_TC_030 | SUB-04: Contacts | 🔴 High | Field-Level Validation: Validate Email của Contact đã tồn tại (Unique Email) | Có sẵn contact với email `an_tester_1712@auto.test` trong hệ thống | 1. Click "New Contact" để tạo contact mới<br>2. Nhập Email trùng: `an_tester_1712@auto.test`<br>3. Điền các thông tin khác hợp lệ và click "Save" | 1-2. Email trùng được nhập<br>3. Hệ thống báo lỗi trùng lặp: `"Email already exists"` (hoặc thông báo lỗi server-side tương ứng), không cho phép tạo trùng email | Critical | Email: `an_tester_1712@auto.test` |
| CRM_CUST_TC_031 | SUB-04: Contacts | 🔴 High | Toggle bật/tắt trạng thái Active/Inactive của Contact | Có sẵn ít nhất 1 contact trong danh sách | 1. Tại bảng Contacts của khách hàng, tìm toggle switch cột Active (đang ở màu xanh ON)<br>2. Click chuyển toggle switch sang OFF (màu xám)<br>3. Tải lại trang (F5) và kiểm tra lại trạng thái | 1-2. Toggle chuyển sang màu xám. Hiển thị thông báo cập nhật thành công góc màn hình nhanh chóng<br>3. Trạng thái của contact vẫn được lưu là Inactive sau khi reload trang | High | N/A |
| CRM_CUST_TC_032 | SUB-04: Contacts | 🔴 High | Verify trang Contacts tổng hợp của tất cả các khách hàng | Đã đăng nhập hệ thống | 1. Tại trang danh sách Customers (`/admin/clients`), click nút **"Contacts"** trên đầu trang<br>2. Quan sát DataTable hiển thị các contacts | 1. Chuyển hướng thành công sang danh sách contacts tổng hợp<br>2. Hiển thị đầy đủ thông tin: First Name, Last Name, Email, Company, Phone, Position, Last Login, Active của tất cả contacts thuộc mọi khách hàng | High | N/A |
| CRM_CUST_TC_033 | SUB-04: Contacts | 🔴 High | Xóa Khách hàng thành công (Happy Path) | Đang ở trang chi tiết khách hàng | 1. Click dropdown Action bên cạnh tên Company trên header<br>2. Click nút "Delete"<br>3. Khi popup xác nhận hiện ra, click nút "Confirm" | 1-2. Popup xác nhận hiển thị<br>3. Khách hàng bị xóa thành công:<br>- Chuyển hướng về trang danh sách Customers `/admin/clients`<br>- Khách hàng đó biến mất khỏi DataTable danh sách<br>- Tất cả contacts liên quan bị xóa cascade sạch sẽ | Critical | Khách hàng: `Company_Auto_17120492` |

### SUB-05: Data Integration - Import & Export (🔴 High Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_034 | SUB-05: Integration | 🔴 High | Verify tải file CSV mẫu thành công | Đang ở trang Import Customers (`/admin/clients/import`) | 1. Click nút "Download Sample" | 1. File CSV mẫu tên `sample_customers.csv` (hoặc tương tự) được tải xuống thiết bị thành công | Medium | File tải: `sample_customers.csv` |
| CRM_CUST_TC_035 | SUB-05: Integration | 🔴 High | Chạy giả lập Import (Simulate Import) với file CSV hợp lệ thành công | Trang Import đang mở, có file CSV hợp lệ chứa đầy đủ cột bắt buộc | 1. Click "Choose CSV File" và chọn file `valid_import_sim.csv`<br>2. Nhập default password: `DefaultPass123`<br>3. Click nút "Simulate Import" | 1. File được chọn<br>2-3. Hệ thống chạy mô phỏng thành công, hiển thị bảng xem trước kết quả giả lập, hiển thị số dòng hợp lệ và KHÔNG có lỗi báo đỏ | High | File: `valid_import_sim.csv`<br>Default Password: `DefaultPass123` |
| CRM_CUST_TC_036 | SUB-05: Integration | 🔴 High | Chạy giả lập Import thất bại do dữ liệu lỗi trong file CSV | Trang Import đang mở, file CSV thiếu cột bắt buộc `Firstname` hoặc trùng email | 1. Chọn file CSV lỗi `invalid_import.csv`<br>2. Click nút "Simulate Import" | 1. File lỗi được chọn<br>2. Hệ thống báo lỗi chi tiết ở dòng dữ liệu không hợp lệ (ví dụ: thiếu cột bắt buộc Firstname, hoặc định dạng email sai), chặn không cho giả lập hoàn tất sạch sẽ | High | File: `invalid_import.csv` |
| CRM_CUST_TC_037 | SUB-05: Integration | 🔴 High | Thực hiện Import thật dữ liệu khách hàng thành công | Trang Import đang mở, có file CSV hợp lệ | 1. Chọn file CSV hợp lệ `valid_import_real.csv`<br>2. Click nút "Import"<br>3. Quay lại trang danh sách khách hàng để kiểm tra dữ liệu | 1-2. Import thực hiện thành công, hiển thị thông báo import hoàn tất với số lượng dòng thành công<br>3. Dữ liệu khách hàng và contacts từ file CSV hiển thị chính xác trên DataTable danh sách | Critical | File: `valid_import_real.csv` |
| CRM_CUST_TC_038 | SUB-05: Integration | 🔴 High | Export danh sách khách hàng ra định dạng Excel | Đang ở trang danh sách khách hàng | 1. Click nút "Export" trên bảng DataTable<br>2. Chọn tùy chọn "Excel" | 1. File định dạng Excel (`.xlsx`) được tải xuống thiết bị thành công<br>2. Dữ liệu trong file Excel khớp với DataTable danh sách hiển thị | High | N/A |
| CRM_CUST_TC_039 | SUB-05: Integration | 🔴 High | Export danh sách khách hàng ra định dạng CSV | Đang ở trang danh sách khách hàng | 1. Click nút "Export" trên bảng DataTable<br>2. Chọn tùy chọn "CSV" | 1. File định dạng CSV (`.csv`) được tải xuống thiết bị thành công<br>2. Cấu trúc file đúng, dữ liệu đầy đủ | High | N/A |
| CRM_CUST_TC_040 | SUB-05: Integration | 🔴 High | Export danh sách khách hàng ra định dạng PDF | Đang ở trang danh sách khách hàng | 1. Click nút "Export" trên bảng DataTable<br>2. Chọn tùy chọn "PDF" | 1. File định dạng PDF (`.pdf`) được tải xuống thiết bị thành công<br>2. Bố cục PDF ngay ngắn, không bị vỡ hoặc mất font tiếng Việt | High | N/A |
| CRM_CUST_TC_041 | SUB-05: Integration | 🔴 High | Sử dụng tính năng Print để mở hộp thoại in danh sách | Đang ở trang danh sách khách hàng | 1. Click nút "Export" trên bảng DataTable<br>2. Chọn tùy chọn "Print" | 1. Trang hiển thị chế độ Print view tối giản<br>2. Trình duyệt mở hộp thoại in (Print Dialog) thành công | Medium | N/A |

### SUB-06: Bulk Actions & Advanced Filters (🟡 Medium Risk)

| TC ID | Module | Risk Level | Test Title | Pre-Condition | Test Steps | Expected Result | Priority | Test Data |
|-------|--------|------------|------------|---------------|------------|-----------------|----------|-----------|
| CRM_CUST_TC_042 | SUB-06: Bulk/Filter | 🟡 Medium | Gán Group hàng loạt (Mass Group Assign) cho nhiều khách hàng | DataTable có sẵn nhiều khách hàng, có sẵn group "VIP" | 1. Tick chọn 3 khách hàng bằng checkbox đầu dòng DataTable<br>2. Click nút "Bulk Actions" trên đầu bảng<br>3. Trên Modal Bulk Actions, tại dropdown Groups chọn "VIP"<br>4. Click "Confirm"<br>5. Kiểm tra lại thông tin nhóm của 3 khách hàng này trên DataTable | 1. Checkbox của 3 khách hàng được tick chọn<br>2. Modal Bulk Actions hiển thị<br>3. Group "VIP" được chọn trên modal<br>4. Thực hiện thành công, modal đóng lại, hiển thị thông báo cập nhật thành công<br>5. Cột Groups của 3 khách hàng đều xuất hiện tag "VIP" | High | Khách hàng đã chọn: 3 bản ghi<br>Group: VIP |
| CRM_CUST_TC_043 | SUB-06: Bulk/Filter | 🟡 Medium | Gỡ bỏ toàn bộ groups của khách hàng qua Bulk Actions | DataTable có sẵn khách hàng đã được gán các groups trước đó | 1. Tick chọn 2 khách hàng đang có groups<br>2. Click nút "Bulk Actions"<br>3. Để trống dropdown Groups (không chọn group nào)<br>4. Click "Confirm"<br>5. Kiểm tra thông tin nhóm của 2 khách hàng | 1-2. Khách hàng được chọn, modal mở ra<br>3. Dropdown group để trống<br>4. Thực hiện thành công, modal đóng lại<br>5. Toàn bộ các groups gán cho 2 khách hàng trước đó bị gỡ bỏ hoàn toàn (cột Groups trống) | High | N/A |
| CRM_CUST_TC_044 | SUB-06: Bulk/Filter | 🟡 Medium | Xóa hàng loạt khách hàng (Mass Delete) qua Bulk Actions | DataTable có sẵn nhiều khách hàng | 1. Tick chọn 2 khách hàng bằng checkbox đầu dòng<br>2. Click nút "Bulk Actions"<br>3. Trên Modal Bulk Actions, tích vào checkbox "Mass Delete"<br>4. Click "Confirm"<br>5. Kiểm tra lại DataTable danh sách khách hàng | 1. Chọn khách hàng thành công<br>2. Modal Bulk Actions hiển thị<br>3. Checkbox "Mass Delete" được tick chọn<br>4. Xóa thành công, modal đóng lại, thông báo xóa thành công hiển thị<br>5. Cả 2 khách hàng bị xóa biến mất khỏi DataTable | Critical | Chọn 2 khách hàng cần xóa |
| CRM_CUST_TC_045 | SUB-06: Bulk/Filter | 🟡 Medium | Tìm kiếm nhanh real-time theo từ khóa trên DataTable | DataTable có nhiều khách hàng | 1. Nhập từ khóa: `Perfex_Auto` vào ô "Search..." ở góc phải DataTable<br>2. Nhập một từ khóa ngẫu nhiên không tồn tại: `random_no_exist_999`<br>3. Xóa từ khóa trong ô Search | 1. Bảng DataTable tự động lọc ngay lập tức, hiển thị các khách hàng có tên Company chứa "Perfex_Auto"<br>2. DataTable trống, hiển thị thông báo `"No matching records found"`<br>3. Bảng tự động tải lại đầy đủ danh sách ban đầu | High | Từ khóa 1: `Perfex_Auto`<br>Từ khóa 2: `random_no_exist_999` |
| CRM_CUST_TC_046 | SUB-06: Bulk/Filter | 🟡 Medium | Lọc nâng cao (Advanced Filter) với một điều kiện | DataTable chứa dữ liệu khách hàng từ nhiều quốc gia | 1. Click biểu tượng hình phễu (Filter) -> Chọn "New Filter"<br>2. Click "Add Rule"<br>3. Chọn tiêu chí: `Country` = `Vietnam`<br>4. Áp dụng bộ lọc và quan sát kết quả DataTable | 1. Form tạo bộ lọc hiển thị<br>2-3. Điều kiện lọc `Country = Vietnam` được thiết lập<br>4. DataTable lọc thành công, chỉ hiển thị các khách hàng có Country là Vietnam | High | Điều kiện: Country = Vietnam |
| CRM_CUST_TC_047 | SUB-06: Bulk/Filter | 🟡 Medium | Lọc nâng cao (Advanced Filter) kết hợp nhiều điều kiện | DataTable chứa dữ liệu đa dạng | 1. Click Filter -> Chọn "New Filter"<br>2. Click "Add Rule" 1: Chọn `Groups` = `VIP`<br>3. Click "Add Rule" 2: Chọn `Active` = `Yes`<br>4. Áp dụng bộ lọc và quan sát kết quả | 1. Form tạo bộ lọc hiển thị<br>2-3. Hai quy tắc lọc được thêm song song<br>4. DataTable lọc thành công, chỉ hiển thị các khách hàng vừa thuộc nhóm "VIP" vừa đang Active | High | Rule 1: Groups = VIP<br>Rule 2: Active = Yes |
| CRM_CUST_TC_048 | SUB-06: Bulk/Filter | 🟡 Medium | Verify đóng modal Bulk Actions không thực hiện thay đổi | DataTable có khách hàng được chọn | 1. Tick chọn 1 khách hàng<br>2. Click nút "Bulk Actions"<br>3. Tick chọn checkbox "Mass Delete"<br>4. Click nút "Close" (hoặc biểu tượng dấu X để đóng modal)<br>5. Kiểm tra DataTable danh sách khách hàng | 1-2. Modal Bulk Actions hiển thị<br>3. Lựa chọn Mass Delete được check<br>4. Modal đóng lại thành công<br>5. Khách hàng đã chọn KHÔNG bị xóa, dữ liệu giữ nguyên | Medium | N/A |

---

## TỔNG HỢP AMBIGUITIES ĐÃ GIẢI QUYẾT

| # | Ambiguity (Điểm mờ trong Requirements) | Giải quyết bằng Assumptions (Giả định được phê duyệt) | Test Cases liên quan |
|---|-----------------------------------------|-------------------------------------------------------|-----------------------|
| **AMB-01** | Giới hạn ký tự tối đa của trường `Company` | Giả định max là 255 ký tự. Nhập 256 ký tự để test boundary. | CRM_CUST_TC_011 |
| **AMB-02** | Validation định dạng các trường `Phone`, `Website`, `VAT` | Không có validation client-side nghiêm ngặt, cho phép nhập text tự do hoặc validate cơ bản. | CRM_CUST_TC_014, CRM_CUST_TC_015 |
| **AMB-03** | Cascade delete khi xóa một khách hàng | Bản ghi khách hàng bị xóa sẽ kéo theo toàn bộ Contacts liên quan bị xóa hoàn toàn khỏi DB. | CRM_CUST_TC_033 |
| **AMB-04** | Giới hạn số lượng Contacts của 1 Customer | Không giới hạn số lượng. | CRM_CUST_TC_025 |
| **AMB-05** | Xử lý trùng lặp email khi import file CSV | Hệ thống báo lỗi trùng lặp và bỏ qua dòng dữ liệu đó (hoặc báo "Email already exists" ở simulate). | CRM_CUST_TC_030, CRM_CUST_TC_036 |
| **AMB-06** | Vai trò của tab `Customer Admins` | Dùng để gán các staff/admin cụ thể chịu trách nhiệm quản lý khách hàng đó. | CRM_CUST_TC_022 |
| **AMB-07** | Toggle Active/Inactive có gửi thông báo không | Không gửi email hay notification tự động, chỉ cập nhật database. | CRM_CUST_TC_005, CRM_CUST_TC_031 |
| **AMB-08** | Giới hạn phân quyền vai trò không phải Admin | Tạm thời kiểm thử tập trung cho vai trò Admin, có đầy đủ quyền hạn. | Toàn bộ suite |

---

## THỐNG KÊ KỸ THUẬT VÀ PHÂN BỔ PRIORITY

| Tiêu chí | Số lượng |
|----------|----------|
| **Tổng số Test Cases** | **48** |
| **Phân bổ Priority** | |
| - Critical | 7 (TC_008, TC_009, TC_010, TC_012, TC_013, TC_033, TC_044) |
| - High | 28 |
| - Medium | 11 |
| - Low | 2 |
| **Kỹ thuật thiết kế Test Case áp dụng** | |
| - Kỹ thuật EP (Phân vùng tương đương) | TC_010, TC_026-TC_030 (đúng/sai/trống/trùng lặp) |
| - Kỹ thuật BVA (Phân tích giá trị biên) | TC_011 (tên Company 256 ký tự) |
| - Kỹ thuật Decision Table (Bảng quyết định) | TC_046, TC_047 (kết hợp các điều kiện lọc) |
| - Kỹ thuật State Transition (Chuyển đổi trạng thái) | TC_005, CRM_CUST_TC_017, CRM_CUST_TC_031 (thay đổi trạng thái active, lưu liên kết contact) |
| **Bao phủ Validation cụ thể từng trường (Field-Level)** | CRM_CUST_TC_010 đến CRM_CUST_TC_016 (tab Customer Details); CRM_CUST_TC_026 đến CRM_CUST_TC_030 (popup Add Contact) |
