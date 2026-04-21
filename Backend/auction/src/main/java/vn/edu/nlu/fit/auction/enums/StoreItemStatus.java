package vn.edu.nlu.fit.auction.enums;

public enum StoreItemStatus {
    PENDING, // user gửi yêu cầu
    SHIPPING, // đang vận chuyển tới kho
    RECEIVED, // store đã nhận
    APPROVED, // đạt kiểm định
    REJECTED, // không đạt kiểm định
    IN_AUCTION, // đang trong quá trình đấu giá
    SOLD // Sản phẩm đã bán
}
