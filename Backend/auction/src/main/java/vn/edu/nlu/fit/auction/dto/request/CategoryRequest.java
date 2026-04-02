package vn.edu.nlu.fit.auction.dto.request;

import lombok.Data;

@Data
public class CategoryRequest {
    
    private String name;
    private Integer parentId;

}
