package vn.edu.nlu.fit.auction.dto.request.Admin.Category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCategoryRequest {

    private String name;
    private Integer parentId;

}