# Tài liệu Yêu cầu — Module Projects

> **Hệ thống:** Perfex CRM  
> **URL Module:** `https://crm.anhtester.com/admin/projects`  
> **Ngày tạo:** 03/04/2026  
> **Phiên bản:** 1.0  
> **Người tạo:** AI Agent (Antigravity)  
> **Phương pháp:** Khảo sát UI/DOM trực tiếp trên browser (1920×1080)

---

## 1. Tổng quan (Overview)

Module **Projects** là một thành phần quản lý dự án trong hệ thống Perfex CRM, cho phép người dùng Admin:

- Xem danh sách tất cả dự án với tổng quan trạng thái.
- Tạo mới, chỉnh sửa và xóa dự án.
- Gán khách hàng (Customer) và thành viên (Members) vào dự án.
- Thiết lập loại hình thanh toán (Billing Type), tiến độ, và thời hạn.
- Quản lý cài đặt dự án: thông báo, tab hiển thị, quyền hạn khách hàng.
- Theo dõi tiến độ qua biểu đồ Gantt.
- Lọc, tìm kiếm và xuất dữ liệu dự án.

Module này liên kết chặt chẽ với các module khác: **Customers**, **Tasks**, **Contracts**, **Invoices**, **Tickets**, **Timesheets**, **Milestones**, **Discussions**, v.v.

---

## 2. Yêu cầu Chức năng (Functional Requirements)

### FR-01: Xem danh sách Dự án (View Projects List)

**Mô tả:** Là một quản trị viên, tôi muốn xem danh sách toàn bộ dự án dưới dạng bảng để có cái nhìn tổng quan về tất cả các dự án đang quản lý.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Trang hiển thị bảng dữ liệu với các cột: `#` (ID), `Project Name`, `Customer`, `Tags`, `Start Date`, `Deadline`, `Members`, `Status`.
- Phần **Projects Summary** hiển thị tổng số dự án theo từng trạng thái: `Not Started`, `In Progress`, `On Hold`, `Cancelled`, `Finished`.
- Có thể click vào từng nhãn trạng thái trong Summary để lọc nhanh danh sách.
- Bảng hỗ trợ phân trang, có dropdown chọn số bản ghi hiển thị (mặc định: 25).
- Các cột có thể sắp xếp (sort) bằng cách click vào tiêu đề cột.
- Hiển thị "No entries found" khi không có dữ liệu.

---

### FR-02: Tạo mới Dự án (Create New Project)

**Mô tả:** Là một quản trị viên, tôi muốn tạo một dự án mới với đầy đủ thông tin cơ bản và cài đặt quyền hạn để bắt đầu quản lý dự án cho khách hàng.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Nhấn nút **"+ New Project"** trên trang danh sách → Chuyển đến trang "Add new project" (`/admin/projects/project`).
- Form chia thành 2 tab: **"Project"** (thông tin cơ bản) và **"Project Settings"** (cài đặt & quyền).
- Các trường bắt buộc: `Project Name`, `Customer`, `Billing Type`, `Start Date`.
- Sau khi điền đủ thông tin và nhấn **"Save"** → Dự án được tạo thành công.
- Có tùy chọn **"Send project created email"** (checkbox) để gửi email thông báo cho khách hàng.
- Hệ thống validate client-side: hiển thị lỗi ngay dưới trường khi nhấn Save mà thiếu dữ liệu bắt buộc.

---

### FR-03: Chỉnh sửa Dự án (Edit Project)

**Mô tả:** Là một quản trị viên, tôi muốn chỉnh sửa thông tin của một dự án đã tồn tại để cập nhật thay đổi.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Click vào tên dự án trong danh sách → Mở trang chi tiết dự án.
- Chỉnh sửa các trường thông tin tương tự form tạo mới.
- Nhấn **"Save"** → Cập nhật thành công.

---

### FR-04: Xóa Dự án (Delete Project)

