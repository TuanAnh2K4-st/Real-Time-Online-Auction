package vn.edu.nlu.fit.auction.dto.response.Admin.Category;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentCategoryResponse {

    private Integer categoryId;
    private String name;

}
