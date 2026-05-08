---
description: Triển khai một task cụ thể trong một module. Mỗi chat session nên chỉ implement 1-2 tasks. Workflow này đảm bảo context được load đúng và documentation được cập nhật sau khi code.
---

## Steps

1. **Load context (BẮT BUỘC — luôn làm đầu tiên)**
   Đọc theo thứ tự:
   a. `docs/PROJECT_STATUS.md` → biết đang ở đâu trong dự án
   b. `docs/ARCHITECTURE.md` → hiểu cấu trúc code hiện tại
   c. `docs/modules/[current-module].md` → đọc KỸ section 4 (Technical Specs) và section 5 (Implementation Plan)
   d. `docs/CHANGELOG.md` (10 dòng cuối) → biết thay đổi gần nhất

   Sau khi đọc xong, in ra tóm tắt:
   ```
   📍 Context loaded:
   - Module: [name] (Phase [N])
   - Current task: T[X] — [description]
   - Previous task completed: T[X-1] — [description]
   - Dependencies: [list files/modules this task depends on]
   ```

2. **Xác nhận task với user**
   - In ra task tiếp theo trong implementation plan (status 🔲)
   - Hỏi: "Proceed with T[X]: [description]?" hoặc user có muốn làm task khác
   - Nếu user chỉ định task khác, switch sang task đó

3. **Implement**
   Viết code theo technical specs trong module doc. Tuân thủ:
   - Code comments: mỗi file mới phải có header comment mô tả purpose
   - Function docs: mỗi function/endpoint phải có docstring
   - Type hints (Python) / TypeScript types (Frontend)
   - Follow existing code patterns trong project

4. **Self-verify**
   Sau khi code xong:
   - Chạy linter/formatter nếu đã setup
   - Kiểm tra code có match với technical specs trong module doc không
   - Kiểm tra edge cases đã handle chưa
   - Nếu là API endpoint: verify request/response schema match docs
   - Nếu là frontend: verify tất cả states (loading, empty, error) đã handle

5. **Cập nhật documentation (BẮT BUỘC)**
   a. **Module doc** (`docs/modules/[current-module].md`):
      - Đánh dấu task hoàn thành: `🔲` → `✅`
      - Thêm implementation notes nếu có deviation từ plan
      - Cập nhật testing checklist nếu cần

   b. **ARCHITECTURE.md** (nếu có thay đổi cấu trúc):
      - Cập nhật Project Structure nếu thêm folders/files quan trọng
      - Cập nhật Database Schema nếu thêm/sửa tables
      - Cập nhật API Routes nếu thêm endpoints

   c. **CHANGELOG.md**:
      ```
      - [date] [module] feat: [description of what was implemented]
      ```

   d. **PROJECT_STATUS.md**:
      - Cập nhật Active Tasks
      - Cập nhật Known Issues nếu phát hiện

6. **Report cho user**
   ```
   ✅ Task T[X] completed: [description]

   Files changed:
   - [file1] — [what changed]
   - [file2] — [what changed]

   Docs updated:
   - [doc1] — [what updated]

   Next task: T[X+1] — [description]
   Known issues: [nếu có]
   ```