package vn.edu.nlu.fit.auction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.response.StoreResponse;
import vn.edu.nlu.fit.auction.enums.StoreStatus;
import vn.edu.nlu.fit.auction.mapper.StoreMapper;
import vn.edu.nlu.fit.auction.repository.StoreRepository;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    public List<StoreResponse> getActiveStores() {
        return storeRepository.findByStoreStatus(StoreStatus.ACTIVE)
                              .stream()
                              .map(storeMapper::toResponse)
                              .collect(Collectors.toList());
    }
    
}
