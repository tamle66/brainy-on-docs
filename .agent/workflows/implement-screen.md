---
description: Triển khai một screen/page frontend cụ thể. Đảm bảo match với frontend requirements trong module doc và handle tất cả states.
---

## Steps

1. **Load context**
   a. Đọc `docs/modules/[current-module].md` → Section 3 (Frontend Requirements)
   b. Tìm screen cần implement trong Section 3
   c. Đọc Section 2 (UX/Shaping) → wireframe và user flow liên quan
   d. Đọc `docs/ARCHITECTURE.md` → Project Structure để biết đặt file ở đâu

2. **Kiểm tra dependencies**
   - API endpoints mà screen này cần → đã implement chưa? (check module doc Section 4)
   - Shared components cần dùng → đã có chưa?
   - Nếu chưa có dependency → thông báo user, suggest implement API trước

3. **Plan components**
   Từ frontend requirements, liệt kê:
   ```
   Screen: [name]
   ├── Component A (type) — [data source]
   ├── Component B (type) — [data source]
   └── Component C (type) — [data source]

   States cần handle:
   - Loading: [skeleton/spinner]
   - Empty: [empty message + CTA]
   - Error: [error message + retry]
   - Default: [normal display]
   ```

4. **Implement**
   Theo thứ tự:
   a. Page layout/structure
   b. Từng component (bottom-up: nhỏ nhất trước)
   c. Data fetching / API integration
   d. Loading / Empty / Error states
   e. Interactions (click, hover, etc.)
   f. Responsive adjustments

5. **Verify against requirements**
   Checklist:
   - [ ] Layout match wireframe trong module doc
   - [ ] Tất cả components từ requirements đã implement
   - [ ] Tất cả states (loading, empty, error, default) đã handle
   - [ ] Data format đúng (tiền VND, %, ngày)
   - [ ] Interactions hoạt động đúng
   - [ ] Responsive OK (nếu required)
   - [ ] Copy/wording đúng theo Section 2.4

6. **Cập nhật docs**
   - Module doc: mark task ✅, thêm implementation notes nếu có
   - ARCHITECTURE.md: cập nhật Project Structure nếu thêm files/folders mới
   - CHANGELOG.md: log change

7. **Report**
   ```
   ✅ Screen implemented: [name]
   - Components: [list]
   - States handled: loading, empty, error, default
   - API integrated: [endpoints used]
   - Files created: [list]
   ```