# Changelog
Format: [date] [module] [type: feat/fix/refactor/docs] — description

## [1.1.6] - 2026-05-11
### Added
- **Module 02: Core Rewrite Update**:
  - Backend and Frontend now pass the full document text as `context` during rewrite to ensure AI has a broad understanding of the meaning before rewriting a specific selection.
  - Added an optional `User Prompt` textarea in the Rewrite tab, allowing users to provide custom instructions alongside predefined styles.

## [1.1.5] - 2026-05-08
### Added
- **Module 04: Inline Suggestion**:
  - Tự động phát hiện lỗi typing/grammar sau khi dừng gõ 1.5s.
  - Hiển thị danh sách Suggestion Cards trong tab "Kiểm tra".
  - Tự động highlight màu vàng + underline các từ lỗi trực tiếp trong Lark Docs dùng native SDK API.
  - Tự động cuộn danh sách và làm nổi bật Suggestion Card khi người dùng click/di chuyển con trỏ chuột vào vùng văn bản bị lỗi.
  - Hỗ trợ Apply (sửa trực tiếp vào doc) và Dismiss (ẩn highlight/card). Tính năng Bỏ qua (Dismiss) đã được nâng cấp để lưu vĩnh viễn (persistent ignore history) các lỗi vào LocalStorage, giúp không hiển thị lại ở những lần kiểm tra sau.
  - Layout 4 tabs mới: Viết lại, Kiểm tra, Kỹ năng, Cài đặt.
  - Backend: Phân loại lỗi thành `spelling` và `grammar`.
- **Optimization & UX Fix (GrammarTab)**:
  - Tránh re-scan toàn bộ sau khi Apply/Dismiss (giữ lại các lỗi cũ).
  - Tự động điều hướng (scroll + select) tới vị trí lỗi khi click vào card.
  - Cập nhật hash thủ công để tránh polling loop kích hoạt sai thời điểm.

## 2026-05-08
- 2026-05-08 [Module 1] docs: Khởi tạo project documentation theo workflow /init-project
- 2026-05-11 [Module 2] fix: Lỗi AI thực hiện lệnh cho toàn bộ văn bản thay vì đoạn bôi đen ở tab Kỹ Năng. Root cause: LLM bị nhiễu do frontend truyền toàn bộ văn bản vào tham số `context`, khiến AI ưu tiên xử lý (dịch/tóm tắt) phần context thay vì phần text được chọn. Đã fix bằng cách gỡ bỏ `context` khỏi payload của tab Kỹ Năng.
- 2026-05-11 [Module 2] fix: Lỗi tab Kỹ Năng bỏ qua system prompt của người dùng. Root cause: Hàm `analyzeRewrite` bị truyền thiếu tham số `context`, đẩy `skill.prompt` vào nhầm vị trí `context` thay vì `systemPrompt`. Đồng thời, cập nhật luôn sang Markdown để giữ định dạng gốc.
- 2026-05-11 [Module 2] fix: Lỗi Rewrite bị mất định dạng gốc. Root cause: Hàm `getSelectionAsPlainText` không lấy Markdown. Đã sửa bằng `getSelectionAsMarkdown` và `getDocAsMarkdown`.
- 2026-05-11 [Module 2] fix: UI Preview ở tab Viết Lại/Kỹ Năng không hiển thị đúng các ký tự xuống dòng. Root cause: HTML và Markdown mặc định xem ký tự `\n` đơn lẻ là khoảng trắng (space) thay vì xuống dòng `<br>`. Đã fix bằng cách thêm thuộc tính CSS `white-space: pre-wrap` vào class `.markdown-content p`.
- 2026-05-11 [Module 4] fix: Lỗi lệch vị trí highlight và apply đối với các từ nằm sau từ vừa được sửa trong cùng một đoạn văn. Root cause: Do độ dài từ thay thế khác với từ gốc (vd: "sai" -> "đúng", chênh 1 ký tự), dẫn đến tọa độ `range` của các lỗi phía sau bị sai lệch (stale state). Fix: Cập nhật hàm `handleApply` tự động tính toán `shift = new_length - old_length` và dịch chuyển tịnh tiến tọa độ của tất cả lỗi theo sau trong cùng block.
- 2026-05-08 [Module 2] docs: Completed module planning
- 2026-05-08 [Module 2] fix: Build failed with Tailwind CSS. Root cause: Missing Shadcn UI theme configuration and correct tailwind import. Fixed by updating `tailwind.config.js` and `index.css`.
- 2026-05-08 [Module 2] feat: Auto-detect selection using `onSelectionChange`.
- 2026-05-08 [Module 2] fix: RewriteTab initial selection not loading. Root cause: `docRef` was not ready when the component mounted. Fixed by delaying tab rendering until `docRef` is initialized in `App.tsx`.
- 2026-05-08 [Module 2] fix: Rewrite API call failing in local dev. Root cause: `process.env.BACKEND_URL` pointing to dead ngrok URL. Fixed by overriding to `localhost:3001` in local dev environment.
- 2026-05-08 [Module 3] docs: Completed module planning for Tùy chỉnh (Flexibility & Skills)
- 2026-05-08 [Module 3] feat: Implemented Skills CRUD UI with active/inactive toggle, icon picker, seeded defaults
- 2026-05-08 [Module 3] feat: Integrated active Skills as quick-action chips in Rewrite tab
- 2026-05-08 [Module 3] refactor: Unified "Preset" and "Skills" into single "Skills" concept
- 2026-05-08 [Module 3] fix: Corrected selection detection logic using `.trim()` to avoid misidentifying whitespace/newlines as active selection.
- 2026-05-08 [UI] fix: Custom scrollbar styling — thin, rounded, modern appearance
- 2026-05-08 [Module 3] fix: Chỉ thay thế được dòng đầu tiên khi bôi đen nhiều dòng (bullet points) — Root cause: Snapshot vùng chọn chỉ lấy block khởi đầu của Range. Đã sửa bằng cách quét qua toàn bộ selection elements.
