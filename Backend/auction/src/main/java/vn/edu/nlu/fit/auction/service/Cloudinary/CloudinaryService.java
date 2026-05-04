package vn.edu.nlu.fit.auction.service.Cloudinary;

import java.io.IOException;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // chức nang upload file (trả về cả url + publicId)
    public Map<String, String> uploadFile(MultipartFile file) {

        // kiểm tra file có hợp lệ không
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // chỉ cho phép upload file ảnh
        String contentType = file.getContentType();

        // giới hạn kích thước file tối đa 5MB
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Invalid file type");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File too large (max 5MB)");
        }

        try {
            // upload file lên cloudinary và lấy về url + publicId
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "avatars",
                            "public_id", "user_" + System.currentTimeMillis()
                    )
            );

            String url = uploadResult.get("secure_url").toString();
            String publicId = uploadResult.get("public_id").toString();

            // trả về url + publicId cho client
            return Map.of(
                    "url", url,
                    "publicId", publicId
            );

        } catch (IOException e) {
            throw new RuntimeException("Upload failed");
        }
    }

    // chức nang xóa file trên cloudinary theo publicId
    public void deleteFile(String publicId) {
        if (publicId == null || publicId.isBlank()) return;

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.out.println("Delete failed: " + e.getMessage());
        }
    }
}
