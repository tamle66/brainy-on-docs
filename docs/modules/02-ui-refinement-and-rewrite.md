# Module 02: UI Refinement & Core Rewrite Feature

## 1. Overview
- **Job to be done**: Nâng cấp giao diện người dùng (UI) cho Add-on Sidebar, đồng thời triển khai tính năng cốt lõi đầu tiên: Cho phép người dùng tô đen văn bản, sử dụng AI để viết lại (rewrite) dựa trên System Prompt tùy chỉnh, và áp dụng (thay thế) trực tiếp vào tài liệu Lark Docs.
- **User flow chính**:
  1. Người dùng thiết lập System Prompt (ví dụ: "Dịch sang tiếng Anh", "Viết lại chuyên nghiệp hơn") trong tab Cài đặt hoặc tab Viết lại.
  2. Người dùng bôi đen một đoạn văn bản trong Lark Docs.
  3. Mở Add-on, chuyển sang tab "Viết lại" (Rewrite).
  4. Bấm nút "Viết lại đoạn đã chọn". Add-on gọi backend gửi text + system prompt.
  5. AI xử lý và trả về kết quả.
  6. Người dùng xem trước kết quả và bấm "Áp dụng" (Replace) để thay thế đoạn văn bản đã chọn trong Lark Docs.
- **Dependencies**: Module 1 (Lark Add-on Deployment) đã hoàn thành.
- **Acceptance criteria**:
  - Giao diện Sidebar đẹp mắt, hiện đại, tuân thủ UI guidelines (Shadcn/UI, Tailwind).
  - Lấy được nội dung văn bản đang được bôi đen (selection) từ Lark Docs.
  - Người dùng có thể nhập và lưu trữ System Prompt (localStorage).
  - Tính năng "Áp dụng" có thể thay thế chính xác đoạn văn bản đã chọn.

## 2. UX/Shaping
- **Layout / Wireframe**:
  - **Header**: Tên Add-on "Brainy in Docs" + Trạng thái kết nối.
  - **Tab Navigation**: 3 Tabs chính: `Kiểm tra` (Grammar), `Viết lại` (Rewrite), `Cài đặt` (Settings).
  - **Tab Viết lại (Rewrite)**:
    - Khu vực hiển thị đoạn văn bản đang chọn (Read-only, max 3-4 dòng).
    - Textarea để người dùng tùy chỉnh System Prompt nhanh (hoặc tải từ Settings).
    - Nút chính: `Viết lại đoạn đã chọn` (Primary Button, có trạng thái Loading).
    - Khu vực kết quả: Hiển thị văn bản AI đã viết lại.
    - Hành động cho kết quả: `Áp dụng` (Primary), `Copy` (Outline), `Thử lại` (Ghost).
  - **Tab Cài đặt (Settings)**:
    - Quản lý các "System Prompts" mẫu. Lưu mặc định vào localStorage.
- **Edge cases**:
  - Người dùng không bôi đen văn bản: Hiển thị thông báo yêu cầu chọn văn bản.
  - Lỗi mạng / API timeout: Hiển thị Toast / Alert báo lỗi.
  - Đoạn văn quá dài: Giới hạn số từ / block để tránh vượt quá Rate Limit của Lark và AI.

## 3. Frontend Requirements
- **Danh sách Screens / Components**:
  - `AppLayout`: Layout chính bao gồm Header, Tabs, Content area.
  - `RewriteTab`: Component xử lý luồng viết lại.
  - `SettingsTab`: Component cho phép nhập và lưu System Prompt.
  - Components UI tái sử dụng (Shadcn/UI): `Button`, `Textarea`, `Tabs`, `Card`, `Skeleton` (cho loading state).
- **Trạng thái (States)**:
  - `selectionText`: Nội dung bôi đen hiện tại.
  - `systemPrompt`: Prompt tùy chỉnh, load từ localStorage.
  - `rewriteResult`: Kết quả từ AI.
  - `isLoading`: Trạng thái call API.
- **Lark Docs SDK Integration**:
  - Sử dụng API để lấy dữ liệu block đang được chọn (ví dụ: `getActiveDocumentRef().getSelection()`).
  - Sử dụng API để sửa nội dung của block (ví dụ: `ActiveDocument` methods).

## 4. Technical Specs
- **Backend API (`server.js`)**:
  - **Endpoint mới**: `POST /api/rewrite`
  - **Request Body**:
    ```json
    {
      "text": "Đoạn văn bản cần viết lại...",
      "systemPrompt": "Chỉ thị của người dùng (ví dụ: Dịch sang tiếng Anh)"
    }
    ```
  - **Response Body**:
    ```json
    {
      "rewritten_text": "Đoạn văn bản sau khi AI xử lý"
    }
    ```
- **AI Service (`aiService.js`)**:
  - Viết hàm `analyzeRewrite(text, systemPrompt)` gọi Gemini. Đưa `systemPrompt` thành `role: 'system'` hoặc chèn vào đầu prompt text.
- **Frontend Storage**:
  - Sử dụng `localStorage.setItem('lark_addon_system_prompt', ...)` để lưu.

## 5. Implementation Plan
### Các Tasks thực hiện (Mỗi task tương đương 1 session làm việc)
- [ ] **Task 1: Backend API Setup** — Cập nhật `aiService.js` và `server.js` để thêm endpoint `/api/rewrite` hỗ trợ system prompt tùy chỉnh. (Size: S)
- [ ] **Task 2: Frontend Foundation & State** — Cài đặt UI chuẩn với Shadcn (Tabs, Button, Textarea, Card) và tạo Tab `Settings` để quản lý `systemPrompt` (lưu localStorage). (Size: M)
- [ ] **Task 3: Lark SDK Integration (Get Selection)** — Cập nhật `RewriteTab` để đọc văn bản được bôi đen từ Lark Docs (cần research tài liệu API). (Size: M)
- [ ] **Task 4: AI Integration & UI Flow** — Kết nối Frontend gọi API backend, xử lý loading state và hiển thị kết quả. (Size: S)
- [ ] **Task 5: Lark SDK Integration (Replace Selection)** — Cập nhật `RewriteTab` để thêm chức năng "Áp dụng" - tự động thay thế văn bản bôi đen trong tài liệu. (Size: M)
