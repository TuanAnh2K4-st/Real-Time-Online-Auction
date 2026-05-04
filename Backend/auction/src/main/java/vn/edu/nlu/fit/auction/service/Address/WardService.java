package vn.edu.nlu.fit.auction.service.Address;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Address.WardResponse;
import vn.edu.nlu.fit.auction.mapper.Address.WardMapper;
import vn.edu.nlu.fit.auction.repository.Address.WardRepository;

@Service
@RequiredArgsConstructor
public class WardService {
    
    private final WardRepository wardRepository;
    private final WardMapper wardMapper;

    // chức năng lấy danh sách ward theo provinceId
    public List<WardResponse> getByProvince(Integer provinceId) {
        return wardRepository.findByProvince_ProvinceId(provinceId)
                .stream()
                .map(wardMapper::toResponse)
                .toList();
    }
    
}
