# Changelog
Format: [date] [module] [type: feat/fix/refactor/docs] — description

## [1.1.5] - 2026-05-08
### Added
- **Module 04: Inline Suggestion**:
  - Tự động phát hiện lỗi typing/grammar sau khi dừng gõ 1.5s.
  - Hiển thị danh sách Suggestion Cards trong tab "Kiểm tra".
  - Tự động highlight màu vàng + underline các từ lỗi trực tiếp trong Lark Docs dùng native SDK API.
  - Hỗ trợ Apply (sửa trực tiếp vào doc) và Dismiss (ẩn highlight/card).
  - Layout 4 tabs mới: Viết lại, Kiểm tra, Kỹ năng, Cài đặt.
  - Backend: Phân loại lỗi thành `spelling` và `grammar`.
- **Optimization & UX Fix (GrammarTab)**:
  - Tránh re-scan toàn bộ sau khi Apply/Dismiss (giữ lại các lỗi cũ).
  - Tự động điều hướng (scroll + select) tới vị trí lỗi khi click vào card.
  - Cập nhật hash thủ công để tránh polling loop kích hoạt sai thời điểm.

## 2026-05-08
- docs: Khởi tạo project documentation theo workflow /init-project
- docs: Đã hoàn thành Module 1 (Lark Add-on Deployment)
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
