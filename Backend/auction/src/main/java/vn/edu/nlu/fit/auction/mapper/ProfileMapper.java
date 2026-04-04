package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import vn.edu.nlu.fit.auction.dto.request.UpdateProfileRequest;
import vn.edu.nlu.fit.auction.dto.response.ProfileResponse;
import vn.edu.nlu.fit.auction.entity.Profile;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProfileMapper {
    
    // update
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfile(@MappingTarget Profile profile, UpdateProfileRequest req);

    // entity -> response
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "address.street", target = "street")
    @Mapping(source = "address.province.name", target = "provinceName")
    @Mapping(source = "address.ward.name", target = "wardName")
    ProfileResponse toResponse(Profile profile);

}
