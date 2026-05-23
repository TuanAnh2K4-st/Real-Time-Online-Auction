package vn.edu.nlu.fit.auction.dto.response.Admin.Store;

import java.time.LocalDateTime;

import lombok.*;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStoreResponse {
    private Integer storeId;
    private String storeName;
    private LocalDateTime createdAt;
    private String address;
    private Integer totalItems;
    private StoreStatus status;
}
