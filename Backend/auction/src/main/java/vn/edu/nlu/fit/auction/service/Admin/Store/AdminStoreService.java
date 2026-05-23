package vn.edu.nlu.fit.auction.service.Admin.Store;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Address.AddressRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Store.CreateStoreRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Store.UpdateStoreRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Store.AdminStoreResponse;
import vn.edu.nlu.fit.auction.entity.Address;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.Store.AdminStoreMapper;
import vn.edu.nlu.fit.auction.repository.Store.StoreRepository;
import vn.edu.nlu.fit.auction.service.Address.AddressService;

@Service
@RequiredArgsConstructor
public class AdminStoreService {

    private final StoreRepository storeRepository;
    private final AdminStoreMapper adminStoreMapper;
    private final AddressService addressService;

    public List<AdminStoreResponse> getStores(String storeName, StoreStatus status) {

        Specification<Store> specification = StoreSpecification.filterStores(storeName,status);

        List<Store> stores = storeRepository.findAll(specification);

        return stores.stream().map(store -> {

                    String address = store.getAddress() != null
                                    ? store.getAddress().getFullAddress()
                                    : null;

                    Integer totalItems = store.getStoreItems() != null
                                    ? store.getStoreItems().size()
                                    : 0;

                    return adminStoreMapper.toResponse(store, address, totalItems);
                }).toList();
    }

    public void createStore( CreateStoreRequest request) {

        AddressRequest addressRequest = AddressRequest.builder()
                        .provinceId(request.getProvinceId())
                        .wardId(request.getWardId())
                        .street(request.getStreet())
                        .build();

        Address address = addressService.create(addressRequest);

        Store store = Store.builder()
                        .storeName(request.getStoreName())
                        .address(address)
                        .storeStatus(StoreStatus.ACTIVE)
                        .build();

        storeRepository.save(store);
    }

    public void updateStore(Integer storeId, UpdateStoreRequest request) {

        Store store = storeRepository.findById(storeId).orElseThrow(() ->
                        new RuntimeException( "Store không tồn tại"));

        AddressRequest addressRequest = AddressRequest.builder()

                        .provinceId(request.getProvinceId())
                        .wardId(request.getWardId())
                        .street(request.getStreet())
                        .build();

        Address updatedAddress = addressService.update( store.getAddress().getAddressId(), addressRequest);

        store.setStoreName(request.getStoreName());
        store.setStoreStatus(request.getStatus());
        store.setAddress(updatedAddress );
        storeRepository.save(store);
    }
    
}