# Tài liệu Yêu cầu (Requirements) — Module Tasks

> **Hệ thống:** Perfex CRM | Anh Tester Demo  
> **URL:** https://crm.anhtester.com/admin/tasks  
> **Phiên bản khảo sát:** 17-04-2026  
> **Người tạo:** AI Antigravity (tự động sinh từ khảo sát UI)

---

## 1. Tổng quan (Overview)

Module **Tasks** là chức năng quản lý công việc (task management) trong hệ thống Perfex CRM, cho phép người dùng nội bộ (staff) tạo, theo dõi, gán và quản lý tiến độ các tác vụ công việc. Module hỗ trợ hai chế độ hiển thị: **List View** (dạng bảng) và **Kanban View** (dạng cột trạng thái), cùng với trang **Tasks Overview** để xem tổng quan chi tiết.

### 1.1. Các thành phần chính của giao diện

| Thành phần | Mô tả |
|---|---|
| **Tasks Summary** | Bảng tổng hợp số lượng task theo 5 trạng thái, hiển thị ở đầu trang List View |
| **List View** | Bảng danh sách task với các cột: #, Name, Status, Start Date, Due Date, Assigned to, Tags, Priority |
| **Kanban View** | Hiển thị task dạng thẻ (card) phân theo 5 cột trạng thái |
| **Tasks Overview** | Trang báo cáo chi tiết với bộ lọc theo Staff, Tháng, Status, Năm |
| **Add New Task (Modal)** | Form tạo task mới dạng popup modal |
| **Task Detail (Modal)** | Popup hiển thị chi tiết task với các section: Description, Checklist, Comments, Task Info, Reminders, Assignees, Followers, File Upload |

---

## 2. Yêu cầu Chức năng (Functional Requirements)

### FR-01: Xem danh sách Tasks (List View)

**Mô tả:** Là một nhân viên, tôi muốn xem danh sách tất cả các task được gán cho tôi hoặc tất cả task trong hệ thống, để có thể theo dõi tiến độ công việc.

**Tiêu chí chấp nhận (Acceptance Criteria):**
- AC-01.1: Hiển thị bảng danh sách task với các cột: **#** (ID), **Name**, **Status**, **Start Date**, **Due Date**, **Assigned to**, **Tags**, **Priority**.
- AC-01.2: Hỗ trợ **sắp xếp** (sort) theo từng cột bằng cách click vào tiêu đề cột (ascending/descending).
- AC-01.3: Hỗ trợ **tìm kiếm** (search) task qua ô tìm kiếm trong bảng.
- AC-01.4: Hỗ trợ **phân trang** với các tùy chọn hiển thị: 10, 25, 50, 100, All bản ghi/trang. Mặc định: 25.
- AC-01.5: Hiển thị thông tin tổng số bản ghi (VD: "Showing 1 to 4 of 4 entries").
- AC-01.6: Mỗi dòng task có checkbox để chọn cho Bulk Actions.
- AC-01.7: Khi hover vào dòng task, hiển thị các hành động nhanh: **Start Timer**, **Edit**, **Delete**.
- AC-01.8: Task có liên kết đến Project hiển thị mã Project (VD: "#2351 - GAI - Công ty YHL 20260314").
- AC-01.9: Task lặp lại hiển thị badge **"Recurring Task"**.

### FR-02: Xem bảng tổng hợp Tasks Summary

**Mô tả:** Là một nhân viên, tôi muốn xem tổng quan nhanh số lượng task theo từng trạng thái, để nắm bắt tình hình công việc.

**Tiêu chí chấp nhận:**
- AC-02.1: Hiển thị 5 ô thống kê tương ứng 5 trạng thái: **Not Started**, **In Progress**, **Testing**, **Awaiting Feedback**, **Complete**.
- AC-02.2: Mỗi ô hiển thị tổng số task và số task được gán cho người dùng hiện tại ("Tasks assigned to me: X").
- AC-02.3: Tên trạng thái có màu phân biệt (VD: In Progress = xanh dương, Complete = xanh lá...).

### FR-03: Tạo Task mới (Add New Task)

**Mô tả:** Là một nhân viên, tôi muốn tạo task mới với đầy đủ thông tin, để phân công và theo dõi công việc.

