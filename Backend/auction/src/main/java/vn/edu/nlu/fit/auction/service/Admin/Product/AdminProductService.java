package vn.edu.nlu.fit.auction.service.Admin.Product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.CreateProductRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Product.NoteStoreItemRequest;
import vn.edu.nlu.fit.auction.dto.request.Admin.Product.ProductFilterRequest;
import vn.edu.nlu.fit.auction.dto.response.Admin.Product.AdminProductResponse;
import vn.edu.nlu.fit.auction.entity.Category;
import vn.edu.nlu.fit.auction.entity.Product;
import vn.edu.nlu.fit.auction.entity.ProductImage;
import vn.edu.nlu.fit.auction.entity.Store;
import vn.edu.nlu.fit.auction.entity.StoreItem;
import vn.edu.nlu.fit.auction.entity.User;
import vn.edu.nlu.fit.auction.enums.NotificationType;
import vn.edu.nlu.fit.auction.enums.StoreItemStatus;
import vn.edu.nlu.fit.auction.mapper.Admin.Product.AdminProductMapper;
import vn.edu.nlu.fit.auction.mapper.Product.ProductMapper;
import vn.edu.nlu.fit.auction.repository.Category.CategoryRepository;
import vn.edu.nlu.fit.auction.repository.Product.ProductRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreItemRepository;
import vn.edu.nlu.fit.auction.repository.Store.StoreRepository;
import vn.edu.nlu.fit.auction.security.SecurityUtil;
import vn.edu.nlu.fit.auction.service.Cloudinary.CloudinaryService;
import vn.edu.nlu.fit.auction.service.Notification.NotificationService;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final StoreItemRepository storeItemRepository;
    private final AdminProductMapper adminProductMapper;
    private final NotificationService notificationService;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;
    private final SecurityUtil securityUtil;

    public List<AdminProductResponse> filterProducts( ProductFilterRequest request ) {

        Specification<StoreItem> specification =
                StoreItemSpecification.filterProducts(
                        request.getKeyword(),
                        request.getItemStatus(),
                        request.getStoreName()
                );

        List<StoreItem> storeItems =
                storeItemRepository.findAll(specification);

        return storeItems.stream()
                .map(adminProductMapper::toResponse)
                .toList();
    }

    public AdminProductResponse noteStoreItem(
        NoteStoreItemRequest request
) {

        StoreItem storeItem =
                storeItemRepository.findById(
                        request.getStoreItemId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sản phẩm"
                        )
                );

        // ===== UPDATE STATUS =====
        if (request.getStatus() != null) {

                storeItem.setItemStatus(
                        request.getStatus()
                );
        }

        // ===== UPDATE NOTE =====
        storeItem.setConditionNote(request.getConditionNote());
        StoreItem savedStoreItem = storeItemRepository.save(storeItem);

        // ===== SEND NOTIFICATION =====
        User owner = savedStoreItem.getProduct().getUser();
        String productName = savedStoreItem.getProduct().getProductName();
        String title = "Cập nhật sản phẩm - " + productName;
        String content = buildNotificationContent(savedStoreItem);

        notificationService.send(
                owner,
                title,
                content,
                NotificationType.INFO
        );

        return adminProductMapper.toResponse(
                savedStoreItem
        );
    }

    // HELPER
    private String buildNotificationContent(StoreItem storeItem) {

        String productName = storeItem.getProduct().getProductName();

        String note = storeItem.getConditionNote();

        return switch (storeItem.getItemStatus()) {

                case APPROVED ->
                        "Sản phẩm '" + productName +
                        "' đã được phê duyệt. " +
                        (note != null ? "Ghi chú: " + note : "");

                case REJECTED ->
                        "Sản phẩm '" + productName +
                        "' đã bị từ chối kiểm duyệt. " +
                        (note != null ? "Lý do: " + note : "");

                case RECEIVED ->
                        "Sản phẩm '" + productName +
                        "' đã được kho tiếp nhận.";

                case DONE ->
                        "Sản phẩm '" + productName +
                        "' đã được hoàn trả hoàn tất.";

                default ->
                        "Trạng thái sản phẩm '" +
                        productName +
                        "' đã được cập nhật.";
        };
    }

    @Transactional
        public void createProductByAdmin(
                CreateProductRequest req
        ) {

        // ===== 1. Validate =====
        if (req.getPrimaryImage() == null
                || req.getPrimaryImage().isEmpty()) {

                throw new RuntimeException(
                        "Phải có ảnh chính"
                );
        }

        // ===== 2. Lấy category + store =====
        Category category =
                categoryRepository.findById(
                        req.getCategoryId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );

        Store store =
                storeRepository.findById(
                        req.getStoreId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Store not found"
                        )
                );

        // ===== 3. Lấy user owner =====
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("Unauthorized");
        }

        // ===== 4. Tạo Product =====
        Product product =
                productMapper.toEntity(req);

        product.setUser(currentUser);
        product.setCategory(category);

        // save trước để có ID
        productRepository.save(product);

        // ===== 5. Upload ảnh =====
        List<ProductImage> images =
                new ArrayList<>();

        // ===== PRIMARY IMAGE =====
        Map<String, String> mainImg =
                cloudinaryService.uploadFile(
                        req.getPrimaryImage()
                );

        ProductImage primary =
                new ProductImage();

        primary.setProduct(product);
        primary.setImageUrl(
                mainImg.get("url")
        );
        primary.setImagePublicId(
                mainImg.get("publicId")
        );
        primary.setIsPrimary(true);

        images.add(primary);

        // ===== SUB IMAGES =====
        if (req.getSubImages() != null) {

                for (MultipartFile file
                        : req.getSubImages()) {

                if (file == null
                        || file.isEmpty()) {
                        continue;
                }

                Map<String, String> subImg =
                        cloudinaryService.uploadFile(
                                file
                        );

                ProductImage img =
                        new ProductImage();

                img.setProduct(product);
                img.setImageUrl(
                        subImg.get("url")
                );
                img.setImagePublicId(
                        subImg.get("publicId")
                );
                img.setIsPrimary(false);

                images.add(img);
                }
        }

        // ===== GÁN IMAGE =====
        product.setImages(images);

        // ===== 6. Tạo Store Item =====
        StoreItem storeItem =
                new StoreItem();

        storeItem.setProduct(product);
        storeItem.setStore(store);

        // ===== ADMIN AUTO APPROVED =====
        storeItem.setItemStatus(
                StoreItemStatus.APPROVED
        );

        storeItem.setConditionNote(
                "Sản phẩm được tạo bởi quản trị viên và tự động phê duyệt."
        );

        storeItemRepository.save(storeItem);
    }
    
}
