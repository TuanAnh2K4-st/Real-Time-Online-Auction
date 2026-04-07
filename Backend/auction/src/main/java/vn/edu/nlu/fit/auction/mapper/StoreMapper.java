package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.entity.Store;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StoreMapper {

    @Mapping(source = "address.street", target = "street")
    @Mapping(source = "address.province.name", target = "provinceName")
    @Mapping(source = "address.ward.name", target = "wardName")
    StoreResponse toResponse(Store store);
    
}