**Tiêu chí chấp nhận:**
- AC-03.1: Click nút **"+ New Task"** mở modal "Add new task".
- AC-03.2: Form bao gồm các trường chi tiết (xem mục 3 - Đặc tả Trường Dữ liệu).
- AC-03.3: Trường bắt buộc: **Subject** và **Start Date** (đánh dấu `*`).
- AC-03.4: Trường **Start Date** tự động điền ngày hiện tại.
- AC-03.5: Trường **Priority** mặc định là "Medium".
- AC-03.6: Trường **Assignees** mặc định chọn người dùng đang đăng nhập.
- AC-03.7: Checkbox **Billable** mặc định được tích chọn.
- AC-03.8: Click nút **"Save"** để lưu task, **"Close"** để đóng modal không lưu.
- AC-03.9: Hỗ trợ **đính kèm file** qua link "Attach Files".

### FR-04: Xem chi tiết Task (Task Detail)

**Mô tả:** Là một nhân viên, tôi muốn xem toàn bộ chi tiết của một task, để nắm rõ nội dung và tiến độ.

**Tiêu chí chấp nhận:**
- AC-04.1: Click vào **ID** hoặc **Name** của task trong danh sách mở modal chi tiết.
- AC-04.2: **Header** hiển thị: Tên task, badge Recurring Task (nếu có), badge Status.
- AC-04.3: Hiển thị thông tin **Related** (liên kết đến Project/Customer/...).
- AC-04.4: Có các nút hành động: nút đánh dấu hoàn thành (✓), nút xem dạng bảng, nút **Start Timer**.
- AC-04.5: **Panel trái** gồm: Description (có nút chỉnh sửa), Checklist Items, Comments.
- AC-04.6: **Panel phải (Task Info)** gồm: Created at, Status, Start Date (editable), Due Date (editable), Priority, Hourly Rate, Billable, Your logged time, Total logged time, Tags.
- AC-04.7: **Reminders**: Hiển thị danh sách reminder và link "Create Reminder".
- AC-04.8: **Assignees**: Hiển thị danh sách người được gán + dropdown "Assign task to" để thêm.
- AC-04.9: **Followers**: Hiển thị danh sách người theo dõi + dropdown "Add Followers" để thêm.
- AC-04.10: **File Upload**: Hỗ trợ kéo thả file ("Drop files here to upload") và "Choose from Google Drive".

### FR-05: Chỉnh sửa Task (Edit Task)

**Mô tả:** Là một nhân viên, tôi muốn chỉnh sửa thông tin task đã tạo, để cập nhật nội dung khi có thay đổi.

**Tiêu chí chấp nhận:**
- AC-05.1: Click **"Edit"** trên dòng task (hiện khi hover) mở modal chỉnh sửa.
- AC-05.2: Modal chỉnh sửa hiển thị giống form tạo mới nhưng đã điền sẵn dữ liệu hiện tại.
- AC-05.3: Cho phép chỉnh sửa tất cả các trường.
- AC-05.4: Start Date và Due Date có thể chỉnh sửa trực tiếp từ Task Detail panel.
- AC-05.5: Click **"Save"** để lưu thay đổi, **"Close"** để hủy.

### FR-06: Xóa Task (Delete Task)

**Mô tả:** Là một nhân viên có quyền, tôi muốn xóa task không cần thiết, để giữ danh sách gọn gàng.

**Tiêu chí chấp nhận:**
- AC-06.1: Click **"Delete"** trên dòng task (hiện khi hover).
- AC-06.2: Hiển thị **xác nhận trước khi xóa** (confirmation dialog).
- AC-06.3: Xóa thành công → task biến mất khỏi danh sách, cập nhật Tasks Summary.
- AC-06.4: URL xóa: `/admin/tasks/delete_task/{task_id}`.

### FR-07: Thay đổi trạng thái Task (Change Status)

**Mô tả:** Là một nhân viên, tôi muốn nhanh chóng thay đổi trạng thái task, để cập nhật tiến độ.

**Tiêu chí chấp nhận:**
- AC-07.1: Trong danh sách, click vào **dropdown icon** bên cạnh tên trạng thái để thay đổi.
- AC-07.2: Các trạng thái có sẵn: **Not Started**, **In Progress**, **Testing**, **Awaiting Feedback**, **Complete**.
- AC-07.3: Thay đổi trạng thái cập nhật ngay trên giao diện (không cần reload).
- AC-07.4: Cập nhật đồng thời số liệu trong Tasks Summary.

### FR-08: Chế độ Kanban View

**Mô tả:** Là một nhân viên, tôi muốn xem task dạng Kanban board, để trực quan hóa tiến độ.

