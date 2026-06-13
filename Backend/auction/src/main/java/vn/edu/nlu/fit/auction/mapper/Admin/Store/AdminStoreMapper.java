package vn.edu.nlu.fit.auction.mapper.Admin.Store;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import vn.edu.nlu.fit.auction.dto.response.Admin.Store.AdminStoreResponse;
import vn.edu.nlu.fit.auction.entity.Store;

@Mapper(componentModel = "spring")
public interface AdminStoreMapper {

    @Mapping(target = "status", source = "store.storeStatus")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "totalItems", source = "totalItems")
    AdminStoreResponse toResponse(Store store,String address,Integer totalItems);
    
}