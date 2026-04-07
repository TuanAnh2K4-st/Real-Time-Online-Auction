package vn.edu.nlu.fit.auction.service;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.WardRequest;
import vn.edu.nlu.fit.auction.dto.response.WardResponse;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.mapper.WardMapper;
import vn.edu.nlu.fit.auction.repository.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.WardRepository;

@Service
@RequiredArgsConstructor
public class WardService {
    
    private final WardRepository wardRepository;
    private final ProvinceRepository provinceRepository;
    private final WardMapper wardMapper;

    // CREATE
    public WardResponse create(WardRequest request) {

        Ward w = wardMapper.toEntity(request);

        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province not found"));

        w.setProvince(province);

        return wardMapper.toResponse(wardRepository.save(w));
    }

    // UPDATE
    public WardResponse update(Integer id, WardRequest request) {

        Ward w = wardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province not found"));

        w.setName(request.getName());
        w.setProvince(province);

        return wardMapper.toResponse(wardRepository.save(w));
    }

    // DELETE
    public void delete(Integer id) {
        wardRepository.deleteById(id);
    }

    // GET BY PROVINCE
    public List<WardResponse> getByProvince(Integer provinceId) {
        return wardRepository.findByProvince_ProvinceId(provinceId)
                .stream()
                .map(wardMapper::toResponse)
                .toList();
    }
    
}
