package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.request.CategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "categoryId", target = "id")
    @Mapping(target = "parentId",
        expression = "java(category.getParent() != null ? category.getParent().getCategoryId() : null)")
    CategoryResponse toDTO(Category category);

    @Mapping(target = "categoryId", ignore = true)
    @Mapping(target = "createAt", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "children", ignore = true)
    Category toEntity(CategoryRequest request);
    
}
