# Tài Liệu Yêu Cầu (Requirements) — Module Customers

> **Hệ thống:** Perfex CRM  
> **URL Module:** `https://crm.anhtester.com/admin/clients`  
> **Phiên bản:** Quan sát ngày 03/04/2026  
> **Người thực hiện:** Antigravity AI Agent  
> **Vai trò truy cập:** Admin (`admin@example.com`)

---

## 1. Tổng Quan (Overview)

Module **Customers** là module quản lý thông tin khách hàng (Clients) trong hệ thống CRM. Module cho phép người dùng Admin quản lý toàn bộ vòng đời của khách hàng bao gồm: tạo mới, xem chi tiết, chỉnh sửa, xóa, import/export dữ liệu, quản lý liên hệ (Contacts), và thực hiện các thao tác hàng loạt (Bulk Actions).

### 1.1. Các Trang Chính

| Trang | URL | Mô tả |
|:------|:----|:------|
| Danh sách Customers | `/admin/clients` | Hiển thị tổng hợp và bảng dữ liệu khách hàng |
| Thêm mới Customer | `/admin/clients/client` | Form tạo khách hàng mới |
| Chi tiết Customer | `/admin/clients/client/{id}` | Xem/chỉnh sửa thông tin chi tiết khách hàng |
| Import Customers | `/admin/clients/import` | Import khách hàng từ file CSV |
| Danh sách Contacts | `/admin/clients` → nút Contacts | Xem tất cả liên hệ của mọi khách hàng |

### 1.2. Customers Summary (Bảng Tóm Tắt)

Trang danh sách hiển thị bảng tóm tắt thống kê ở phần đầu gồm:

| Chỉ số | Mô tả |
|:-------|:------|
| **Total Customers** | Tổng số khách hàng trong hệ thống |
| **Active Customers** | Số khách hàng đang hoạt động |
| **Inactive Customers** | Số khách hàng không hoạt động |
| **Active Contacts** | Tổng số liên hệ đang hoạt động |
| **Inactive Contacts** | Tổng số liên hệ không hoạt động |
| **Contacts Logged In Today** | Số liên hệ đăng nhập trong ngày |

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### FR-CUST-001: Xem Danh Sách Khách Hàng

**Mô tả:** Là một Admin, tôi muốn xem danh sách tất cả khách hàng trong hệ thống để có cái nhìn tổng quan về cơ sở khách hàng.

**Tiêu chí chấp nhận:**
- Hệ thống hiển thị bảng dữ liệu (DataTable) với các cột: `#` (ID), `Company`, `Primary Contact`, `Primary Email`, `Phone`, `Active` (Toggle switch), `Groups`, `Date Created`.
- Bảng hỗ trợ phân trang với dropdown chọn số lượng hiển thị: 25, 50, 100.
- Bảng hỗ trợ sắp xếp (sort) theo từng cột bằng cách click vào tiêu đề cột.
- Mỗi dòng có checkbox ở cột đầu tiên để chọn cho Bulk Actions.
- Cột `Company` hiển thị tên công ty dạng link, click để vào trang chi tiết.
- Cột `Phone` hiển thị số điện thoại dạng link.
- Cột `Active` hiển thị toggle switch cho phép bật/tắt trạng thái khách hàng ngay tại bảng.
- Cột `Groups` hiển thị các nhóm (tag/badge) mà khách hàng thuộc về.
- Có thanh tìm kiếm (Search) ở góc phải trên của bảng.

---

### FR-CUST-002: Tạo Mới Khách Hàng (New Customer)

**Mô tả:** Là một Admin, tôi muốn tạo mới một khách hàng với đầy đủ thông tin cơ bản và địa chỉ thanh toán/giao hàng.

**Tiêu chí chấp nhận:**
- Click nút **"+ New Customer"** trên trang danh sách sẽ chuyển đến form tạo mới tại `/admin/clients/client`.
- Form chia thành 2 tab: **Customer Details** và **Billing & Shipping**.
- Tab **Customer Details** là tab mặc định khi mở form.
- Trường **Company** là trường bắt buộc duy nhất (đánh dấu `*` màu đỏ).
- Khi nhấn **Save** mà không điền trường Company, hệ thống hiển thị thông báo lỗi `"This field is required."` màu đỏ bên dưới trường Company.
- Có 2 nút submit:
  - **"Save and create contact"**: Lưu khách hàng và chuyển sang form tạo Contact.
  - **"Save"**: Lưu khách hàng.
