package vn.edu.nlu.fit.auction.dto.request.Admin.Category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterCategoryRequest {

    private String keyword;
    private String type;

}
