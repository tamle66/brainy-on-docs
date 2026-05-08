---
description: Workflow chuẩn để debug bất kỳ loại bug nào. Đảm bảo hiểu context trước khi sửa, tìm root cause thay vì patch, và document fix để tránh lặp lại.
---

## Steps

1. **Load context**
   Đọc nhanh:
   a. `docs/PROJECT_STATUS.md` → Known Issues (bug này đã biết chưa?)
   b. `docs/ARCHITECTURE.md` → hiểu cấu trúc liên quan
   c. `docs/modules/[relevant-module].md` → section 4 Technical Specs
   d. `docs/CHANGELOG.md` (5 dòng cuối) → thay đổi gần nhất có thể gây bug

2. **Reproduce & Classify**
   Hỏi user hoặc tự xác định:
   - **Bug type:** Runtime error | Logic error | UI bug | Data bug | Performance | Integration
   - **Severity:** 🔴 Critical (app crash) | 🟡 Major (feature broken) | 🟢 Minor (cosmetic/edge case)
   - **Reproduce steps:** Cụ thể các bước để tái hiện
   - **Expected vs Actual:** Kết quả mong muốn vs kết quả thực tế
   - **Scope:** File(s) và module(s) liên quan

   In ra:
   ```
   🐛 Bug Report:
   - Type: [type]
   - Severity: [severity]
   - Module: [module]
   - Reproduce: [steps]
   - Expected: [expected]
   - Actual: [actual]
   ```

3. **Investigate root cause**
   Theo thứ tự:
   a. Đọc error message/stack trace (nếu có)
   b. Đọc code liên quan, trace logic flow
   c. Kiểm tra: bug do code mới hay code cũ? (check CHANGELOG)
   d. Kiểm tra: technical specs trong module doc có đúng không, hay specs cũng sai?
   e. Xác định ROOT CAUSE — không chỉ symptom

   In ra:
   ```
   🔍 Root Cause:
   - Location: [file:line]
   - Cause: [mô tả nguyên nhân gốc]
   - Introduced by: [task/change nào gây ra, nếu biết]
   ```

4. **Plan fix**
   Trước khi sửa, mô tả:
   - Fix approach: sửa gì, ở đâu
   - Impact: fix này ảnh hưởng gì khác không?
   - Cần test gì sau khi fix?

   Hỏi user confirm nếu fix có impact lớn.

5. **Implement fix**
   - Sửa code
   - KHÔNG sửa thêm gì khác ngoài scope bug fix (tránh scope creep)
   - Thêm comment giải thích fix nếu logic không obvious

6. **Verify fix**
   - Chạy lại reproduce steps → confirm bug đã hết
   - Chạy tests liên quan (nếu có)
   - Kiểm tra: fix có gây regression ở chỗ khác không?

7. **Document fix (BẮT BUỘC)**
   a. **CHANGELOG.md:**
      ```
      - [date] [module] fix: [description] — Root cause: [brief cause]
      ```

   b. **PROJECT_STATUS.md:**
      - Remove từ Known Issues (nếu có)
      - Hoặc thêm vào Known Issues nếu fix chưa hoàn toàn

   c. **Module doc** (nếu cần):
      - Cập nhật Technical Specs nếu specs ban đầu sai
      - Thêm vào Implementation Notes: "Bug found: [X], fixed by [Y]"
      - Thêm test case vào Testing Checklist

8. **Report**
   ```
   🔧 Bug Fixed:
   - Root cause: [cause]
   - Fix: [what was changed]
   - Files: [list files modified]
   - Verified: [how]
   - Docs updated: [list]
   - Regression risk: [low/medium/high — why]
   ```