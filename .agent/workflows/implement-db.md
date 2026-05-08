---
description: Tạo hoặc sửa database schema (migration). Đảm bảo match với technical specs và cập nhật ARCHITECTURE.md.
---

## Steps

1. **Load context**
   a. Đọc `docs/modules/[current-module].md` → Section 4.1 (Database)
   b. Đọc `docs/ARCHITECTURE.md` → Database Schema (current state)
   c. Xem existing migrations để hiểu naming convention

2. **Plan migration**
   So sánh specs trong module doc với database hiện tại:
   - Tables mới cần tạo?
   - Columns cần thêm/sửa/xóa?
   - Indexes cần tạo?
   - Foreign keys?
   - Seed data?

3. **Create migration**
   - Đặt tên: `[timestamp]_[description].sql` hoặc theo ORM convention
   - Include cả UP và DOWN (rollback)
   - Comments giải thích purpose

4. **Run migration**
   - Chạy migration
   - Verify tables/columns đã tạo đúng
   - Nếu fail → debug, KHÔNG skip

5. **Cập nhật docs**
   a. **ARCHITECTURE.md**: Cập nhật Database Schema section với tables mới/sửa
   b. **Module doc**: mark database task ✅
   c. **CHANGELOG.md**: log migration