---
description: Refactor code hiện có mà không thay đổi behavior. Đảm bảo document lý do và verify không regression.
---

## Steps

1. **Load context**
   a. Đọc `docs/PROJECT_STATUS.md` → đảm bảo không refactor giữa lúc đang implement feature
   b. Đọc `docs/ARCHITECTURE.md` → hiểu cấu trúc hiện tại
   c. Xác định scope refactor: file(s), module(s) nào

2. **Document lý do**
   Trước khi sửa, ghi rõ:
   - WHY: Tại sao cần refactor? (performance, readability, duplication, preparation for next module)
   - WHAT: Refactor cái gì cụ thể?
   - SCOPE: Giới hạn ở đâu? (KHÔNG mở rộng scope giữa chừng)

3. **Verify existing behavior**
   - Chạy tests hiện có (nếu có)
   - Note lại behavior hiện tại để verify sau

4. **Implement refactor**
   - Sửa code
   - KHÔNG thay đổi behavior, KHÔNG thêm feature
   - Giữ nguyên API contracts (request/response schemas)
   - Update imports, references nếu rename/move files

5. **Verify no regression**
   - Chạy lại tests
   - Verify behavior không đổi

6. **Cập nhật docs**
   a. **ARCHITECTURE.md**: Cập nhật Project Structure nếu files moved/renamed
   b. **CHANGELOG.md**:
      ```
      - [date] [module] refactor: [description] — Reason: [why]
      ```
   c. Module doc: thêm Implementation Notes nếu cần