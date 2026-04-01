package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.request.CategoryRequest;
import vn.edu.nlu.fit.auction.dto.response.CategoryResponse;
import vn.edu.nlu.fit.auction.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    // @Mapping(target = "categoryId", ignore = true)
    // Category toEntity(CategoryRequest request);
    
    // @Mapping(source = "categoryId", target = "id")
    // @Mapping(source = "name", target = "name")
    // @Mapping(source = "parentId", target = "parentId")
    // CategoryResponse toResponse(Category category);

}