- Sau khi lưu thành công, hệ thống chuyển về trang chi tiết khách hàng vừa tạo.

---

### FR-CUST-003: Xem & Chỉnh Sửa Chi Tiết Khách Hàng (Customer Detail)

**Mô tả:** Là một Admin, tôi muốn xem và chỉnh sửa đầy đủ thông tin của một khách hàng cụ thể.

**Tiêu chí chấp nhận:**
- URL trang chi tiết có dạng: `/admin/clients/client/{customer_id}`.
- Header hiển thị: `#{ID} {Company Name}` kèm dropdown action (chứa chức năng Delete).
- Phía bên phải header hiển thị label **"Profile"**.
- Trang chia thành 2 phần:
  - **Sidebar trái**: Danh sách 19 tab liên quan.
  - **Nội dung chính (bên phải)**: Form chỉnh sửa thông tin.

#### Sidebar trái — Danh sách Tab:

| STT | Tab | Mô tả |
|:----|:----|:------|
| 1 | **Profile** | Thông tin hồ sơ (3 sub-tab: Customer Details, Billing & Shipping, Customer Admins) |
| 2 | **Contacts** | Danh sách liên hệ của khách hàng |
| 3 | **Notes** | Ghi chú nội bộ |
| 4 | **Statement** | Bản kê tài chính |
| 5 | **Invoices** | Danh sách hóa đơn |
| 6 | **Payments** | Lịch sử thanh toán |
| 7 | **Proposals** | Đề xuất/báo giá |
| 8 | **Credit Notes** | Ghi chú tín dụng |
| 9 | **Estimates** | Báo giá |
| 10 | **Subscriptions** | Đăng ký dịch vụ |
| 11 | **Expenses** | Chi phí liên quan |
| 12 | **Contracts** | Hợp đồng |
| 13 | **Projects** | Dự án |
| 14 | **Tasks** | Công việc |
| 15 | **Tickets** | Hỗ trợ / Sự cố |
| 16 | **Files** | Tệp đính kèm |
| 17 | **Vault** | Kho lưu trữ an toàn |
| 18 | **Reminders** | Nhắc nhở |
| 19 | **Map** | Bản đồ địa chỉ |

- Form Profile có 3 sub-tab:
  - **Customer Details**: Hiển thị và cho phép chỉnh sửa thông tin cơ bản (giống form tạo mới).
  - **Billing & Shipping**: Địa chỉ thanh toán và giao hàng.
  - **Customer Admins**: Danh sách admin quản lý khách hàng.
- Nút **Save** ở góc dưới bên phải cho phép lưu thay đổi.

---

### FR-CUST-004: Xóa Khách Hàng (Delete Customer)

**Mô tả:** Là một Admin, tôi muốn xóa một khách hàng khỏi hệ thống khi cần.

**Tiêu chí chấp nhận:**
- Trên trang chi tiết khách hàng, click dropdown bên cạnh `#{ID} {Company Name}` → chọn **Delete**.
- Hệ thống hiển thị hộp thoại xác nhận trước khi xóa.
- Sau khi xóa, hệ thống chuyển về trang danh sách Customers.

---

### FR-CUST-005: Quản Lý Contacts (Liên Hệ) Của Khách Hàng

**Mô tả:** Là một Admin, tôi muốn quản lý danh sách liên hệ của từng khách hàng.

**Tiêu chí chấp nhận:**
- Truy cập tab **Contacts** trong trang chi tiết khách hàng.
- Bảng dữ liệu Contacts gồm các cột: `Full Name`, `Email`, `Position`, `Phone`, `Active` (toggle), `Last Login`.
- Có nút **"New Contact"** để thêm liên hệ mới.
- Có nút **Export** để xuất dữ liệu contacts.
- Có thanh tìm kiếm (Search) và dropdown chọn số lượng hiển thị (mặc định 25).
- Nếu chưa có contact nào, bảng hiển thị **"No entries found"**.

#### Trang Contacts Tổng Hợp (Tất cả khách hàng):
- Truy cập bằng nút **"Contacts"** trên trang danh sách Customers.
- Bảng hiển thị tất cả contacts của mọi khách hàng.
- Các cột: `First Name`, `Last Name`, `Email`, `Company`, `Phone`, `Position`, `Last Login`, `Active`.
- Có toggle switch để bật/tắt trạng thái Active ngay tại bảng.
- Tên contact là link dẫn đến trang chi tiết.

