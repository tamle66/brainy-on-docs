---
description: Khởi tạo cấu trúc dự án, tạo documentation backbone để mọi chat session sau đều có context. Chỉ chạy 1 lần khi bắt đầu dự án.
---

## Steps

1. **Đọc Product Spec**
   - Đọc file `docs/PRODUCT_SPEC.md` để hiểu toàn bộ sản phẩm
   - Nếu file chưa tồn tại, yêu cầu user cung cấp

2. **Tạo cấu trúc docs**
   Tạo các file/folder sau nếu chưa có:
   ```
   docs/
   ├── PRODUCT_SPEC.md          (đã có - product spec gốc)
   ├── PROJECT_STATUS.md        (trạng thái tổng thể dự án)
   ├── ARCHITECTURE.md          (kiến trúc kỹ thuật tổng quan)
   ├── CHANGELOG.md             (log mọi thay đổi)
   ├── modules/
   │   ├── _TEMPLATE.md         (template cho module mới)
   └── decisions/               (Architecture Decision Records)
       └── _TEMPLATE.md
   ```

3. **Tạo PROJECT_STATUS.md**
   File này là **entry point** cho mọi chat session mới. Nội dung:
   ```markdown
   # Alchemist OS — Project Status
   Last updated: [date]

   ## Current Phase
   Phase [N]: [Module name] — [Status: Planning / In Progress / Testing / Done]

   ## Modules Overview
   | # | Module | Status | Branch | Notes |
   |---|--------|--------|--------|-------|
   | 1 | AAAAAA | 🔲 Not started | — | — |

   ## Active Tasks
   - [ ] [task description] — [module] — [assignee/status]

   ## Known Issues
   - [ ] [issue description] — [severity] — [module]

   ## Recent Changes
   See CHANGELOG.md
   ```

4. **Tạo ARCHITECTURE.md**
   ```markdown
   # Alchemist OS — Architecture

   ## Tech Stack

   ## Project Structure
   [Cập nhật khi code thực tế được tạo]

   ## Database Schema
   [Cập nhật từ PRODUCT_SPEC.md section 12]

   ## API Routes
   [Cập nhật từ PRODUCT_SPEC.md section 13]

   ## Environment & Config
   [Cập nhật khi setup]
   ```

5. **Tạo CHANGELOG.md**
   ```markdown
   # Changelog
   Format: [date] [module] [type: feat/fix/refactor/docs] — description

   ## [date]
   - docs: Khởi tạo project documentation
   ```

6. **Tạo module template**
   Tạo `docs/modules/_TEMPLATE.md` — đây là template chuẩn cho mọi module doc.

7. **Confirm với user**
   In ra danh sách files đã tạo và hỏi user có muốn điều chỉnh gì không.