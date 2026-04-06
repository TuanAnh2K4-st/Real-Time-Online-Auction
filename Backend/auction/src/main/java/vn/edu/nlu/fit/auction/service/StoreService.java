package vn.edu.nlu.fit.auction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateStoreRequest;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Province;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.entity.Ward;
import vn.edu.nlu.fit.auction.enums.StoreStatus;
import vn.edu.nlu.fit.auction.mapper.StoreMapper;
import vn.edu.nlu.fit.auction.repository.AddressRepository;
import vn.edu.nlu.fit.auction.repository.ProvinceRepository;
import vn.edu.nlu.fit.auction.repository.StoreRepository;
import vn.edu.nlu.fit.auction.repository.WardRepository;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;
    private final AddressRepository addressRepository;

    // Lấy danh sách store đang active 
    public List<StoreResponse> getActiveStores() {
        return storeRepository.findByStoreStatus(StoreStatus.ACTIVE)
                              .stream()
                              .map(storeMapper::toResponse)
                              .collect(Collectors.toList());
    }

    // Tạo store mới (có kèm address)
    public StoreResponse createStore(CreateStoreRequest request) {
        // Lấy Province + Ward từ DB
        Province province = provinceRepository.findById(request.getAddress().getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province không tồn tại"));

        Ward ward = wardRepository.findById(request.getAddress().getWardId())
                .orElseThrow(() -> new RuntimeException("Ward không tồn tại"));

        // Tạo Address
        Address address = new Address();
        address.setStreet(request.getAddress().getStreet());
        address.setProvince(province);
        address.setWard(ward);
        addressRepository.save(address);

        // Tạo Store
        Store store = new Store();
        store.setStoreName(request.getStoreName());
        store.setStoreStatus(StoreStatus.ACTIVE);
        store.setAddress(address);
        storeRepository.save(store);

        // Map sang response
        return storeMapper.toResponse(store);
    }
    
}
