package vn.edu.nlu.fit.auction.dto.request.Admin.Store;

import lombok.*;
import vn.edu.nlu.fit.auction.enums.StoreStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStoreRequest {
    private String storeName;
    private StoreStatus status;
    private Integer provinceId;
    private Integer wardId;
    private String street;
}
