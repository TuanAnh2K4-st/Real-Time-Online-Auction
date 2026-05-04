package vn.edu.nlu.fit.auction.mapper.Auth;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterSellerRequest;
import vn.edu.nlu.fit.auction.dto.request.Auth.RegisterUserRequest;
import vn.edu.nlu.fit.auction.entity.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    // mapping for creating user from user registration request
    User toRegisterUser(RegisterUserRequest req);

    // mapping for creating user from seller registration request
    User toRegisterSeller(RegisterSellerRequest req);

}
