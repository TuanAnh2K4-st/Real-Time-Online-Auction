package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import vn.edu.nlu.fit.auction.dto.request.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.RegisterUserRequest;
import vn.edu.nlu.fit.auction.dto.request.UpdateUserRequest;
import vn.edu.nlu.fit.auction.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    // USER REGISTER
    User toRegisterUser(RegisterUserRequest req);

    // SELLER REGISTER
    @Mapping(source = "companyName", target = "username")
    User toRegisterSeller(RegisterSellerRequest req);

    // update user từ request
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUser(@MappingTarget User user, UpdateUserRequest request);
    
}
