package vn.edu.nlu.fit.auction.dto.request.Auction;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class AuctionNormalFilterRequest {
    // tìm theo tên
    private String keyword;
    // category id
    private Integer categoryId;
    // giá từ
    private BigDecimal minPrice;
    // giá đến
    private BigDecimal maxPrice;
    // sắp xếp
    private String sortBy;
}
