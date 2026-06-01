package vn.edu.nlu.fit.auction.dto.response.Admin.Category;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCategoryResponse {

    private Integer categoryId;
    private String name;
    private LocalDateTime createAt;
    private ParentCategoryResponse parent;
    private List<Integer> childrenIds;
    
}
