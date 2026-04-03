package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.request.ProvinceRequest;
import vn.edu.nlu.fit.auction.dto.response.ProvinceResponse;
import vn.edu.nlu.fit.auction.entity.Province;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
    
    @Mapping(target = "provinceId", ignore = true)
    Province toEntity(ProvinceRequest request);

    @Mapping(source = "provinceId", target = "id")
    ProvinceResponse toResponse(Province province);
    
}
