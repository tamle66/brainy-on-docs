---
description: Triển khai một API endpoint cụ thể. Đảm bảo match với technical specs, có validation, error handling, và documentation.
---

## Steps

1. **Load context**
   a. Đọc `docs/modules/[current-module].md` → Section 4.2 (API Endpoints)
   b. Tìm endpoint cần implement
   c. Đọc Section 4.1 (Database) → tables liên quan
   d. Đọc Section 4.3 (Business Logic) → logic xử lý
   e. Đọc `docs/ARCHITECTURE.md` → API Routes + Project Structure

2. **Verify database**
   - Tables mà endpoint cần đã tồn tại chưa?
   - Nếu chưa → tạo migration trước
   - Nếu rồi → verify schema match docs

3. **Implement endpoint**
   Theo thứ tự:
   a. Route definition + method
   b. Request validation (Pydantic model)
   c. Business logic
   d. Database queries
   e. Response formatting
   f. Error handling (try/catch, proper HTTP status codes)
   g. Docstring với mô tả, params, response example

4. **Verify against specs**
   Checklist:
   - [ ] Method + Path đúng theo docs
   - [ ] Request schema match docs
   - [ ] Response schema match docs (cả success và error)
   - [ ] Validation rules đúng
   - [ ] Business logic đúng theo Section 4.3
   - [ ] Error codes + messages đúng
   - [ ] Docstring đầy đủ

5. **Test**
   - Test happy path
   - Test validation (invalid input)
   - Test edge cases (empty data, boundary values)
   - Test error cases

6. **Cập nhật docs**
   - Module doc: mark task ✅
   - ARCHITECTURE.md: thêm route vào API Routes nếu chưa có
   - CHANGELOG.md: log change