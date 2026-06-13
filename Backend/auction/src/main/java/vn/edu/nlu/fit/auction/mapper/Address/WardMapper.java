package vn.edu.nlu.fit.auction.mapper.Address;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.request.Address.WardRequest;
import vn.edu.nlu.fit.auction.dto.response.Address.WardResponse;
import vn.edu.nlu.fit.auction.entity.Ward;

@Mapper(componentModel = "spring")
public interface WardMapper {

    @Mapping(target = "wardId", ignore = true)
    @Mapping(target = "province", ignore = true)
    Ward toEntity(WardRequest request);

    @Mapping(source = "wardId", target = "id")
    @Mapping(source = "province.provinceId", target = "provinceId")
    @Mapping(source = "province.name", target = "provinceName")
    WardResponse toResponse(Ward ward);
    
}
