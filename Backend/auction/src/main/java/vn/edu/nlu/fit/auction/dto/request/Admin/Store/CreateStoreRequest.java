package vn.edu.nlu.fit.auction.dto.request.Admin.Store;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStoreRequest {
    private String storeName;
    private Integer provinceId;
    private Integer wardId;
    private String street;
}