---

### FR-CUST-006: Import Khách Hàng (Import Customers)

**Mô tả:** Là một Admin, tôi muốn import dữ liệu khách hàng từ file CSV để nạp hàng loạt.

**Tiêu chí chấp nhận:**
- Click nút **"Import Customers"** trên trang danh sách → chuyển đến `/admin/clients/import`.
- Trang Import hiển thị:
  - **Hướng dẫn**: Yêu cầu file CSV, mã hóa UTF-8, định dạng ngày `Y-m-d`, tránh import email trùng lặp.
  - **Nút "Download Sample"**: Tải file CSV mẫu.
  - **Danh sách cột dữ liệu** (các trường bắt buộc đánh dấu `*`):
    - Bắt buộc: `Firstname*`, `Lastname*`, `Email*`, `Company*`
    - Không bắt buộc: `Contact phonenumber`, `Position`, `Vat`, `Phonenumber`, `Country`, `City`, `Zip`, `State`, `Address`
  - **Trường chọn file CSV** (Choose CSV File).
  - **Dropdown Groups**: Chọn nhóm để gán cho khách hàng import.
  - **Trường "Default password for all contacts"**: Mật khẩu mặc định cho contacts mới.
- Có 2 nút chức năng:
  - **"Import"**: Thực hiện import dữ liệu thực.
  - **"Simulate Import"**: Chạy giả lập để kiểm tra lỗi trước khi import thật.

---

### FR-CUST-007: Export Dữ Liệu Khách Hàng (Export Customers)

**Mô tả:** Là một Admin, tôi muốn xuất dữ liệu khách hàng ra các định dạng khác nhau.

**Tiêu chí chấp nhận:**
- Click nút **"Export"** trên bảng dữ liệu → hiển thị dropdown với 4 tùy chọn:
  - **Excel** (.xlsx)
  - **CSV** (.csv)
  - **PDF** (.pdf)
  - **Print** (In trực tiếp từ trình duyệt)

---

### FR-CUST-008: Thao Tác Hàng Loạt (Bulk Actions)

**Mô tả:** Là một Admin, tôi muốn thực hiện các thao tác hàng loạt trên nhiều khách hàng cùng lúc.

**Tiêu chí chấp nhận:**
- Chọn ít nhất 1 khách hàng bằng checkbox trong bảng.
- Click nút **"Bulk Actions"** → hiển thị modal dialog với:
  - **Checkbox "Mass Delete"**: Đánh dấu để xóa hàng loạt các khách hàng đã chọn.
  - **Dropdown "Groups"**: Gán nhóm cho các khách hàng đã chọn.
  - **Cảnh báo**: _"If you do not select any group all groups assigned to the selected customers will be removed."_ (Nếu không chọn nhóm nào, tất cả nhóm đã gán cho khách hàng sẽ bị gỡ bỏ).
  - **Nút "Confirm"**: Xác nhận thực hiện thao tác.
  - **Nút "Close"**: Đóng modal mà không thực hiện.

---

### FR-CUST-009: Tìm Kiếm & Lọc Dữ Liệu (Search & Filter)

**Mô tả:** Là một Admin, tôi muốn tìm kiếm và lọc danh sách khách hàng theo nhiều tiêu chí.

**Tiêu chí chấp nhận:**

#### Tìm kiếm nhanh:
- Ô tìm kiếm (**"Search..."**) ở góc phải trên bảng.
- Tìm kiếm real-time khi nhập ký tự.

#### Bộ lọc nâng cao (Filter):
- Click biểu tượng **filter** (hình phễu) ở góc phải trên cùng trang.
- Chọn **"New Filter"** → hiển thị giao diện tạo bộ lọc.
- Sử dụng **"Add Rule"** để thêm các tiêu chí lọc.

**Các tiêu chí lọc khả dụng:**

| Nhóm | Tiêu chí |
|:-----|:---------|
| Thông tin cơ bản | Phone, Active (trạng thái), City, Zip Code, State, Country |
| Liên kết dữ liệu | Invoices, Estimates, Proposals, Projects, Contract Types, Groups |
| Phân quyền | Responsible Admin, Customers assigned to me |
| Trạng thái đặc biệt | Requires Registration Confirmation |

---

## 3. Đặc Tả Trường Dữ Liệu (Field Specifications)

