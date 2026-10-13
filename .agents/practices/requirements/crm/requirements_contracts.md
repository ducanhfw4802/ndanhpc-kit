# Tài liệu Yêu cầu — Module Contracts (Hợp đồng)

> **Hệ thống:** Perfex CRM  
> **URL:** https://crm.anhtester.com/admin/contracts  
> **Ngày tạo:** 17-04-2026  
> **Phiên bản:** 1.0  
> **Người tạo:** AI Antigravity (dựa trên khảo sát UI thực tế)

---

## 1. Tổng quan (Overview)

Module **Contracts** cho phép người dùng quản lý toàn bộ vòng đời hợp đồng trong hệ thống CRM, bao gồm: tạo mới, chỉnh sửa, theo dõi trạng thái, gia hạn, ký số, và quản lý các tài liệu đính kèm liên quan.

### 1.1. Mục đích
- Quản lý hợp đồng giữa doanh nghiệp và khách hàng.
- Theo dõi giá trị hợp đồng, thời hạn, loại hợp đồng.
- Hỗ trợ ký số (Signature), gia hạn (Renewal), và liên kết với các module khác (Tasks, Projects).

### 1.2. Đối tượng sử dụng
- **Admin / Staff:** Tạo, chỉnh sửa, xóa, ký hợp đồng.
- **Customer (Khách hàng):** Xem và ký hợp đồng (nếu được cấp quyền).

---

## 2. Yêu cầu Chức năng (Functional Requirements)

### FR-CON-001: Xem danh sách hợp đồng
- **Mô tả:** Là một người dùng, tôi muốn xem danh sách tất cả hợp đồng để có cái nhìn tổng quan.
- **Tiêu chí chấp nhận:**
  - Hiển thị bảng danh sách với các cột: `#`, `Subject`, `Customer`, `Contract Type`, `Contract Value`, `Start Date`, `End Date`, `Project`, `Signature`.
  - Hiển thị **Contract Summary** phía trên bảng với các trạng thái: Active (xanh dương), Expired (đỏ), About to Expire (vàng cam), Recently Added (xanh lá), Trash.
  - Hiển thị 2 biểu đồ: **Contracts by Type** (Bar chart) và **Contracts Value by Type (USD)** (Area chart).
  - Hỗ trợ phân trang (mặc định 25 bản ghi/trang) với nút Previous/Next.
  - Hiển thị thông tin "Showing X to Y of Z entries".

### FR-CON-002: Tìm kiếm và lọc hợp đồng
- **Mô tả:** Là một người dùng, tôi muốn tìm kiếm và lọc hợp đồng để nhanh chóng tìm được hợp đồng cần thiết.
- **Tiêu chí chấp nhận:**
  - Có ô tìm kiếm (Search) ở góc phải phía trên bảng.
  - Có icon bộ lọc nâng cao (Filter icon) ở góc phải trang.
  - Có thể sắp xếp theo cột (sort) bằng cách click vào header cột.
  - Có thể thay đổi số bản ghi hiển thị mỗi trang (dropdown: 25).
  - Có thể click vào từng trạng thái trong Contract Summary để lọc nhanh.

### FR-CON-003: Xuất dữ liệu (Export)
- **Mô tả:** Là một người dùng, tôi muốn xuất danh sách hợp đồng ra file để báo cáo hoặc lưu trữ.
- **Tiêu chí chấp nhận:**
  - Có nút **Export** nằm cạnh dropdown số bản ghi.
  - Có nút **Reload** (icon xoay) cạnh nút Export.

