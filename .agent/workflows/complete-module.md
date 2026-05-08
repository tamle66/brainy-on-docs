---
description: Đóng một module sau khi tất cả tasks hoàn thành. Review chất lượng, cập nhật docs, và chuẩn bị cho module tiếp theo.
---

## Steps

1. **Verify completion**
   Đọc `docs/modules/[current-module].md`:
   - Kiểm tra TẤT CẢ tasks trong Implementation Plan đã ✅
   - Kiểm tra TẤT CẢ Acceptance Criteria đã thỏa mãn
   - Kiểm tra Testing Checklist đã pass

   Nếu có task chưa xong → thông báo user, không proceed.

2. **Run final checks**
   - Chạy tất cả tests liên quan đến module
   - Kiểm tra: có Known Issues nào thuộc module này chưa fix?
   - Kiểm tra: code comments đầy đủ chưa?

3. **Cập nhật module doc**
   - Status: 🚧 In Progress → ✅ Done
   - Điền Section 7: Post-Implementation Review
     - Completed date
     - Deviations from plan
     - Lessons learned
   - Đánh dấu tất cả tasks: ✅

4. **Cập nhật PROJECT_STATUS.md**
   - Module row: status → ✅ Done
   - Remove completed tasks từ Active Tasks
   - Update Current Phase → module tiếp theo (nếu có)

5. **Cập nhật ARCHITECTURE.md**
   - Đảm bảo Project Structure up-to-date
   - Đảm bảo Database Schema reflects actual tables
   - Đảm bảo API Routes complete

6. **Cập nhật CHANGELOG.md**
   ```
   - [date] [module] milestone: Module [N] completed ✅
   ```

7. **Tóm tắt cho user**
   ```
   🎉 Module [N]: [name] — COMPLETED

   Summary:
   - [X] tasks completed
   - [Y] bug fixes during implementation
   - Deviations: [brief list]
   - Lessons: [brief list]

   Next: Module [N+1] — [name]
   → Run /plan-module to start planning
   ```