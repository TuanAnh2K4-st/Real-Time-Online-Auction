package vn.edu.nlu.fit.auction.service.Admin.Store;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.Admin.Store.AdminStoreResponse;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.enums.StoreStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.Store.AdminStoreMapper;
import vn.edu.nlu.fit.auction.repository.Store.StoreRepository;

@Service
@RequiredArgsConstructor
public class AdminStoreService {

    private final StoreRepository storeRepository;
    private final AdminStoreMapper adminStoreMapper;

    public List<AdminStoreResponse> getStores(String storeName, StoreStatus status) {

        Specification<Store> specification = StoreSpecification.filterStores(storeName,status);

        List<Store> stores = storeRepository.findAll(specification);

        return stores.stream().map(store -> {

                    // ===== ADDRESS =====
                    String address = store.getAddress() != null
                                    ? store.getAddress().getFullAddress()
                                    : null;

                    // ===== TOTAL ITEMS =====
                    Integer totalItems =
                            store.getStoreItems() != null
                                    ? store.getStoreItems().size()
                                    : 0;

                    return adminStoreMapper.toResponse(
                            store,
                            address,
                            totalItems
                    );
                })
                .toList();
    }
}