### 3.1. Tab Customer Details (Thông tin khách hàng)

| Tên Trường (Label) | Loại (UI Type) | Bắt Buộc | ID/Selector | Giá Trị Mặc Định | Ràng Buộc/Ghi Chú |
|:--------------------|:---------------|:---------|:------------|:------------------|:-------------------|
| **Company** | Text Input | **Có (*)** | `company` | — | Trường bắt buộc duy nhất. Validation message: `"This field is required."` |
| **VAT Number** | Text Input | Không | `vat` | — | Mã số thuế GTGT |
| **Phone** | Text Input | Không | `phonenumber` | — | Số điện thoại công ty |
| **Website** | Text Input | Không | `website` | — | URL website. Có nút icon 🌐 mở link ngoài |
| **Groups** | Dropdown (Multi-select) | Không | `groups` | Nothing selected | Cho phép chọn nhiều nhóm. Có nút **"+"** để thêm nhóm mới nhanh |
| **Currency** | Dropdown (Single-select) | Không | `default_currency` | System Default | Danh sách các loại tiền tệ (VD: USD, VND, EUR...) |
| **Default Language** | Dropdown (Single-select) | Không | `default_language` | System Default | Danh sách ngôn ngữ (VD: Vietnamese, English...) |
| **Address** | Textarea | Không | `address` | — | Địa chỉ chi tiết, có thể nhập nhiều dòng |
| **City** | Text Input | Không | `city` | — | Tên thành phố |
| **State** | Text Input | Không | `state` | — | Tên tỉnh/bang |
| **Zip Code** | Text Input | Không | `zip` | — | Mã bưu điện |
| **Country** | Dropdown (Single-select) | Không | `country` | Nothing selected | Danh sách các quốc gia |

---

### 3.2. Tab Billing & Shipping (Địa chỉ Thanh Toán & Giao Hàng)

Tab này chia thành 2 cột song song: **Billing Address** (trái) và **Shipping Address** (phải).

#### Chức năng copy nhanh:
- **"Same as Customer Info"**: Copy thông tin địa chỉ từ tab Customer Details sang Billing Address.
- **"Copy Billing Address"**: Copy thông tin Billing Address sang Shipping Address.

#### Billing Address (Địa chỉ Thanh Toán):

| Tên Trường | Loại | Bắt Buộc | ID/Selector |
|:-----------|:-----|:---------|:------------|
| Street | Textarea | Không | `billing_street` |
| City | Text Input | Không | `billing_city` |
| State | Text Input | Không | `billing_state` |
| Zip Code | Text Input | Không | `billing_zip` |
| Country | Dropdown | Không | `billing_country` |

#### Shipping Address (Địa chỉ Giao Hàng):

| Tên Trường | Loại | Bắt Buộc | ID/Selector |
|:-----------|:-----|:---------|:------------|
| Street | Textarea | Không | `shipping_street` |
| City | Text Input | Không | `shipping_city` |
| State | Text Input | Không | `shipping_state` |
| Zip Code | Text Input | Không | `shipping_zip` |
| Country | Dropdown | Không | `shipping_country` |

---

### 3.3. Import Customers — Đặc Tả Cột Dữ Liệu

| Tên Cột (Column) | Bắt Buộc | Ghi Chú |
|:------------------|:---------|:--------|
| **Firstname** | **Có (*)** | Tên (first name) của liên hệ |
| **Lastname** | **Có (*)** | Họ (last name) của liên hệ |
| **Email** | **Có (*)** | Email liên hệ. Kiểm tra trùng lặp khi import |
| **Company** | **Có (*)** | Tên công ty khách hàng |
| Contact phonenumber | Không | Số điện thoại liên hệ |
| Position | Không | Chức vụ |
| Vat | Không | Mã số thuế |
| Phonenumber | Không | Số điện thoại công ty |
| Country | Không | Quốc gia |
| City | Không | Thành phố |
| Zip | Không | Mã bưu điện |
| State | Không | Tỉnh/bang |
| Address | Không | Địa chỉ |

---

### 3.4. Bảng Customers — Đặc Tả Cột Danh Sách

