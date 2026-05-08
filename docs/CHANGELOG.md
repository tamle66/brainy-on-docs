# Changelog
Format: [date] [module] [type: feat/fix/refactor/docs] — description

## 2026-05-08
- docs: Khởi tạo project documentation theo workflow /init-project
- docs: Đã hoàn thành Module 1 (Lark Add-on Deployment)
- 2026-05-08 [Module 2] docs: Completed module planning
- 2026-05-08 [Module 2] fix: Build failed with Tailwind CSS. Root cause: Missing Shadcn UI theme configuration and correct tailwind import. Fixed by updating `tailwind.config.js` and `index.css`.
- 2026-05-08 [Module 2] feat: Auto-detect selection using `onSelectionChange`.
- 2026-05-08 [Module 2] fix: RewriteTab initial selection not loading. Root cause: `docRef` was not ready when the component mounted. Fixed by delaying tab rendering until `docRef` is initialized in `App.tsx`.
- 2026-05-08 [Module 2] fix: Rewrite API call failing in local dev. Root cause: `process.env.BACKEND_URL` pointing to dead ngrok URL. Fixed by overriding to `localhost:3001` in local dev environment.
