---
description: Ghi lại một quyết định thiết kế hoặc kiến trúc quan trọng (ADR - Architecture Decision Record). Dùng khi phải chọn giữa nhiều options, hoặc khi deviate từ product spec.
---

## Steps

1. **Tạo ADR file**
   File: `docs/decisions/[NNN]-[short-title].md`
   NNN = số thứ tự tăng dần (001, 002, ...)

2. **Điền template**
   ```markdown
   # ADR-[NNN]: [Title]
   **Date:** [date]
   **Status:** Accepted | Superseded by ADR-[X]
   **Module:** [module name or "Cross-cutting"]

   ## Context
   [Vấn đề gì cần quyết định? Tại sao phải quyết định bây giờ?]

   ## Options Considered
   ### Option A: [name]
   - Pros: [list]
   - Cons: [list]

   ### Option B: [name]
   - Pros: [list]
   - Cons: [list]

   ## Decision
   [Chọn option nào và TẠI SAO]

   ## Consequences
   [Hệ quả của quyết định này: ảnh hưởng gì đến code, performance, UX, maintenance]
   ```

3. **Cập nhật CHANGELOG.md**
   ```
   - [date] [module] decision: ADR-[NNN] — [title]
   ```

4. **Cập nhật module doc** (nếu liên quan)
   Thêm reference đến ADR trong Implementation Notes