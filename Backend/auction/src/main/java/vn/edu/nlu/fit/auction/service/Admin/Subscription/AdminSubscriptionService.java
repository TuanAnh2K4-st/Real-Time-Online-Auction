package vn.edu.nlu.fit.auction.service.Admin.Subscription;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.CreateSubscriptionRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.SubscriptionPlan;
import vn.edu.nlu.fit.auction.mapper.Admin.Subscription.AdminSubscriptionMapper;
import vn.edu.nlu.fit.auction.repository.Subscription.SubscriptionPlanRepository;

@Service
@RequiredArgsConstructor
public class AdminSubscriptionService {

    private final SubscriptionPlanRepository repository;
    private final AdminSubscriptionMapper mapper;

    // GET ALL
    public List<AdminSubscriptionResponse> getAll() {

        List<SubscriptionPlan> plans = repository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        return plans.stream()
                .map(mapper::toResponse)
                .toList();
    }

    // CREATE
    @Transactional
    public void create(CreateSubscriptionRequest request) {

        SubscriptionPlan plan = mapper.toEntity(request);

        repository.save(plan);
    }

    // DELETE
    @Transactional
    public void delete(Integer id) {

        SubscriptionPlan plan = repository.findById(id).orElseThrow(() ->new RuntimeException("Không tìm thấy gói subscription"));

        repository.delete(plan);
    }
    
}