| Tên Cột | Mô Tả | Sắp Xếp | Ghi Chú |
|:---------|:------|:---------|:--------|
| Checkbox | Chọn để thực hiện Bulk Actions | Không | Có checkbox "Chọn tất cả" ở header |
| **#** | ID khách hàng (tự động sinh) | Có | Số tăng dần |
| **Company** | Tên công ty | Có | Link dẫn đến chi tiết. Sắp xếp A-Z mặc định |
| **Primary Contact** | Liên hệ chính | Có | Hiển thị tên contact chính (nếu có) |
| **Primary Email** | Email chính | Có | Email của contact chính |
| **Phone** | Số điện thoại | Có | Link gọi điện |
| **Active** | Trạng thái hoạt động | Có | Toggle switch bật/tắt |
| **Groups** | Nhóm khách hàng | Có | Hiển thị dạng badge/tag |
| **Date Created** | Ngày tạo | Có | Format: `dd-mm-yyyy HH:mm:ss` |

---

## 4. Quy Tắc Nghiệp Vụ & Validation (Business Rules & Validations)

### 4.1. Validation Khi Tạo/Chỉnh Sửa Khách Hàng

| Trường | Quy Tắc | Thông Báo Lỗi | Loại Validation |
|:-------|:--------|:---------------|:----------------|
| **Company** | Bắt buộc nhập, không được để trống | `"This field is required."` | Client-side (JavaScript) |

> **Ghi chú:** Dựa trên quan sát UI, chỉ có trường **Company** có validation bắt buộc phía client. Các trường còn lại đều không bắt buộc.

### 4.2. Quy Tắc Import

| Quy Tắc | Mô Tả |
|:---------|:------|
| Định dạng file | Bắt buộc CSV, mã hóa UTF-8 |
| Định dạng ngày | `Y-m-d` (VD: 2026-04-03) |
| Trùng lặp Email | Hệ thống kiểm tra trùng lặp email khi import |
| Trường bắt buộc | `Firstname`, `Lastname`, `Email`, `Company` |
| Simulate Import | Cho phép chạy thử nghiệm trước khi import thật |
| Mật khẩu mặc định | Có thể thiết lập mật khẩu mặc định cho tất cả contacts khi import |

### 4.3. Quy Tắc Bulk Actions

| Quy Tắc | Mô Tả |
|:---------|:------|
| Điều kiện kích hoạt | Phải chọn ít nhất 1 khách hàng bằng checkbox |
| Mass Delete | Checkbox cho phép xóa hàng loạt khách hàng đã chọn |
| Groups | Gán nhóm hàng loạt. Nếu không chọn nhóm nào → tất cả nhóm hiện tại sẽ bị gỡ bỏ |
| Xác nhận | Bắt buộc click **"Confirm"** để thực hiện |

### 4.4. Quy Tắc Toggle Active

| Quy Tắc | Mô Tả |
|:---------|:------|
| Thao tác | Click toggle switch để bật/tắt trạng thái Active |
| Phạm vi | Thay đổi trạng thái ngay tại bảng danh sách, không cần vào chi tiết |
| Hiệu lực | Thay đổi được lưu ngay lập tức (không cần nhấn Save) |

---

## 5. Luồng Xử Lý Chính (User Flows)

### 5.1. Luồng Tạo Mới Khách Hàng

```
1. Admin truy cập trang Customers (/admin/clients)
2. Click nút "+ New Customer"
3. Hệ thống chuyển đến form tạo mới (/admin/clients/client)
4. Tab "Customer Details" hiển thị mặc định
5. Admin nhập thông tin:
   a. Nhập Company (bắt buộc)
   b. Nhập các trường tùy chọn: VAT, Phone, Website, Groups, Currency, Language, Address...
6. (Tùy chọn) Chuyển sang tab "Billing & Shipping" để nhập địa chỉ thanh toán/giao hàng
7. Click "Save" hoặc "Save and create contact"
   - Nếu thiếu Company → Hiển thị lỗi "This field is required."
   - Nếu hợp lệ → Lưu thành công → Chuyển đến trang chi tiết khách hàng mới
```

### 5.2. Luồng Chỉnh Sửa Khách Hàng

```
1. Admin truy cập trang Customers
2. Click vào tên Company trong bảng
3. Hệ thống chuyển đến trang chi tiết (/admin/clients/client/{id})
4. Tab "Profile" → Sub-tab "Customer Details" hiển thị mặc định
5. Admin chỉnh sửa thông tin cần thiết
6. Click "Save" để lưu thay đổi
```

### 5.3. Luồng Xóa Khách Hàng

