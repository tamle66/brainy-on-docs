PRD: Lark Grammar & Tone Checker (Add-on)

1. Tổng quan dự án (Project Overview)

Sản phẩm là một Lark Docs Add-on (Sidebar Widget) sử dụng AI để hỗ trợ người dùng kiểm tra lỗi chính tả, ngữ pháp và tối ưu hóa sắc thái văn bản (Tone of Voice) ngay trong quá trình soạn thảo trên Lark Docs.

Mục tiêu: Nâng cao chất lượng văn bản, đảm bảo sự chuyên nghiệp và đúng mực trong giao tiếp doanh nghiệp.

Đối tượng sử dụng: Nhân viên văn phòng, bộ phận nội dung, pháp chế, nhân sự.

2. Các tính năng chính (Key Features)

2.1. Phân tích Ngữ pháp & Chính tả (Grammar & Spelling)

Quét nội dung: Tự động hoặc thủ công lấy dữ liệu văn bản từ các block trong tài liệu.

Phát hiện lỗi: Xác định lỗi chính tả, dùng từ sai ngữ cảnh, câu văn lủng củng.

Gợi ý sửa đổi: Cung cấp lý do tại sao sai và đưa ra phương án thay thế chính xác.

Áp dụng nhanh: Người dùng nhấn "Chấp nhận" để tự động thay thế từ/câu sai trong tài liệu mà không cần gõ lại.

2.2. Phân tích & Đề xuất Sắc thái (Tone Analysis)

Nhận diện sắc thái: AI phân tích toàn bộ văn bản hoặc đoạn được chọn để xác định tone (ví dụ: Chuyên nghiệp, Thân thiện, Nghiêm túc, Cấp bách).

Điều chỉnh sắc thái: Cho phép người dùng chọn một "Sắc thái mục tiêu" (Target Tone). AI sẽ đề xuất viết lại các đoạn văn sao cho phù hợp với mục tiêu đó.

2.3. Tương tác Vùng chọn (Selection Sync)

Focus-on-click: Khi nhấn vào một thẻ lỗi ở Sidebar, con trỏ trong Lark Docs sẽ tự động di chuyển và bôi đen (Selection) đoạn văn bản chứa lỗi đó.

3. Kiến trúc kỹ thuật & API (Technical Architecture)

3.1. Các API Lark cần sử dụng

tt.onDocumentChange: Lắng nghe sự kiện người dùng thay đổi nội dung để kích hoạt quét (Cần dùng Debounce 2-3s).

tt.getBlocks / tt.getDocument: Lấy cấu trúc và nội dung văn bản hiện tại.

tt.setSelection: Điều hướng con trỏ người dùng đến vị trí lỗi.

batch_update (Server-side API): Thực hiện lệnh UpdateParagraphStyleRequest hoặc thay thế text bằng InsertTextRequest & DeleteContentRequest.

3.2. Luồng xử lý AI (AI Workflow)

Input: Đoạn văn bản (Text) + Ngôn ngữ (Language) + Sắc thái mục tiêu (Target Tone).

Engine: GPT-4o hoặc Claude 3.5 Sonnet.

Output Format (JSON): ```json
{
"errors": [
{
"original": "text_sai",
"replacement": "text_dung",
"reason": "Lý do sai...",
"block_id": "blk_xxxxx"
}
],
"overall_tone": "Professional",
"tone_score": 85
}




4. Giao diện người dùng (User Interface - Sidebar)

4.1. Tab "Kiểm tra" (Editor)

Danh sách lỗi: Hiển thị các thẻ (Card) lỗi. Mỗi thẻ gồm:

Nội dung gốc (gạch chéo).

Nội dung gợi ý (màu xanh).

Nút "Sửa" (Apply).

Trạng thái quét: Hiển thị "Đang phân tích..." khi AI đang xử lý.

4.2. Tab "Sắc thái" (Tone)

Dashboard: Biểu đồ hiển thị sắc thái hiện tại của văn bản.

Dropdown: Chọn sắc thái muốn chuyển đổi (ví dụ: Sang "Thân thiện hơn").

Nút "Viết lại": AI sẽ generate lại phiên bản mới cho đoạn văn được chọn.

5. Ràng buộc & Giới hạn (Constraints)

Rate Limit: Lark giới hạn 3 requests/giây. Hệ thống phải gom các lệnh sửa lỗi vào một lệnh batch_update duy nhất.

Phạm vi: Add-on không can thiệp vào các block dạng Table hoặc Image (chỉ tập trung vào Paragraph/Text).

Quyền hạn (Scopes): Cần quyền drive:document và drive:document:readonly.

6. Kế hoạch triển khai (Phasing)

Giai đoạn 1 (MVP): Kiểm tra lỗi chính tả/ngữ pháp cơ bản + Nút "Sửa nhanh" bằng batch_update.

Giai đoạn 2: Tích hợp tính năng nhận diện Tone và gợi ý viết lại văn bản theo sắc thái.

Giai đoạn 3: Tối ưu hóa hiệu suất (Debounce, Caching kết quả AI để giảm chi phí).