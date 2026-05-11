# Grammarly-like Add-on — Project Status
Last updated: 2026-05-08 (Module 04 Planned)

## Current Phase
Phase 2: Core Logic Implementation (Text Analysis & Auto-fix) — [Status: Planning]

## Modules Overview
| # | Module | Status | Branch | Notes |
|---|--------|--------|--------|-------|
| 1 | Lark Add-on Deployment | ✅ Done | main | Basic setup, UI manifest, and upload |
| 2 | Core Logic Implementation & UI Refinement | 📋 Planned | main | UI update, API rewrite integration, selection handling |
| 3 | Tùy chỉnh (Flexibility & Skills) | 📋 Planned | main | Presets management & Skills integration |
| 4 | Inline Suggestion (Typing Check) | ✅ Done | main | Real-time grammar/spelling detect khi đang gõ |

## Active Tasks
- [x] Task 1: Backend API Setup (Rewrite Endpoint) — Module 2
- [x] Task 2: Frontend Foundation & State (Settings, UI Tabs) — Module 2
- [x] Task 3: Lark SDK Integration (Get Selection & Context) — Module 2
- [x] Task 4: AI Integration & UI Flow (Rewrite) — Module 2
- [x] Task 5: Lark SDK Integration (Replace Selection) — Module 2
- [x] Task 1: SkillsTab CRUD UI — Module 3
- [x] Task 2: RewriteTab Skills Integration — Module 3
- [x] Task 3: Cleanup (Preset→Skills unification) — Module 3

  - [x] Module 04: Inline Suggestion & Grammar Analysis (Typing)
  - [x] Phân tích real-time (Debounce 1.5s)
  - [x] Highlight lỗi trực tiếp trong văn bản (native SDK)
  - [x] Quét song song (Parallel) & Hiển thị thời gian thực (Real-time update)
  - [x] Tối ưu hóa Token (Incremental block-level scanning)
  - [x] Điều hướng tới vị trí lỗi (Viewport navigation)
  - [x] Bỏ qua vĩnh viễn lỗi bằng LocalStorage (Persistent Ignore History)
  - [x] Tự động scroll và highlight Card theo vị trí con trỏ chuột

## 🚀 Sẵn sàng Deployment
- [x] Cấu hình Webpack linh hoạt cho production
- [x] Tài liệu hướng dẫn deploy Easypanel: [docs/03_DEPLOYMENT.md](file:///d:/04-Dev/grammarly-like/docs/03_DEPLOYMENT.md)

## Known Issues
- [ ] None currently

## Recent Changes
See CHANGELOG.md
