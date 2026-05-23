package vn.edu.nlu.fit.auction.dto.request.Address;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressRequest {

    private String street;
    private Integer provinceId;
    private Integer wardId;
    
}