**Tiêu chí chấp nhận:**
- AC-08.1: Click **biểu tượng Kanban** (bên phải nút "+ New Task") chuyển sang Kanban view.
- AC-08.2: Hiển thị **5 cột** tương ứng 5 trạng thái: Not Started (xám), In Progress (xanh dương), Testing (xanh ngọc), Awaiting Feedback (cam), Complete (xanh lá).
- AC-08.3: Mỗi cột hiển thị tiêu đề và số lượng task (VD: "In Progress - 4 Tasks").
- AC-08.4: Mỗi task card hiển thị: tên task, avatar người gán, số comments, số attachments, due date (nếu có).
- AC-08.5: Task quá hạn hiển thị nền **hồng/cam nhạt** (highlight).
- AC-08.6: Có nút **"Load More"** ở cuối mỗi cột.
- AC-08.7: Cột trống hiển thị "No Tasks Found".
- AC-08.8: Hỗ trợ ô **Search Tasks** ở góc phải.
- AC-08.9: Click biểu tượng **List** để quay lại chế độ bảng.

### FR-09: Thao tác hàng loạt (Bulk Actions)

**Mô tả:** Là một nhân viên, tôi muốn thực hiện thay đổi hàng loạt trên nhiều task cùng lúc, để tiết kiệm thời gian.

**Tiêu chí chấp nhận:**
- AC-09.1: Chọn nhiều task bằng checkbox (hoặc checkbox header để chọn tất cả).
- AC-09.2: Click **"Bulk Actions"** mở modal với các tùy chọn:
  - **Mass Delete**: Checkbox để xóa hàng loạt.
  - **Status**: Dropdown thay đổi trạng thái (Not Started, In Progress, Testing, Awaiting Feedback, Complete).
  - **Priority**: Dropdown thay đổi ưu tiên (Low, Medium, High, Urgent).
  - **Assigned to**: Dropdown gán nhân viên (multi-select).
  - **Billable**: Dropdown (Yes/No).
  - **Tags**: Textbox thêm tags.
- AC-09.3: Click **"Confirm"** để áp dụng, **"Close"** để hủy.

### FR-10: Xuất dữ liệu và Các chức năng phụ trợ

**Mô tả:** Là một nhân viên, tôi muốn xuất danh sách task và sử dụng các công cụ hỗ trợ, để báo cáo và quản lý hiệu quả.

**Tiêu chí chấp nhận:**
- AC-10.1: **Export**: Nút "Export" xuất danh sách task (dự kiến CSV/Excel).
- AC-10.2: **Start Timer**: Mỗi task có chức năng bấm giờ làm việc, hiển thị "Your logged time" và "Total logged time" trong Task Detail.
- AC-10.3: **Thay đổi Priority nhanh**: Click dropdown icon bên cạnh Priority trong danh sách (Low, Medium, High, Urgent).
- AC-10.4: **Tasks Overview**: Trang `/admin/tasks/detailed_overview` hiển thị bảng tổng quan với:
  - Bộ lọc: All Staff Members, Month, Status (All), Year.
  - Nút **"Filter"** để áp dụng bộ lọc.
  - Bảng cột: Name, Start Date, Due Date, Status, Total attachments added, Total comments, Checklist Items, Total Logged Time, Finished on time?, Assigned to.
- AC-10.5: **Saved Filters**: Hỗ trợ tạo và lưu bộ lọc tùy chỉnh (New Filter).
- AC-10.6: **Nút Reset** (biểu tượng refresh) để đặt lại bảng về trạng thái mặc định.

---

## 3. Đặc tả Trường Dữ liệu (Field Specifications)

### 3.1. Form Tạo/Chỉnh sửa Task (Add/Edit Task Modal)

