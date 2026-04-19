package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;

@Data
public class FilterProduct {
    
    private String productName;
    private StoreItemStatus itemStatus;

}
