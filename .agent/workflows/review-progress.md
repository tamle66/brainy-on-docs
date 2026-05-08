---
description: ## Description Kiểm tra nhanh trạng thái tổng thể dự án. Dùng khi bắt đầu chat session mới để nắm context, hoặc khi muốn overview tiến độ.
---

## Steps

1. **Đọc PROJECT_STATUS.md**
   In ra:
   - Current Phase & Module
   - Bảng status tất cả modules
   - Active Tasks
   - Known Issues

2. **Đọc module doc hiện tại**
   - Đọc `docs/modules/[current-module].md` section 5 (Implementation Plan)
   - In ra: tasks nào đã ✅, tasks nào đang 🔲
   - Tính % completion của module hiện tại

3. **Đọc CHANGELOG.md (10 dòng cuối)**
   In ra recent changes

4. **Tóm tắt**
   ```
   📊 Project Status — [date]
   
   Overall: [X/7] modules completed
   Current: Module [N] — [name] — [X%] complete
   
   ✅ Completed tasks:
   - T1: [desc]
   - T2: [desc]
   
   🔲 Remaining tasks:
   - T3: [desc] ← NEXT
   - T4: [desc]
   
   ⚠️ Issues: [count]
   
   Suggestion: [what to do next]
   ```