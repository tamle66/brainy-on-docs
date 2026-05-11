# Module 05: Dynamic Size Toggle (Tính năng thu phóng Add-on)

## 1. Overview
Do tính năng native resize (`resizeType: Free` hoặc `Horizontal`) không hoạt động ổn định trên môi trường thực tế (drag edge không nhận), chúng ta cần một giải pháp thay thế.
Module này sẽ thêm một nút (Toggle Button) trên giao diện Frontend để gọi SDK API `DocMiniApp.Bridge.updateResize()` nhằm thay đổi kích thước của Sidebar giữa 2 chế độ:
- Chế độ "Vừa" (Standard): Width 350px (dành cho việc đọc văn bản thông thường, tiết kiệm diện tích).
- Chế độ "Rộng" (Wide): Width 450px (hoặc rộng hơn, dành cho việc xem bảng biểu, text comparison, config skills...).

## 2. UX/Shaping
- **Vị trí nút bấm**: Nằm ở góc trên bên phải (cạnh tab Settings hoặc bên trong Header). Một biểu tượng Expand/Shrink (ví dụ `Maximize` / `Minimize` icon).
- **Hành vi**:
  - Khi click vào nút: Gọi API đổi Width sang 450. Icon chuyển thành thu nhỏ (Shrink).
  - Khi click lần nữa: Gọi API đổi Width về 350. Icon chuyển thành phóng to (Expand).
  - Tooltip: "Mở rộng giao diện" / "Thu gọn giao diện".
- **Lưu trữ trạng thái**: Lưu trạng thái vào `localStorage` (`lark_addon_is_wide_mode`) để ghi nhớ tùy chọn của người dùng trong các lần mở doc tiếp theo.

## 3. Frontend Requirements
**Component: `SizeToggleBtn`**
- Vị trí: Đặt bên cạnh `TabsList` (có thể cần thay đổi `grid-cols-4` hoặc thu hẹp tab một chút để nhường chỗ cho nút thu/phóng).
- Icon: Sử dụng `Maximize2` và `Minimize2` từ `lucide-react`.
- UI: Nút IconButton nhỏ gọn, màu sắc hài hòa với Header.
- State: `isWideMode` (boolean).

## 4. Technical Specs
- **API sử dụng**: `@lark-opdev/block-docs-addon-api` -> `DocMiniApp.Bridge.updateResize({ width: number, height: number })`
  - Standard Mode: `{ width: 350, height: 500 }` (Hoặc chỉ update width, giữ nguyên height theo `initialHeight` nếu không cần đổi height).
  - Wide Mode: `{ width: 450, height: 600 }`
- **State Management**: React `useState` kết hợp `useEffect` để load/save từ `localStorage`.

## 5. Implementation Plan
- [ ] Task 1: Tạo UI nút Toggle Size cạnh các Tabs. — Est: Size S
- [ ] Task 2: Implement logic thay đổi trạng thái và lưu `localStorage`. — Est: Size S
- [ ] Task 3: Kết nối với `DocMiniApp.Bridge.updateResize()` để thay đổi kích thước thực tế. — Est: Size S