**Mô tả:** Là một quản trị viên, tôi muốn xóa một dự án không còn cần thiết.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Thao tác xóa nằm trong trang chi tiết dự án hoặc qua menu hành động.
- Hệ thống hiển thị hộp thoại xác nhận trước khi xóa.
- Xóa thành công → Dự án bị loại khỏi danh sách.

---

### FR-05: Lọc và Tìm kiếm Dự án (Filter & Search Projects)

**Mô tả:** Là một quản trị viên, tôi muốn lọc và tìm kiếm dự án để nhanh chóng tìm được dự án cần thiết.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- **Tìm kiếm:** Ô tìm kiếm toàn cục (Search) ở góc phải bảng dữ liệu, tìm kiếm theo keyword.
- **Lọc nhanh:** Click vào nhãn trạng thái trong Projects Summary (Not Started, In Progress, On Hold, Cancelled, Finished).
- **Lọc nâng cao (Filter):** Nút filter (biểu tượng phễu) ở góc phải trên → Hiển thị popup "New Filter" cho phép tạo và lưu bộ lọc tùy chỉnh (Saved Filters).

---

### FR-06: Xuất dữ liệu Dự án (Export Projects)

**Mô tả:** Là một quản trị viên, tôi muốn xuất danh sách dự án ra file để báo cáo hoặc lưu trữ.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Nút **"Export"** trên toolbar → Dropdown hiển thị 3 tùy chọn:
  - **CSV** — Xuất ra file CSV
  - **PDF** — Xuất ra file PDF
  - **Print** — Mở cửa sổ in trực tiếp

---

### FR-07: Xem biểu đồ Gantt (Gantt View)

**Mô tả:** Là một quản trị viên, tôi muốn xem biểu đồ Gantt của tất cả dự án để theo dõi tiến độ trực quan theo dòng thời gian.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Nhấn nút biểu tượng Gantt (cạnh nút "New Project") → Chuyển sang trang Gantt View.
- Trang Gantt có bộ lọc:
  - **Status:** Dropdown multi-select (mặc định: Not Started, In Progress, On Hold).
  - **Project Member:** Dropdown chọn thành viên.
  - Nút **"Apply"** để áp dụng bộ lọc.
- Hiển thị "No Tasks Found" khi không có dữ liệu phù hợp.

---

### FR-08: Quản lý Cài đặt & Quyền hạn Dự án (Manage Project Settings & Permissions)

**Mô tả:** Là một quản trị viên, tôi muốn cấu hình các cài đặt hiển thị và quyền hạn cho khách hàng đối với từng dự án.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- Tab **"Project Settings"** trong form tạo/sửa dự án cho phép cấu hình:
  - Gửi thông báo cho contacts (Send contacts notifications).
  - Chọn các tab hiển thị (Visible Tabs) cho khách hàng.
  - Bật/tắt từng quyền hạn cụ thể cho khách hàng (18 checkbox).
