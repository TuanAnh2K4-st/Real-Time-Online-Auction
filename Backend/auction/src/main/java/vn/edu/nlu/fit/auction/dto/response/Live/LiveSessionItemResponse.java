package vn.edu.nlu.fit.auction.dto.response.Live;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveSessionItemResponse {

    private Integer productId;
    private String productName;
    private String imageUrl;
    private String storeName;
    private BigDecimal startPrice;
    private BigDecimal stepPrice;
    private Integer durationMinutes;
    private Integer gapMinutes;
}
