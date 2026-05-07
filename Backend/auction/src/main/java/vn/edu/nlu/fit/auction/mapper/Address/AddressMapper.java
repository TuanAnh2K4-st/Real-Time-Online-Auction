package vn.edu.nlu.fit.auction.mapper.Address;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import vn.edu.nlu.fit.auction.dto.request.Order.PaymentRequest;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.repository.Address.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.Address.WardRepository;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class AddressMapper {

    @Autowired
    protected ProvinceRepository provinceRepository;

    @Autowired
    protected WardRepository wardRepository;

    @Mapping(target = "addressId", ignore = true)
    @Mapping(target = "street", source = "street")
    @Mapping(target = "province", expression = "java(getProvince(request.getProvinceId()))")
    @Mapping(target = "ward", expression = "java(getWard(request.getWardId()))")
    public abstract Address toAddress( PaymentRequest request);

    protected Province getProvince(Integer provinceId) {
        return provinceRepository.findById(provinceId).orElseThrow(() ->
                        new RuntimeException("Province không tìm thấy"));
    }

    protected Ward getWard(Integer wardId) {
        return wardRepository.findById(wardId).orElseThrow(() ->
                        new RuntimeException("Ward không tìm thấy"));
    }

}
