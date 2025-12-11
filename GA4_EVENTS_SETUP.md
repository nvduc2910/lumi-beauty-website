# Hướng Dẫn Setup GA4 Events cho Lumi Beauty

## ✅ Đã Hoàn Thành

Đã setup thành công tất cả các event GA4 theo yêu cầu. File tracking chính: `/js/ga4-events.js`

## 📋 Danh Sách Events Đã Setup

### 1. Event Nền Tảng – PHẢI CÓ ✅

- ✅ **page_view_enhanced**: Tự động track khi trang load (enhanced với page_path, page_title, page_referrer)
  - ⚠️ Lưu ý: Dùng `page_view_enhanced` để tránh trùng với GA4 default `page_view`
- ✅ **scroll**: Track khi user cuộn > 90% trang (chỉ track 1 lần)
- ✅ **view_search_results**: Function `window.trackGASearchResults(query)` - gọi khi có search

### 2. Event Cho Trang Dịch Vụ ✅

Các event này tự động track khi user vào trang dịch vụ (có `/services/` trong URL):

- ✅ **view_service**: Track khi mở trang chi tiết dịch vụ
- ✅ **view_pricing**: Track khi user xem bảng giá (Intersection Observer)
- ✅ **view_gallery**: Track khi user xem gallery trước-sau (Intersection Observer + click images)
- ✅ **view_reviews**: Track khi user xem đánh giá khách hàng (Intersection Observer)

### 3. Event Cho CTA (Rất Quan Trọng) ✅

- ✅ **click_call**: Track khi click nút gọi điện (`tel:` links) - **chỉ 1 lần/session**
- ✅ **click_zalo**: Track khi click icon/link Zalo - **chỉ 1 lần/session**
- ✅ **click_messenger**: Track khi click icon/link Messenger/Facebook - **chỉ 1 lần/session**
- ✅ **click_book**: Track khi click nút "Đặt lịch" (cả popup và button)
- ✅ **click_map**: Track khi xem bản đồ hoặc click địa chỉ/chỉ đường

### 4. Event Đặt Lịch – Quan Trọng Nhất ✅

Tracking form booking (`#bookingModal`):

- ✅ **begin_checkout**: Track khi mở modal booking (optimized với debounce)
- ✅ **add_contact_info**: Track khi nhập tên hoặc số điện thoại
- ✅ **add_appointment_time**: Track khi chọn ngày giờ
- ✅ **book_appointment**: Track khi submit form thành công (CONVERSION EVENT)
- ✅ **form_error**: Track lỗi validation form (để debug chuyển đổi)

### 5. Event Cho Form Liên Hệ / Tư Vấn ✅

Tracking các form contact/consultation:

- ✅ **form_start**: Track khi bắt đầu điền form (focus vào field đầu tiên)
- ✅ **form_complete**: Track khi điền xong 100% các field required
- ✅ **generate_lead**: Track khi submit form thành công (Lead event - chuẩn GA4)
- ✅ **form_error**: Track lỗi validation form (để debug chuyển đổi)

## 🚀 Cách Sử Dụng

### Đã Tích Hợp Tự Động

Tất cả events đã được tích hợp tự động vào tất cả các trang HTML. Script được load sau Facebook Pixel:

```html
<script src="/js/ga4-events.js" defer></script>
```

### Tracking Search (Nếu Có)

Nếu bạn muốn track search, gọi function:

```javascript
// Khi user search dịch vụ
window.trackGASearchResults("phun môi collagen");
```

## 📊 Kiểm Tra Events Trong GA4

1. Vào **Google Analytics 4**
2. Chọn property của bạn
3. Vào **Reports** → **Engagement** → **Events**
4. Hoặc vào **DebugView** để xem real-time events

## 🔍 Debug

Mở **Console** (F12) để xem log của events:

```
[GA4 Event] page_view {page_path: "/vi/services/phun-moi-collagen.html", ...}
[GA4 Event] click_book {page_path: "/vi/services/phun-moi-collagen.html", ...}
```

## ⚙️ Customization

### Thêm Parameters Cho Events

Bạn có thể customize events bằng cách sửa file `/js/ga4-events.js`. Tất cả events đều gửi qua function `trackEvent()`.

### Conversion Event (book_appointment)

Event `book_appointment` đã được mark là conversion event. Để setup trong GA4:

1. Vào **GA4 Admin** → **Events**
2. Tìm event `book_appointment`
3. Mark nó là **Mark as conversion**

## 📝 Notes

- Tất cả events đều gửi kèm `page_path` và `page_title` để dễ phân tích
- Intersection Observer được dùng để track khi user scroll đến section (tiết kiệm performance)
- Events chỉ track một lần cho mỗi action (tránh duplicate)
- Booking form tracking tự động reset khi modal đóng/mở lại

## 🎯 Event Mapping Cho Meta Ads

Các event sau rất hữu ích để tối ưu Meta Ads:

- `click_call`, `click_zalo`, `click_messenger` → CTA events
- `view_service`, `view_pricing`, `view_gallery` → Engagement events
- `begin_checkout`, `add_contact_info`, `book_appointment` → Conversion funnel

## ✅ Checklist

- [x] File `/js/ga4-events.js` đã tạo
- [x] Script đã thêm vào tất cả HTML pages (28 files)
- [x] Tất cả events đã được implement
- [x] Console logging để debug
- [x] Intersection Observer cho scroll/view tracking
- [x] Form tracking cho booking và contact forms
- [x] CTA click tracking cho tất cả buttons
- [x] **Cải thiện**: `page_view` → `page_view_enhanced` (tránh double tracking)
- [x] **Cải thiện**: CTA events chỉ track 1 lần/session (dùng data attribute flag)
- [x] **Cải thiện**: MutationObserver được optimize với debounce (150ms)
- [x] **Cải thiện**: Bỏ `submit_contact_form`, chỉ dùng `generate_lead` (GA4 chuẩn)
- [x] **Cải thiện**: Thêm `form_error` tracking để debug chuyển đổi

## 🔗 File Locations

- Main tracking script: `/js/ga4-events.js`
- Script được thêm vào tất cả HTML files sau `facebook-pixel.js`

---

**Cần hỗ trợ?** Kiểm tra console logs hoặc contact developer để debug.
