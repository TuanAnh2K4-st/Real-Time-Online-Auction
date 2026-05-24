package vn.edu.nlu.fit.auction.service.Admin.Subscription;

import java.util.List;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Admin.Subscription.FilterUserSubscriptionRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Subscription.AdminUserSubscriptionResponse;
import vn.edu.nlu.fit.auction.entity.UserSubscription;
import vn.edu.nlu.fit.auction.enums.SubscriptionStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.Subscription.AdminUserSubscriptionMapper;
import vn.edu.nlu.fit.auction.repository.Subscription.UserSubscriptionRepository;

@Service
@RequiredArgsConstructor
public class AdminUserSubscriptionService {

    private final UserSubscriptionRepository repository;
    private final AdminUserSubscriptionMapper mapper;

    public List<AdminUserSubscriptionResponse> getAll( FilterUserSubscriptionRequest request) {

        List<UserSubscription> subscriptions = repository.findAll(
                        UserSubscriptionSpecification.filter(request),
                        Sort.by(Sort.Direction.DESC, "id")
                );

        return subscriptions.stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public void cancelSubscription(Integer id) {

        UserSubscription subscription = repository.findById(id).orElseThrow(() ->new RuntimeException("Không tìm thấy subscription"));

        if (subscription.getStatus() == SubscriptionStatus.CANCELLED) {
            throw new RuntimeException("Subscription đã bị hủy");
        }

        subscription.setStatus(SubscriptionStatus.CANCELLED);

        repository.save(subscription);
    }
}
