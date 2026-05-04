package vn.edu.nlu.fit.auction.service.Address;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Address.ProvinceResponse;
import vn.edu.nlu.fit.auction.mapper.Address.ProvinceMapper;
import vn.edu.nlu.fit.auction.repository.Address.ProvinceRepository;

@Service
@RequiredArgsConstructor
public class ProvinceService {
    
    private final ProvinceRepository provinceRepository;
    private final ProvinceMapper provinceMapper;

    // chức nang lấy tất cả tỉnh thành phố
    public List<ProvinceResponse> getAll() {
        return provinceRepository.findAll()
                .stream()
                .map(provinceMapper::toResponse)
                .toList();
    }

}
