package vn.edu.nlu.fit.auction.dto.request.Admin.Store;

import lombok.*;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterStoreRequest {
    private String storeName;
    private StoreStatus status;
}