| # | Tên Trường (Label) | Loại UI | Bắt buộc | Giá trị Mặc định | Validation / Ràng buộc | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | **Public** | Checkbox | Không | Không tích | — | Nếu tích = hiển thị cho tất cả staff. Không tích = chỉ assignees, followers, creator, admin mới thấy |
| 2 | **Billable** | Checkbox | Không | Có tích (✓) | — | Đánh dấu task có tính phí hay không |
| 3 | **Attach Files** | Link/File Upload | Không | — | — | Mở file chooser để đính kèm tập tin |
| 4 | **Subject** | Textbox | **Có (*)** | Trống | Không được để trống | Tên/tiêu đề của task |
| 5 | **Hourly Rate** | Textbox (number) | Không | 0 | Chỉ nhập số, >= 0 | Đơn giá theo giờ |
| 6 | **Start Date** | Date Picker | **Có (*)** | Ngày hiện tại (dd-MM-yyyy) | Định dạng: dd-MM-yyyy | Ngày bắt đầu task |
| 7 | **Due Date** | Date Picker | Không | Trống | Định dạng: dd-MM-yyyy. Nên >= Start Date | Ngày đến hạn |
| 8 | **Priority** | Dropdown (Select) | Không | Medium | Giá trị: Low, Medium, High, Urgent | Mức ưu tiên |
| 9 | **Repeat every** | Dropdown (Select) | Không | Nothing selected | Giá trị: (trống), Week, 2 Weeks, 1 Month, 2 Months, 3 Months, 6 Months, 1 Year, Custom | Tần suất lặp lại task |
| 10 | **Related To** | Dropdown (Select) | Không | Nothing selected | Giá trị: (trống), Project, Invoice, Customer, Estimate, Contract, Ticket, Expense, Lead, Proposal | Liên kết task đến đối tượng khác. Khi chọn sẽ hiện dropdown phụ để chọn đối tượng cụ thể |
| 11 | **Assignees** | Dropdown Multi-select | Không | Người dùng đang đăng nhập | Danh sách staff: Project Manager, Admin Anh Tester, Admin Example | Người được gán task |
| 12 | **Followers** | Dropdown Multi-select | Không | Nothing selected | Danh sách staff: Project Manager, Admin Anh Tester, Admin Example | Người theo dõi task |
| 13 | **Tags** | Tag Input (Textbox) | Không | Trống | Nhập tự do, phân tách bằng Enter/phím cách | Gắn thẻ cho task |
| 14 | **Task Description** | Textarea | Không | Trống (placeholder: "Add Description") | — | Mô tả chi tiết task |

### 3.2. Task Detail Panel — Task Info (Chỉ đọc / Inline Edit)

| # | Tên Trường | Loại | Chỉnh sửa | Ghi chú |
|---|---|---|---|---|
| 1 | Created at | Text (readonly) | Không | Hiển thị ngày giờ tạo (dd-MM-yyyy HH:mm:ss) |
| 2 | Status | Badge + Dropdown | Có (click badge) | Thay đổi trạng thái trực tiếp |
| 3 | Start Date | Date Picker (inline) | Có | Click để chỉnh sửa |
| 4 | Due Date | Date Picker (inline) | Có | Click để chỉnh sửa |
| 5 | Priority | Text + Dropdown | Có (click text) | Thay đổi priority trực tiếp |
| 6 | Hourly Rate | Text (readonly) | Không | Hiển thị giá trị tiền (VD: 200.00) |
| 7 | Billable | Text (readonly) | Không | Hiển thị "Billable" hoặc "Not Billable" |
| 8 | Your logged time | Text (readonly) | Không | Thời gian đã log của user hiện tại (HH:mm) |
| 9 | Total logged time | Text (readonly) | Không | Tổng thời gian log của tất cả (HH:mm) |

---

## 4. Các luồng xử lý và Quy tắc Nghiệp vụ (Business Rules & Validations)

### 4.1. Validation khi tạo/chỉnh sửa Task

| # | Điều kiện | Validation Message (dự kiến) |
|---|---|---|
| 1 | Bỏ trống trường **Subject** | "The field is required" hoặc tương đương |
| 2 | Bỏ trống trường **Start Date** | "The field is required" hoặc tương đương |
| 3 | **Due Date** < **Start Date** | *(Cần xác minh — có thể hệ thống cho phép hoặc cảnh báo)* |
| 4 | **Hourly Rate** nhập ký tự không phải số | Trường chỉ chấp nhận số (input type validation) |

### 4.2. Luồng tạo Task mới (Happy Path)

```
1. User click "+ New Task"
2. Modal "Add new task" xuất hiện
3. User điền Subject (bắt buộc)
4. Start Date tự động điền ngày hiện tại
5. User chọn Priority, Assignees, và các trường tùy chọn khác
6. User click "Save"
7. Task mới xuất hiện trong danh sách với trạng thái mặc định
8. Tasks Summary cập nhật số liệu
```

### 4.3. Luồng thay đổi trạng thái Task

```
1. Từ List View: Click dropdown icon bên cạnh Status → Chọn trạng thái mới
2. Từ Task Detail: Click vào Status badge → Chọn trạng thái mới
3. Từ Kanban View: (Dự kiến) Kéo thả card giữa các cột
4. Từ Bulk Actions: Chọn nhiều task → Bulk Actions → Chọn Status → Confirm
```

### 4.4. Luồng Bulk Actions

```
1. User tích chọn checkbox trên các task cần thao tác
2. Click "Bulk Actions"
3. Modal hiện ra với các tùy chọn: Mass Delete, Status, Priority, Assigned to, Billable, Tags
4. User chọn/điền giá trị mong muốn
5. Click "Confirm" để áp dụng
6. Tất cả task đã chọn được cập nhật đồng loạt
```