### FR-CON-004: Tạo mới hợp đồng
- **Mô tả:** Là một người dùng, tôi muốn tạo mới hợp đồng để ghi nhận thỏa thuận với khách hàng.
- **Tiêu chí chấp nhận:**
  - Click nút **"+ New Contract"** (màu xanh dương) để mở form tạo mới.
  - Form hiển thị tiêu đề "Contract Information".
  - Điền đầy đủ thông tin bắt buộc và nhấn **Save** để lưu.
  - Hệ thống tự động tạo mã hợp đồng (ID #).
  - Ngày bắt đầu (Start Date) mặc định là ngày hiện tại.

### FR-CON-005: Chỉnh sửa hợp đồng
- **Mô tả:** Là một người dùng, tôi muốn chỉnh sửa thông tin hợp đồng đã tạo.
- **Tiêu chí chấp nhận:**
  - Click vào Subject của hợp đồng trong danh sách để mở trang chi tiết.
  - Trang chi tiết hiển thị form chỉnh sửa (bên trái) và các tab thông tin (bên phải).
  - Chỉnh sửa các trường và nhấn **Save** để cập nhật.

### FR-CON-006: Xem chi tiết hợp đồng (View Contract)
- **Mô tả:** Là một người dùng, tôi muốn xem chi tiết nội dung hợp đồng dưới dạng tài liệu.
- **Tiêu chí chấp nhận:**
  - Có link **"View Contract"** ở phía trên bên phải trang chi tiết.
  - Mở trang xem nội dung hợp đồng đầy đủ.

### FR-CON-007: Quản lý tệp đính kèm (Attachments)
- **Mô tả:** Là một người dùng, tôi muốn đính kèm tài liệu liên quan đến hợp đồng.
- **Tiêu chí chấp nhận:**
  - Tab **Attachments** hiển thị vùng kéo thả file: "Drop files here to upload".
  - Hỗ trợ drag-and-drop để upload file.

### FR-CON-008: Bình luận (Comments)
- **Mô tả:** Là một người dùng, tôi muốn thêm bình luận vào hợp đồng để trao đổi nội bộ.
- **Tiêu chí chấp nhận:**
  - Tab **Comments** hiển thị textarea để nhập nội dung.
  - Có nút **"Add Comment"** (màu xanh dương) để gửi bình luận.

### FR-CON-009: Lịch sử gia hạn (Renewal History)
- **Mô tả:** Là một người dùng, tôi muốn xem lịch sử gia hạn và thực hiện gia hạn hợp đồng.
- **Tiêu chí chấp nhận:**
  - Tab **Renewal History** hiển thị nút **"Renew Contract"** (icon + text).
  - Hiển thị danh sách lịch sử gia hạn hoặc thông báo "Renewals for this contract are not found" nếu chưa có.

### FR-CON-010: Quản lý Tasks liên quan
- **Mô tả:** Là một người dùng, tôi muốn tạo và quản lý các công việc liên quan đến hợp đồng.
- **Tiêu chí chấp nhận:**
  - Tab **Tasks** hiển thị nút **"+ New Task"** (màu xanh dương).
  - Có icon bộ lọc, dropdown số bản ghi (25), nút Export, nút Reload, ô Search.
  - Bảng danh sách task với các cột: `#`, `Name`, `Status`, `Start Date`, `Due Date`, `Assigned to`, `Tags`, `Priority`.
  - Hiển thị "No entries found" nếu chưa có task nào.

### FR-CON-011: Ghi chú (Notes)
- **Mô tả:** Là một người dùng, tôi muốn thêm ghi chú vào hợp đồng.
- **Tiêu chí chấp nhận:**
  - Tab **Notes** hiển thị textarea để nhập nội dung ghi chú.
  - Có nút **"Add Note"** (màu xanh dương) để lưu ghi chú.

### FR-CON-012: Templates (Mẫu hợp đồng)
- **Mô tả:** Là một người dùng, tôi muốn áp dụng mẫu hợp đồng có sẵn.
- **Tiêu chí chấp nhận:**
  - Tab **Templates** hiển thị link **"Available merge fields"** để xem các trường merge khả dụng.
  - Có textarea để nhập/chỉnh sửa nội dung mẫu.

### FR-CON-013: Gửi Email hợp đồng
- **Mô tả:** Là một người dùng, tôi muốn gửi hợp đồng qua email cho khách hàng.
- **Tiêu chí chấp nhận:**
  - Có icon **Email** (biểu tượng phong bì) ở thanh hành động phía trên.

### FR-CON-014: Quản lý chữ ký (Signature)
- **Mô tả:** Là một người dùng, tôi muốn theo dõi trạng thái ký hợp đồng.
- **Tiêu chí chấp nhận:**
  - Cột **Signature** trong bảng danh sách hiển thị trạng thái: "Not Signed" hoặc thông tin chữ ký.
  - Có icon quản lý chữ ký ở thanh hành động (icon người kèm dropdown).

### FR-CON-015: Thao tác bổ sung (More Actions)
- **Mô tả:** Là một người dùng, tôi muốn truy cập các hành động bổ sung từ menu "More".
- **Tiêu chí chấp nhận:**
  - Nút **"More"** (dropdown) ở góc phải phía trên trang chi tiết.
  - Chứa các hành động bổ sung như: Copy, Delete, PDF, v.v.

### FR-CON-016: Đánh dấu Trash / Ẩn khỏi khách hàng
- **Mô tả:** Là một người dùng, tôi muốn đánh dấu hợp đồng là rác hoặc ẩn khỏi khách hàng.
- **Tiêu chí chấp nhận:**
  - Checkbox **"Trash"** (có tooltip) ở đầu form.
  - Checkbox **"Hide from customer"** cạnh Trash.
  - Khi đánh dấu Trash, hợp đồng xuất hiện trong bộ đếm Trash ở Contract Summary.

### FR-CON-017: Thêm loại hợp đồng mới (Inline Add)
- **Mô tả:** Là một người dùng, tôi muốn thêm loại hợp đồng mới ngay từ form tạo/chỉnh sửa.
- **Tiêu chí chấp nhận:**
  - Nút **"+"** bên cạnh dropdown Contract type cho phép thêm loại hợp đồng mới mà không rời trang.

---

## 3. Đặc tả Trường Dữ liệu (Field Specifications)

### 3.1. Form tạo/chỉnh sửa hợp đồng (Contract Information)

| # | Tên Trường (Label) | Loại UI | Bắt buộc | Giá trị Mặc định | Ràng buộc / Validation | Ghi chú |
|---|---------------------|---------|----------|-------------------|------------------------|---------|
| 1 | Trash | Checkbox | Không | Unchecked | — | Có tooltip giải thích |
| 2 | Hide from customer | Checkbox | Không | Unchecked | — | Ẩn hợp đồng khỏi portal khách hàng |
| 3 | Customer | Searchable Dropdown (Combobox) | **Có** (★) | Trống | Phải chọn từ danh sách. Gợi ý: "Select and begin typing". Validation: "Select and begin typing" (đỏ) | Tìm kiếm theo tên khách hàng, có nút X để xóa lựa chọn |
| 4 | Subject | Text Input | **Có** (★) | Trống | Validation message: "This field is required." | Có icon tooltip (?) bên cạnh label |
| 5 | Contract Value | Number Input | Không | Trống | Chỉ nhận giá trị số. Hiển thị ký hiệu "$" bên phải | Đơn vị tiền tệ USD |
| 6 | Contract type | Dropdown (Select) | Không | "Nothing selected" | Chọn từ danh sách có sẵn. Có nút "+" để thêm loại mới | Các giá trị mẫu: "Thử việc", "Type A", "Ohh YEAH Type", v.v. |
| 7 | Start Date | Date Picker | **Có** (★) | Ngày hiện tại (dd-mm-yyyy) | Định dạng: dd-mm-yyyy. Có icon lịch | VD: 17-04-2026 |
| 8 | End Date | Date Picker | Không | Trống | Định dạng: dd-mm-yyyy. Có icon lịch | Nên sau Start Date (logic nghiệp vụ) |
| 9 | Description | Textarea | Không | Trống | — | Vùng nhập nội dung mô tả dài, có thể resize |

### 3.2. Bảng danh sách hợp đồng (Contracts List Table)

| # | Tên Cột | Kiểu Dữ liệu | Có Sắp xếp | Ghi chú |
|---|---------|---------------|-------------|---------|
| 1 | # | Number (ID) | Có | Mã số tự tăng, link có thể click |
| 2 | Subject | Text (Link) | Có | Click để mở chi tiết, hiển thị màu xanh dương |
| 3 | Customer | Text (Link) | Có | Link đến trang customer, hiển thị màu xanh dương |
| 4 | Contract Type | Text | Có | Loại hợp đồng |
| 5 | Contract Value | Currency (USD) | Có | Hiển thị format: $X.XX |
| 6 | Start Date | Date | Có | Định dạng: dd-mm-yyyy |
| 7 | End Date | Date | Có (▲) | Định dạng: dd-mm-yyyy. Hiển thị đỏ nếu đã hết hạn |
| 8 | Project | Text | Có | Dự án liên kết (có thể trống) |
| 9 | Signature | Text/Status | Có | "Not Signed" hoặc trạng thái ký |

### 3.3. Contract Summary (Tóm tắt trạng thái)

| Trạng thái | Màu sắc | Mô tả |
|------------|---------|-------|
| Active | Xanh dương | Hợp đồng đang hoạt động |
| Expired | Đỏ | Hợp đồng đã hết hạn |
| About to Expire | Vàng cam | Hợp đồng sắp hết hạn |
| Recently Added | Xanh lá | Hợp đồng mới thêm gần đây |
| Trash | Xám (mặc định) | Hợp đồng đã xóa mềm |

---

## 4. Các luồng xử lý và Quy tắc nghiệp vụ (Business Rules & Validations)

### 4.1. Luồng tạo mới hợp đồng (Create Contract Flow)

```
[Trang danh sách] → Click "+ New Contract" → [Form Contract Information]
  → Điền thông tin → Click "Save"
    → Thành công: Chuyển sang trang chi tiết hợp đồng vừa tạo
    → Thất bại: Hiển thị validation errors trên các trường bắt buộc
```

### 4.2. Luồng chỉnh sửa hợp đồng (Edit Contract Flow)

```
[Trang danh sách] → Click Subject hợp đồng → [Trang chi tiết]
  → Chỉnh sửa thông tin bên trái → Click "Save"
    → Thành công: Cập nhật và hiển thị thông báo thành công
    → Thất bại: Hiển thị validation errors
```

### 4.3. Luồng gia hạn hợp đồng (Renew Contract Flow)

```
[Trang chi tiết] → Tab "Renewal History" → Click "Renew Contract"
  → Tạo bản gia hạn mới → Lưu lịch sử gia hạn
```

### 4.4. Quy tắc Validation

| # | Trường | Điều kiện lỗi | Thông báo lỗi (Validation Message) |
|---|--------|---------------|--------------------------------------|
| 1 | Customer | Không chọn khách hàng | Label "Customer" chuyển đỏ, viền input đỏ, hiển thị "Select and begin typing" (đỏ) |
| 2 | Subject | Để trống | Label "Subject" chuyển đỏ, viền input đỏ, hiển thị **"This field is required."** (đỏ) |
| 3 | Start Date | Để trống | Label "Start Date" chuyển đỏ (tuy nhiên mặc định đã có giá trị) |

### 4.5. Quy tắc nghiệp vụ quan sát được

| # | Quy tắc | Mô tả |
|---|---------|-------|
| 1 | Trạng thái tự động | End Date < ngày hiện tại → trạng thái **Expired** (End Date hiển thị màu đỏ trong bảng) |
| 2 | Contract Summary động | Các bộ đếm (Active, Expired, About to Expire, Recently Added, Trash) tự động cập nhật |
| 3 | Biểu đồ tự động | 2 biểu đồ thống kê tự động cập nhật theo dữ liệu hợp đồng |
| 4 | Mã tự tăng | ID hợp đồng (#) được hệ thống tự động tạo, không thể chỉnh sửa |
| 5 | Customer searchable | Dropdown Customer yêu cầu gõ từ khóa để tìm kiếm, hiển thị "Start typing to search" |
| 6 | Inline add Contract type | Nút "+" cho phép thêm loại hợp đồng mới ngay trên form mà không cần rời trang |
| 7 | End Date màu đỏ | Khi End Date đã qua, hệ thống tự động hiển thị màu đỏ trong bảng danh sách |

---

## 5. Các Tab trên trang Chi tiết Hợp đồng

| # | Tên Tab | Chức năng | Thành phần UI chính |
|---|---------|-----------|---------------------|
| 1 | **Contract** | Hiển thị nội dung hợp đồng | Textarea với "Available merge fields" link |
| 2 | **Attachments** | Quản lý tệp đính kèm | Vùng drag-and-drop: "Drop files here to upload" |
| 3 | **Comments** | Bình luận nội bộ | Textarea + nút "Add Comment" |
| 4 | **Renewal History** | Lịch sử gia hạn | Nút "Renew Contract" + danh sách lịch sử |
| 5 | **Tasks** | Công việc liên quan | Nút "+ New Task", bảng tasks, Search, Export, Filter |
| 6 | **Notes** | Ghi chú nội bộ | Textarea + nút "Add Note" |
| 7 | **Templates** | Mẫu hợp đồng | "Available merge fields" link + textarea nội dung |
| 8 | **Icon: Reload** | Làm mới tab | Icon xoay (↻) |
| 9 | **Icon: Fullscreen** | Mở rộng toàn màn hình | Icon mở rộng (⛶) |

---

## 6. Thanh Hành động (Action Bar) trên trang Chi tiết

| # | Thành phần | Loại | Mô tả |
|---|-----------|------|-------|
| 1 | View Contract | Text Link (xanh dương) | Mở xem nội dung hợp đồng dạng tài liệu |
| 2 | Signature icon | Icon + Dropdown | Quản lý chữ ký hợp đồng (icon người) |
| 3 | Email icon | Icon (phong bì) | Gửi hợp đồng qua email |
| 4 | More | Button + Dropdown | Menu thao tác bổ sung (Copy, Delete, PDF, v.v.) |
| 5 | Save | Button (xanh dương) | Lưu thay đổi, nằm ở góc dưới bên phải |

---

## 7. Yêu cầu Phi chức năng (Non-functional Requirements)

| # | Yêu cầu | Mô tả |
|---|---------|-------|
| NFR-01 | Responsive UI | Giao diện chia 2 cột: form chỉnh sửa (trái) và tabs thông tin (phải) |
| NFR-02 | Phân trang | Hỗ trợ phân trang với số bản ghi có thể tùy chỉnh |
| NFR-03 | Biểu đồ trực quan | 2 biểu đồ thống kê (Bar chart + Area chart) hiển thị trên trang danh sách |
| NFR-04 | Validation real-time | Validation hiển thị ngay khi nhấn Save mà không cần reload trang |
| NFR-05 | Sidebar Navigation | Module Contracts nằm trong sidebar, highlight khi đang active |
| NFR-06 | Global Search | Thanh tìm kiếm toàn cục (global search) ở header |

---

## 8. Câu hỏi / Cần làm rõ với PO-User

| # | Câu hỏi | Lý do |
|---|---------|-------|
| 1 | Giới hạn ký tự tối đa của trường Subject là bao nhiêu? | Không quan sát được `maxlength` trên UI |
| 2 | Contract Value có giới hạn giá trị tối đa/tối thiểu không? | UI chỉ hiển thị input number, không rõ ràng buộc |
| 3 | End Date có bắt buộc phải sau Start Date không? Hệ thống có validate cross-field không? | Không thấy validation message liên quan |
| 4 | Khi gia hạn hợp đồng (Renew), các trường nào được copy sang bản mới? | Chưa test được flow gia hạn đầy đủ |
| 5 | Quyền truy cập: Ai có thể tạo/sửa/xóa hợp đồng? Có phân quyền theo role không? | UI không hiển thị thông tin phân quyền |
| 6 | "Hide from customer" ảnh hưởng đến portal khách hàng như thế nào cụ thể? | Cần xác nhận behavior từ phía customer portal |
| 7 | Nút "More" chứa những hành động cụ thể nào? (Copy, Delete, Generate PDF, v.v.) | Dropdown menu cần kiểm tra chi tiết hơn |
| 8 | Chữ ký (Signature) hoạt động như thế nào? Có hỗ trợ e-signature hay chỉ đánh dấu? | Cần làm rõ quy trình ký hợp đồng |
| 9 | Description có hỗ trợ Rich Text Editor (WYSIWYG) không? | Form hiện tại chỉ hiển thị textarea thường |
| 10 | Có giới hạn dung lượng và loại file đính kèm (Attachments) không? | Không quan sát được trên UI |

---

> **Ghi chú:** Tài liệu này được tạo dựa trên khảo sát giao diện thực tế tại thời điểm 17/04/2026. Các quy tắc nghiệp vụ phức tạp hơn (logic backend, phân quyền, email template) cần được xác nhận với Product Owner hoặc tài liệu thiết kế hệ thống.
