package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import vn.edu.nlu.fit.auction.dto.request.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.BusinessResponse;
import vn.edu.nlu.fit.auction.entity.Business;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BusinessMapper {

    // update
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBusiness(@MappingTarget Business business, UpdateBusinessRequest req);

    //  response
    @Mapping(source = "address.street", target = "street")
    @Mapping(source = "address.province.name", target = "provinceName")
    @Mapping(source = "address.ward.name", target = "wardName")
    BusinessResponse toResponse(Business business);

} 