```
1. Admin truy cập trang chi tiết khách hàng
2. Click dropdown bên cạnh "#{ID} {Company Name}"
3. Chọn "Delete"
4. Hệ thống hiển thị hộp thoại xác nhận
5. Xác nhận → Khách hàng bị xóa → Chuyển về danh sách
```

### 5.4. Luồng Import Khách Hàng

```
1. Admin truy cập trang Customers
2. Click nút "Import Customers"
3. Hệ thống chuyển đến trang Import (/admin/clients/import)
4. (Tùy chọn) Click "Download Sample" để tải file mẫu
5. Chuẩn bị file CSV theo cấu trúc yêu cầu
6. Chọn file CSV (Choose CSV File)
7. (Tùy chọn) Chọn Groups và thiết lập Default Password
8. Click "Simulate Import" để kiểm tra lỗi dữ liệu trước
9. Nếu kết quả mô phỏng OK → Click "Import" để thực hiện import thật
```

### 5.5. Luồng Export Dữ Liệu

```
1. Admin truy cập trang Customers
2. Click nút "Export" trên bảng dữ liệu
3. Chọn định dạng: Excel / CSV / PDF / Print
4. Hệ thống tải file hoặc mở cửa sổ in
```

### 5.6. Luồng Thao Tác Hàng Loạt (Bulk Actions)

```
1. Admin truy cập trang Customers
2. Chọn một hoặc nhiều khách hàng bằng checkbox
3. Click nút "Bulk Actions"
4. Modal dialog hiển thị:
   a. Đánh dấu "Mass Delete" nếu muốn xóa hàng loạt
   b. Chọn Groups nếu muốn gán nhóm hàng loạt
5. Click "Confirm" để thực hiện
```

---

## 6. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

| Yêu Cầu | Mô Tả |
|:---------|:------|
| **Responsive** | Giao diện tương thích trên Desktop (tối ưu 1920x1080) |
| **DataTable Performance** | Bảng dữ liệu hỗ trợ phân trang, tránh load toàn bộ dữ liệu cùng lúc |
| **Real-time Search** | Tìm kiếm nhanh real-time khi nhập ký tự |
| **Toggle Instant** | Toggle Active/Inactive lưu ngay lập tức không cần reload |
| **Sort Multi-column** | Hỗ trợ sắp xếp theo từng cột |
| **Browser Support** | Hỗ trợ các trình duyệt chính: Chrome, Firefox, Edge |

---

## 7. Câu Hỏi / Làm Rõ Với PO-User

> Các câu hỏi bên dưới cần được làm rõ với Product Owner vì không thể xác nhận chỉ từ UI:

| # | Câu Hỏi | Lý Do |
|:--|:--------|:------|
| 1 | Trường **Company** có ràng buộc về **độ dài tối đa** (maxlength) không? | Không quan sát được thuộc tính maxlength trên UI |
| 2 | Trường **Phone** có cần validation định dạng số điện thoại không? | Trên UI không có validation client-side cho trường này |
| 3 | Trường **Website** có cần validation định dạng URL hợp lệ không? | Không quan sát được validation |
| 4 | Trường **VAT Number** có cần kiểm tra định dạng theo quốc gia không? | Không có validation rõ ràng trên UI |
| 5 | Khi **xóa khách hàng**, dữ liệu liên quan (Invoices, Projects, Contacts...) có bị cascade xóa không? | Không thể xác nhận từ UI |
| 6 | Có giới hạn **số lượng contacts** cho mỗi khách hàng không? | Không quan sát được |
| 7 | Trường **Email** trong Import có kiểm tra định dạng email hợp lệ không? | Cần xác nhận server-side validation |
| 8 | Tab **Customer Admins** trong Profile có chức năng gì cụ thể? | Chưa inspect sâu tab này |
| 9 | Khi toggle **Active/Inactive**, có gửi notification hay email không? | Không quan sát được hành vi backend |
| 10 | **Quyền hạn (Permissions)**: Các vai trò khác (Staff, không phải Admin) có quyền thao tác gì trên module Customers? | Chỉ test với tài khoản Admin |

---

> **Ghi chú cuối:** Tài liệu này được xây dựng dựa trên việc inspect trực tiếp giao diện UI bằng Playwright MCP với tài khoản Admin. Các quy tắc nghiệp vụ ẩn (server-side validation, business logic phức tạp) cần được xác nhận thêm với đội phát triển hoặc Product Owner.