### 4.5. Quy tắc hiển thị Kanban View

| Quy tắc | Mô tả |
|---|---|
| Task quá hạn | Card hiển thị nền hồng/cam nhạt khi Due Date < ngày hiện tại |
| Cột trống | Hiển thị "No Tasks Found" với biểu tượng loading |
| Load More | Mỗi cột có nút "Load More" để tải thêm task nếu có nhiều |
| Thông tin card | Hiển thị: Tên task, avatar assignee, số comments (💬), số attachments (📎), due date |

---

## 5. Yêu cầu Phi chức năng (Non-functional Requirements)

| # | Yêu cầu | Mô tả |
|---|---|---|
| NFR-01 | **Responsive** | Giao diện sidebar thu gọn được (hamburger menu). Bảng hỗ trợ cuộn ngang |
| NFR-02 | **Hiệu năng** | Danh sách task tải với phân trang (mặc định 25 bản ghi). Kanban load async |
| NFR-03 | **Phân quyền** | Task Public/Private ảnh hưởng quyền xem. Chỉ assignees, followers, creator, admin mới thấy task Private |
| NFR-04 | **Định dạng ngày** | Sử dụng dd-MM-yyyy xuyên suốt module |
| NFR-05 | **Tích hợp** | Liên kết với modules: Projects, Invoices, Customers, Estimates, Contracts, Tickets, Expenses, Leads, Proposals |

---

## 6. Câu hỏi / Cần làm rõ với PO-User

> ⚠️ Các mục dưới đây không thể xác nhận chỉ từ giao diện UI, cần xác minh thêm từ Product Owner hoặc tài liệu nghiệp vụ.

| # | Câu hỏi |
|---|---|
| Q-01 | Khi **Due Date < Start Date**, hệ thống có hiển thị cảnh báo hay tự động chặn? |
| Q-02 | **Trường Subject** có giới hạn ký tự tối đa không? |
| Q-03 | **Hourly Rate** có giới hạn giá trị tối đa không? Có hỗ trợ số thập phân không? |
| Q-04 | Khi chọn **"Repeat every = Custom"**, form mở rộng thêm trường nào (ngày/tuần/tháng tùy chỉnh)? |
| Q-05 | **Kanban View** có hỗ trợ **kéo thả (drag & drop)** task giữa các cột không? |
| Q-06 | **Export** xuất dữ liệu ở định dạng nào? (CSV, Excel, PDF?) |
| Q-07 | **Start Timer** — Dữ liệu thời gian có được sử dụng cho tính lương/invoice không? |
| Q-08 | Khi **xóa task** có liên kết với Project, Checklist items, Comments — dữ liệu liên kết có bị xóa theo không? |
| Q-09 | **Checklist Items** — Cách thêm, chỉnh sửa, đánh dấu hoàn thành checklist item? |
| Q-10 | **Comments** — Có hỗ trợ mentions (@user), đính kèm file trong comment không? |
| Q-11 | **Reminders** — Reminder được gửi qua kênh nào (email, notification trong app, cả hai)? |
| Q-12 | Người dùng có thể tự **xóa mình khỏi Assignees/Followers** không? |
| Q-13 | **Saved Filters** — Bộ lọc có thể chia sẻ giữa các user không? |
| Q-14 | Có giới hạn số lượng **file đính kèm** (kích thước tối đa, loại file) không? |

---

## 7. Phụ lục: Danh sách các giá trị Enum

### 7.1. Task Status
| Giá trị | Màu hiển thị |
|---|---|
| Not Started | Xám |
| In Progress | Xanh dương |
| Testing | Xanh ngọc (Teal) |
| Awaiting Feedback | Cam |
| Complete | Xanh lá |

### 7.2. Task Priority
| Giá trị |
|---|
| Low |
| Medium (mặc định) |
| High |
| Urgent |

### 7.3. Repeat Every
| Giá trị |
|---|
| (Không lặp) |
| Week |
| 2 Weeks |
| 1 Month |
| 2 Months |
| 3 Months |
| 6 Months |
| 1 Year |
| Custom |

### 7.4. Related To
| Giá trị |
|---|
| (Không liên kết) |
| Project |
| Invoice |
| Customer |
| Estimate |
| Contract |
| Ticket |
| Expense |
| Lead |
| Proposal |

### 7.5. Billable
| Giá trị |
|---|
| Yes |
| No |

---

*Tài liệu được tạo tự động bằng AI Antigravity dựa trên khảo sát giao diện thực tế ngày 17-04-2026.*
