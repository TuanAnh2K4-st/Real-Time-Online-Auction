package vn.edu.nlu.fit.auction.mapper.Profile;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.edu.nlu.fit.auction.dto.request.Profile.UpdateBusinessRequest;
import vn.edu.nlu.fit.auction.dto.response.Profile.BusinessResponse;
import vn.edu.nlu.fit.auction.entity.Business;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BusinessMapper {

    // mapping for update
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBusiness(@MappingTarget Business business, UpdateBusinessRequest req);

    // mapping for response
    BusinessResponse toResponse(Business business);

} 