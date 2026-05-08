---
description: Shape và lập kế hoạch chi tiết cho một module trước khi code. Tạo đầy đủ tài liệu UX, frontend requirements, và technical specs. Chạy workflow này MỖI KHI bắt đầu một module mới.
---

## Steps

1. **Đọc context dự án**
   - Đọc `docs/PROJECT_STATUS.md` → biết đang ở phase nào, module nào đã xong
   - Đọc `docs/PRODUCT_SPEC.md` → tìm section của module cần plan
   - Đọc `docs/ARCHITECTURE.md` → hiểu kiến trúc hiện tại
   - Nếu có module trước đã hoàn thành, đọc doc của module đó để hiểu dependencies

2. **Tạo module doc từ template**
   - Copy `docs/modules/_TEMPLATE.md` thành `docs/modules/[NN]-[module-name].md`
   - Điền đầy đủ các section theo template

3. **Điền Section 1: Overview**
   Từ PRODUCT_SPEC.md, tóm tắt:
   - Job to be done
   - User flow chính
   - Dependencies (module nào phải xong trước)
   - Acceptance criteria (khi nào module này coi là "done")

4. **Điền Section 2: UX/Shaping**
   Mô tả chi tiết:
   - Wireframes (ASCII hoặc mô tả chi tiết từng màn hình)
   - User flow step-by-step (user làm gì → app phản hồi gì)
   - Edge cases (lỗi, empty state, loading state)
   - Các quyết định UX đã chốt (từ product spec)
   - Copy/wording cho các messages, alerts, labels

5. **Điền Section 3: Frontend Requirements**
   Tài liệu để UI Designer thiết kế:
   - Danh sách screens/pages cần thiết kế
   - Cho MỖI screen:
     - Layout description (vùng nào chứa gì)
     - Components cần có (table, form, chart, modal, toast...)
     - States: default, loading, empty, error, success
     - Responsive behavior (desktop vs mobile)
   - Interactions: click, hover, drag, scroll behaviors
   - Data display: format số, ngày, tiền VND, %

6. **Điền Section 4: Technical Specs**
   - Database tables cần tạo/modify (DDL chi tiết)
   - API endpoints chi tiết (request/response schema, validation)
   - Business logic rules (tính toán, conditions, formulas)
   - Background jobs cần setup (nếu có)
   - Error handling strategy

7. **Điền Section 5: Implementation Plan**
   Chia module thành các tasks nhỏ, theo thứ tự:
   ```markdown
   ## Implementation Tasks
   - [ ] Task 1: [database migration] — Est: [size S/M/L]
   - [ ] Task 2: [API endpoint X] — Est: [size]
   - [ ] Task 3: [Frontend component Y] — Est: [size]
   ...
   ```
   Mỗi task phải đủ nhỏ để hoàn thành trong 1 chat session.

8. **Cập nhật PROJECT_STATUS.md**
   - Module status: 🔲 Not started → 📋 Planned
   - Thêm vào Active Tasks

9. **Cập nhật CHANGELOG.md**
   ```
   - [date] [module] docs: Completed module planning
   ```

10. **Present kết quả cho user**
    - Tóm tắt: bao nhiêu screens, bao nhiêu API endpoints, bao nhiêu tasks
    - Hỏi user review trước khi bắt đầu implement