- Xem chi tiết tại mục [3.2 - Tab Project Settings](#32-tab-project-settings-cài-đặt--quyền).

---

## 3. Đặc tả Trường Dữ liệu (Field Specifications)

### 3.1. Tab "Project" (Thông tin cơ bản)

| # | Tên trường (Label) | Loại UI | Bắt buộc | Giá trị mặc định | Validation / Ràng buộc | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | Project Name | TextBox (input text) | ✅ Có | — | Không được để trống. Lỗi: *"This field is required."* | — |
| 2 | Customer | Dropdown tìm kiếm (AJAX select) | ✅ Có | — | Phải chọn 1 khách hàng. Lỗi: *"Select and begin typing"* (highlight đỏ). Placeholder: "Select and begin typing" | Tìm kiếm theo tên KH |
| 3 | Calculate progress through tasks | Checkbox | Không | ✅ Checked | Khi **checked**: tiến độ tự tính từ tasks. Khi **unchecked**: hiện thanh trượt để nhập thủ công | Ảnh hưởng đến hiển thị Progress |
| 4 | Progress | Progress bar / Slider | Không | 0% | Khi checkbox ở #3 được tích → hiển thị progress bar (read-only). Khi bỏ tích → hiển thị slider (0–100%) cho phép kéo thủ công | Hiển thị giá trị: "Progress X%" |
| 5 | Billing Type | Dropdown (select) | ✅ Có | Nothing selected | Phải chọn 1 giá trị. Lỗi: *"This field is required."*. Các options: **Fixed Rate**, **Project Hours**, **Task Hours** *(Based on task hourly rate)* | — |
| 6 | Status | Dropdown (select) | Không | In Progress | 5 options: **Not Started**, **In Progress**, **On Hold**, **Cancelled**, **Finished** | Luôn mặc định "In Progress" khi tạo mới |
| 7 | Estimated Hours | TextBox (input number) | Không | — | Nhập số giờ ước tính cho dự án | — |
| 8 | Members | Multi-select Dropdown (tìm kiếm) | Không | User hiện tại (VD: "Admin Example") | Cho phép chọn nhiều thành viên. Tự động gán user đang đăng nhập | — |
| 9 | Start Date | Date Picker (input date) | ✅ Có | Ngày hiện tại (DD-MM-YYYY) | Định dạng: `DD-MM-YYYY`. Có nút calendar popup | Mặc định lấy ngày hệ thống |
| 10 | Deadline | Date Picker (input date) | Không | — | Định dạng: `DD-MM-YYYY`. Có nút calendar popup | — |
| 11 | Tags | Tag Input | Không | — | Cho phép nhập nhiều tag, mỗi tag là 1 label riêng. Placeholder: "Tag" | — |
| 12 | Description | Rich Text Editor (TinyMCE) | Không | — | Hỗ trợ formatting: Bold, Italic, căn lề, bảng, chèn link/ảnh. Thanh toolbar: File, Edit, View, Insert, Format, Tools, Table | — |
| 13 | Send project created email | Checkbox | Không | ☐ Unchecked | Nằm cuối form. Khi tích → gửi email thông báo tạo dự án cho KH | — |

---

### 3.2. Tab "Project Settings" (Cài đặt & Quyền)

#### 3.2.1. Thông báo (Notifications)

| # | Tên trường (Label) | Loại UI | Bắt buộc | Giá trị mặc định | Ghi chú |
|---|---|---|---|---|---|
| 1 | Send contacts notifications | Dropdown (select) | ✅ Có (`*`) | "To all contacts with notifications for projects enabled" | Cấu hình đối tượng nhận thông báo dự án |

#### 3.2.2. Tab hiển thị (Visible Tabs)

| # | Tên trường (Label) | Loại UI | Giá trị mặc định | Ghi chú |
|---|---|---|---|---|
| 1 | Visible Tabs | Multi-select Dropdown | Tất cả tabs được chọn | Cho phép chọn các tab sẽ hiển thị cho khách hàng trong chi tiết dự án |

**Danh sách các tab có thể chọn (16 tabs):**

| # | Tên Tab | Mô tả |
|---|---|---|
| 1 | Tasks | Quản lý task/công việc |
| 2 | Timesheets | Bảng chấm công |
| 3 | Milestones | Các mốc quan trọng |
| 4 | Files | Quản lý file/tài liệu |
| 5 | Discussions | Thảo luận |
| 6 | Gantt | Biểu đồ Gantt |
| 7 | Tickets | Ticket hỗ trợ |
| 8 | Contracts | Hợp đồng |
| 9 | Proposals | Đề xuất |
| 10 | Estimates | Báo giá |
| 11 | Invoices | Hóa đơn |
| 12 | Subscriptions | Gói đăng ký |
| 13 | Expenses | Chi phí |
| 14 | Credit Notes | Phiếu giảm giá |
| 15 | Notes | Ghi chú |
| 16 | Activity | Nhật ký hoạt động |

#### 3.2.3. Quyền hạn Khách hàng (Customer Permissions)

Tất cả đều là **Checkbox**, mặc định **Checked** (trừ mục cuối).

| # | Tên quyền (Label) | Mặc định | Mô tả |
|---|---|---|---|
| 1 | Allow customer to view tasks | ✅ Checked | KH có thể xem danh sách tasks |
| 2 | Allow customer to create tasks | ✅ Checked | KH có thể tạo task mới |
| 3 | Allow customer to edit tasks (only tasks created from contact) | ✅ Checked | KH chỉ sửa được task do chính mình tạo |
| 4 | Allow customer to comment on project tasks | ✅ Checked | KH có thể bình luận vào tasks |
| 5 | Allow customer to view task comments | ✅ Checked | KH có thể xem bình luận của tasks |
| 6 | Allow customer to view task attachments | ✅ Checked | KH có thể xem file đính kèm của task |
| 7 | Allow customer to view task checklist items | ✅ Checked | KH có thể xem checklist của task |
| 8 | Allow customer to upload attachments on tasks | ✅ Checked | KH có thể upload file vào task |
| 9 | Allow customer to view task total logged time | ✅ Checked | KH có thể xem tổng thời gian đã log |
| 10 | Allow customer to view finance overview | ✅ Checked | KH có thể xem tổng quan tài chính |
| 11 | Allow customer to upload files | ✅ Checked | KH có thể upload file lên dự án |
| 12 | Allow customer to open discussions | ✅ Checked | KH có thể mở thảo luận mới |
| 13 | Allow customer to view milestones | ✅ Checked | KH có thể xem các mốc quan trọng |
| 14 | Allow customer to view Gantt | ✅ Checked | KH có thể xem biểu đồ Gantt |
| 15 | Allow customer to view timesheets | ✅ Checked | KH có thể xem bảng chấm công |
| 16 | Allow customer to view activity log | ✅ Checked | KH có thể xem nhật ký hoạt động |
| 17 | Allow customer to view team members | ✅ Checked | KH có thể xem danh sách thành viên |
| 18 | Hide project tasks on main tasks table (admin area) | ☐ Unchecked | Ẩn task của dự án này khỏi bảng Tasks chính |

---

## 4. Quy tắc Validation và Thông báo lỗi (Business Rules & Validations)

### 4.1. Validation khi Tạo mới / Chỉnh sửa Dự án

| # | Trường | Điều kiện lỗi | Thông báo lỗi (Validation Message) | Loại Validation |
|---|---|---|---|---|
| 1 | Project Name | Để trống | *"This field is required."* | Client-side |
| 2 | Customer | Chưa chọn khách hàng | *"Select and begin typing"* (highlight đỏ) | Client-side |
| 3 | Billing Type | Chưa chọn loại | *"This field is required."* | Client-side |
| 4 | Start Date | Để trống (nếu xóa giá trị mặc định) | *"This field is required."* | Client-side |

### 4.2. Quy tắc liên quan đến Tiến độ (Progress)

| # | Điều kiện | Hành vi |
|---|---|---|
| 1 | Checkbox "Calculate progress through tasks" = **Checked** | Progress bar hiển thị giá trị read-only, tự tính từ hoàn thành các tasks con |
| 2 | Checkbox "Calculate progress through tasks" = **Unchecked** | Hiển thị thanh trượt (Slider) cho phép kéo chỉnh từ 0% đến 100% |

### 4.3. Quy tắc liên quan đến Billing Type

| # | Loại (Billing Type) | Mô tả |
|---|---|---|
| 1 | Fixed Rate | Dự án tính theo giá cố định |
| 2 | Project Hours | Dự án tính theo tổng số giờ của dự án |
| 3 | Task Hours | Dự án tính theo số giờ của từng task (dựa trên đơn giá giờ của task) |

---

## 5. Các Luồng xử lý (User Flows)

### Flow 01: Tạo mới Dự án thành công (Happy Path)

```
1. Truy cập /admin/projects
2. Click "+ New Project"
3. Hệ thống chuyển đến trang "Add new project"
4. Tab "Project" mặc định được chọn
5. Nhập "Project Name" (bắt buộc)
6. Chọn "Customer" từ dropdown tìm kiếm (bắt buộc)
7. Chọn "Billing Type" (bắt buộc)
8. Chọn "Status" (mặc định: In Progress)
9. Nhập "Estimated Hours" (tùy chọn)
10. Chọn/thêm "Members" (mặc định: user hiện tại)
11. "Start Date" tự điền ngày hiện tại (bắt buộc)
12. Chọn "Deadline" (tùy chọn)
13. Thêm "Tags" (tùy chọn)
14. Nhập "Description" qua TinyMCE (tùy chọn)
15. (Tùy chọn) Click tab "Project Settings" để cấu hình thêm
16. Click "Save"
17. → Dự án được tạo thành công, chuyển đến trang chi tiết dự án
```

### Flow 02: Tạo Dự án thất bại (Validation Error)

```
1. Truy cập /admin/projects/project
2. Không nhập bất kỳ dữ liệu nào
3. Click "Save"
4. → Hệ thống hiển thị validation errors:
   - Project Name: "This field is required."
   - Customer: "Select and begin typing" (đỏ)
   - Billing Type: "This field is required."
5. Người dùng cần sửa lỗi và nhấn Save lại
```

### Flow 03: Lọc Dự án theo Trạng thái

```
1. Truy cập /admin/projects
2. Nhìn phần "Projects Summary"
3. Click vào nhãn trạng thái (vd: "In Progress")
4. → Bảng lọc chỉ hiển thị các dự án có trạng thái tương ứng
```

### Flow 04: Chuyển sang Gantt View

```
1. Truy cập /admin/projects  
2. Click biểu tượng Gantt (cạnh nút "New Project")
3. → Chuyển sang trang Gantt View với bộ lọc:
   - Status: Not Started, In Progress, On Hold (mặc định)
   - Project Member: Dropdown chọn thành viên
4. Click "Apply" để áp dụng bộ lọc
5. Biểu đồ timeline hiển thị tiến độ các dự án
```

### Flow 05: Xuất dữ liệu Dự án

```
1. Truy cập /admin/projects
2. Click nút "Export"
3. → Dropdown hiện 3 tùy chọn: CSV, PDF, Print
4. Chọn định dạng mong muốn
5. → File được tải xuống hoặc cửa sổ in mở ra
```

### Flow 06: Cấu hình Quyền hạn Khách hàng

```
1. Trong form tạo/sửa dự án, click tab "Project Settings"
2. Cấu hình "Send contacts notifications"
3. Chọn/bỏ chọn các "Visible Tabs" cho khách hàng
4. Bật/tắt từng quyền hạn khách hàng (18 checkbox)
5. Click "Save" để lưu cấu hình
```

---

## 6. Giao diện Trang danh sách (Projects List UI)

### 6.1. Thanh công cụ (Toolbar)

| # | Thành phần | Loại UI | Mô tả |
|---|---|---|---|
| 1 | + New Project | Button (xanh lá) | Tạo dự án mới |
| 2 | Gantt View | Icon Button | Chuyển sang chế độ xem Gantt |
| 3 | Filter | Icon Button (phễu) | Mở popup quản lý bộ lọc (New Filter / Saved Filters) |
| 4 | Table Length | Dropdown (select) | Chọn số bản ghi/trang: 25, 50, 100... (mặc định: 25) |
| 5 | Export | Button | Dropdown: CSV, PDF, Print |
| 6 | Reload | Icon Button | Làm mới dữ liệu bảng |
| 7 | Search | TextBox | Tìm kiếm toàn cục trên bảng |

### 6.2. Projects Summary

| # | Trạng thái | Màu sắc | Có thể click để lọc |
|---|---|---|---|
| 1 | Not Started | Đen (default) | ✅ |
| 2 | In Progress | Xanh dương (blue) | ✅ |
| 3 | On Hold | Cam (orange) | ✅ |
| 4 | Cancelled | Xám (grey) | ✅ |
| 5 | Finished | Xanh lá (green) | ✅ |

### 6.3. Bảng dữ liệu (Data Table)

| # | Tên cột | Có thể sắp xếp (Sort) | Mô tả |
|---|---|---|---|
| 1 | # | ✅ | ID dự án (số tự tăng) |
| 2 | Project Name | ✅ | Tên dự án, click vào → mở chi tiết |
| 3 | Customer | ✅ | Tên khách hàng liên kết |
| 4 | Tags | — | Các tag phân loại |
| 5 | Start Date | ✅ | Ngày bắt đầu dự án |
| 6 | Deadline | ✅ | Hạn chót dự án |
| 7 | Members | — | Avatar/tên thành viên tham gia |
| 8 | Status | ✅ | Trạng thái hiện tại (badge màu) |

---

## 7. Yêu cầu Phi chức năng (Non-functional Requirements)

| # | Yêu cầu | Mô tả |
|---|---|---|
| NFR-01 | Responsive Layout | Giao diện sidebar + main content tương thích desktop. Sidebar thu gọn được |
| NFR-02 | Hiệu năng tải trang | Danh sách dự án hỗ trợ phân trang (pagination) để xử lý lượng dữ liệu lớn |
| NFR-03 | Client-side Validation | Form validate ngay khi nhấn Save, không cần submit lên server |
| NFR-04 | AJAX Search | Dropdown Customer sử dụng AJAX để tìm kiếm, không load toàn bộ danh sách |
| NFR-05 | Rich Text Editor | Trường Description sử dụng TinyMCE với đầy đủ toolbar |
| NFR-06 | Export Performance | Hỗ trợ xuất toàn bộ dữ liệu bảng ra CSV/PDF/Print |
| NFR-07 | Multiple Tabs | Form tạo/sửa chia thành 2 tab rõ ràng, không mất dữ liệu khi chuyển tab |

---

## 8. Câu hỏi cần Làm rõ với PO/User

| # | Câu hỏi | Ghi chú |
|---|---|---|
| 1 | Có giới hạn ký tự cho trường **Project Name** không? (maxlength) | Không quan sát thấy `maxlength` trên DOM |
| 2 | Trường **Estimated Hours** có validation số dương không? Có giới hạn giá trị tối đa? | — |
| 3 | Khi chọn **Billing Type** = "Fixed Rate", có trường nhập **Rate Amount** xuất hiện thêm không? | Cần kiểm tra thêm sau khi chọn từng option |
| 4 | **Deadline** có validate phải lớn hơn **Start Date** không? | Chưa xác minh được trên giao diện |
| 5 | Khi **xóa dự án**, các dữ liệu liên quan (Tasks, Files, Timesheets, Invoices...) có bị cascade delete không? | Cần xác nhận business rule |
| 6 | Quyền tạo/sửa/xóa dự án có phân biệt theo **vai trò** (Staff role/permissions) không? | Hiện chỉ khảo sát từ tài khoản Admin |
| 7 | **Saved Filters** — Cấu trúc bộ lọc hỗ trợ những trường nào? (Status, Customer, Members, Tags, Date range...) | Cần tạo một filter thực tế để xác minh |
| 8 | Trang **chi tiết dự án** (Project Detail) có những tab/tính năng gì cụ thể? | Cần khảo sát thêm nếu nằm trong scope |

---

## Phụ lục: URL Tham chiếu

| Trang | URL |
|---|---|
| Danh sách Dự án | `https://crm.anhtester.com/admin/projects` |
| Tạo mới Dự án | `https://crm.anhtester.com/admin/projects/project` |
| Gantt View | `https://crm.anhtester.com/admin/projects/gantt` |
