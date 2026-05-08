# Module 04: Inline Suggestion — Phát hiện lỗi ngay khi đang gõ

## 1. Overview
- **Goal**: Tự động phát hiện lỗi typing/grammar ngay khi người dùng dừng gõ (debounce 1.5s), hiển thị Suggestion Cards trong sidebar. Người dùng apply/dismiss từng suggestion — trải nghiệm Grammarly.
- **Scope**:
  - In-scope: Tab "Kiểm tra" mới, polling doc text, AI grammar check, apply/dismiss per error.
  - Out-of-scope: Inline underline highlight trực tiếp trong editor (Lark SDK không hỗ trợ), persistent error history.

## 2. Requirements (Acceptance Criteria)
- [x] Sidebar tự động phân tích sau khi người dùng dừng gõ ≥ 1.5s (debounce)
- [x] Hiển thị danh sách lỗi: từ sai → gợi ý đúng + lý do + phân loại (spelling/grammar)
- [x] Nút "Áp dụng" replace đúng từ sai trong tài liệu
- [x] Nút "Bỏ qua" dismiss suggestion trong session
- [x] Status bar: watching / analyzing / done / error
- [x] Loading skeleton khi đang analyze
- [x] Empty state: không lỗi / chưa có nội dung
- [x] Error state khi API fail + nút Retry

## 3. UI/UX & API Specs

### 3.1 Wireframe
```
Tab: KIỂM TRA
─────────────────────────────────────
🟢 Đang theo dõi... | ✅ 14:32
─────────────────────────────────────
2 lỗi được phát hiện

┌─────────────────────────────────┐
│ ✏️  Lỗi chính tả               │
│  "tôi" → "Tôi"                 │
│  Lý do: Đầu câu cần viết hoa.  │
│  [Áp dụng]        [Bỏ qua]     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📝 Lỗi ngữ pháp                │
│  "đi học" → "đến trường"       │
│  Lý do: Từ dùng chưa chuẩn.    │
│  [Áp dụng]        [Bỏ qua]     │
└─────────────────────────────────┘

[🔄 Kiểm tra lại ngay]
```

### 3.2 Tab Navigation (App.tsx)
Thay tab "Kỹ năng" bằng tab "Kiểm tra":
```
[Viết lại] [Kiểm tra] [⚙️]
```
> Skills vẫn accessible qua tab Settings.

### 3.3 API — Reuse + Extend
```
POST /api/analyze-grammar
Body: { "text": "...", "language": "vi" }
Response: {
  "errors": [
    {
      "original": "từ sai",
      "replacement": "từ đúng",
      "reason": "Giải thích",
      "type": "spelling" | "grammar"  ← THÊM MỚI
    }
  ]
}
```

### 3.4 Frontend State Shape
```typescript
interface GrammarError {
  id: string;            // uuid để track dismiss
  original: string;
  replacement: string;
  reason: string;
  type: 'spelling' | 'grammar';
}
// status: 'idle' | 'watching' | 'analyzing' | 'done' | 'error'
```

### 3.5 Polling Strategy
- Interval: 5s
- Debounce: 1.5s sau khi detect thay đổi (hash compare)
- Chỉ gọi AI khi text thực sự thay đổi

## 4. Implementation Plan

### Phase 1: Backend
- [x] Task 1: Cập nhật prompt `analyzeGrammar()` để trả thêm field `type` — (Size: S)

### Phase 2: Frontend Services
- [x] Task 2: `grammarService.ts` (checkGrammar) + `docService.ts` (getDocumentText, hashText) + unit tests — (Size: S)

### Phase 3: UI Components
- [x] Task 3: `SuggestionCard.tsx` — 2 variants spelling/grammar, animate dismiss — (Size: S)
- [x] Task 4: `GrammarTab.tsx` — polling + debounce + state + list render — (Size: M)
- [x] Task 5: Apply logic — SDK find-replace hoặc clipboard fallback — (Size: M)

### Phase 4: Integration
- [x] Task 6: App.tsx tab update + StatusBar + EmptyState + upload v1.1.5 — (Size: S)

## 5. Testing Checklist
- [ ] Unit test: `analyzeGrammar()` trả về field `type`
- [ ] Unit test: `checkGrammar()` service với mocked API
- [ ] Unit test: `SuggestionCard` renders đúng cả 2 variants
- [ ] Manual: Gõ text lỗi → suggestions hiện sau 1.5s
- [ ] Manual: Click "Áp dụng" → từ được replace trong doc
- [ ] Manual: Click "Bỏ qua" → card ẩn, không hiện lại

## 6. Post-Implementation Review
- **Completed date**: TBD
- **Deviations from plan**: TBD
- **Lessons learned**: TBD
