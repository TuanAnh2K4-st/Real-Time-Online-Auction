package vn.edu.nlu.fit.auction.dto.request.Admin.Category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCategoryRequest {

    private String name;
    private Integer parentId;

}
