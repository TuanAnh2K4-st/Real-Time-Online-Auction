package vn.edu.nlu.fit.auction.service;

import java.util.List;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.ProvinceRequest;
import vn.edu.nlu.fit.auction.dto.response.ProvinceResponse;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.mapper.ProvinceMapper;
import vn.edu.nlu.fit.auction.repository.ProvinceRepository;

@Service
@RequiredArgsConstructor
public class ProvinceService {
    
    private final ProvinceRepository provinceRepository;
    private final ProvinceMapper provinceMapper;

    // CREATE
    public ProvinceResponse create(ProvinceRequest request) {
        Province province = provinceMapper.toEntity(request);
        Province saved = provinceRepository.save(province);
        return provinceMapper.toResponse(saved); // 🔥 QUAN TRỌNG
    }

    // UPDATE
    public ProvinceResponse update(Integer id, ProvinceRequest request) {
        Province p = provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Province not found"));

        p.setName(request.getName());
        return provinceMapper.toResponse(provinceRepository.save(p));
    }

    // DELETE
    public void delete(Integer id) {
        provinceRepository.deleteById(id);
    }

    // GET ALL
    public List<ProvinceResponse> getAll() {
        return provinceRepository.findAll()
                .stream()
                .map(provinceMapper::toResponse)
                .toList();
    }
}
