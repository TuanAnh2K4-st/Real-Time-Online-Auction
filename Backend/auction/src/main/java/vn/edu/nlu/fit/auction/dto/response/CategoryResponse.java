package vn.edu.nlu.fit.auction.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {

    private Integer id;
    private String name;
    private Integer parentId;

}
