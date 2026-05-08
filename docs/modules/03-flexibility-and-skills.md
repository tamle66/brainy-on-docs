# Module 03: Tùy chỉnh (Flexibility & Skills)

## 1. Overview
- **Job to be done**: Cung cấp cho người dùng khả năng cá nhân hóa trải nghiệm với AI thông qua việc tạo và quản lý các "Skills" — các prompt tái sử dụng để biến đổi văn bản theo nhiều mục đích khác nhau (dịch thuật, tóm tắt, chuyên nghiệp hóa, v.v.).
- **Concept thống nhất**: Gộp "Preset" và "Skills" thành một khái niệm duy nhất: **Skills**. Mỗi Skill = tên + mô tả + icon + system prompt. Lý do: Skill mang tính hành động (bấm vào = chạy), phù hợp hơn Preset (thụ động, cần thêm bước).
- **User flow chính**:
  1. Tab **Skills**: Quản lý CRUD toàn bộ skills. Seed sẵn 6 skills mặc định. Có thể sửa/xóa/tạo mới. Toggle active/inactive.
  2. Tab **Viết lại**: Hiển thị tất cả active skills dưới dạng chip buttons. Bôi đen text → bấm skill → AI xử lý → xem kết quả.
  3. Tab **Cài đặt**: Giữ System Prompt chung cho nút "Viết lại đoạn này".
- **Dependencies**: Module 2 (Core Logic & UI Refinement).
- **Acceptance criteria**:
  - ✅ CRUD Skills hoàn chỉnh (Tạo, Đọc, Sửa, Xóa) trong tab Skills.
  - ✅ Toggle active/inactive cho mỗi skill.
  - ✅ Active skills hiển thị trong tab Viết lại dưới dạng quick-action chips.
  - ✅ Chạy skill = gọi API `/api/rewrite` với prompt của skill.
  - ✅ Dữ liệu lưu localStorage, seed defaults lần đầu.
  - ✅ Custom scrollbar đẹp mắt trên toàn ứng dụng.

## 2. Technical Design
- **Data Model**: `Skill { id, name, description, icon, prompt, isActive, isSeeded? }`
- **Storage**: `localStorage` key `lark_addon_skills`
- **API**: Tái sử dụng `POST /api/rewrite` — không cần endpoint mới
- **Components**:
  - `SkillsTab.tsx` — CRUD UI, active/inactive toggle, icon picker
  - `RewriteTab.tsx` — Hiển thị active skills dưới dạng chip buttons
  - `SettingsTab.tsx` — System Prompt chung
  - `App.tsx` — State management, truyền skills xuống các tab

## 3. Implementation Tasks
- [x] Task 0: Custom scrollbar CSS
- [x] Task 1: SkillsTab CRUD UI (create, edit, delete, toggle active/inactive)
- [x] Task 2: RewriteTab tích hợp active skills
- [x] Task 3: Dọn dẹp — xóa PresetManager, cập nhật SettingsTab & App

## 4. Testing Checklist
- [x] Build thành công (webpack --mode development)
- [ ] Tạo skill mới thành công
- [ ] Sửa / Xóa skill thành công
- [ ] Toggle active/inactive hoạt động
- [ ] Active skills hiển thị ở tab Viết lại
- [ ] Chạy skill trả về kết quả đúng
- [ ] Scrollbar hiển thị mịn, hiện đại

## 5. Post-Implementation Review
- **Completed date**: 2026-05-08
- **Deviations from plan**: Gộp Preset + Skills thành 1 concept "Skills" theo feedback của PO. Bỏ PresetManager riêng biệt.
- **Lessons learned**: Gộp concept sớm tránh phân tán UX. Skill as action > Preset as configuration.
