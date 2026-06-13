package vn.edu.nlu.fit.auction.controller.Auction;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.Live.CreateLiveRoomRequest;
import vn.edu.nlu.fit.auction.dto.request.Live.CreateLiveSessionRequest;
import vn.edu.nlu.fit.auction.dto.response.ApiResponse;
import vn.edu.nlu.fit.auction.dto.response.PageResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveEligibilityResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveHomeCardResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveRoomDetailResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveRoomResponse;
import vn.edu.nlu.fit.auction.dto.response.Live.LiveSessionResponse;
import vn.edu.nlu.fit.auction.service.Auction.LiveAuctionService;

@RestController
@RequestMapping("/api/live-auctions")
@RequiredArgsConstructor
public class LiveAuctionController {

    private final LiveAuctionService liveAuctionService;

    @GetMapping("/public/sessions")
    public ResponseEntity<ApiResponse<List<LiveHomeCardResponse>>> getPublicLiveSessions(
            @RequestParam(defaultValue = "4") int limit
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>("Lấy phiên live trang chủ thành công", liveAuctionService.getPublicLiveSessions(limit))
        );
    }

    @GetMapping("/eligibility")
    public ResponseEntity<ApiResponse<LiveEligibilityResponse>> getEligibility() {
        return ResponseEntity.ok(
                new ApiResponse<>("Kiểm tra quyền tạo live thành công", liveAuctionService.getEligibility())
        );
    }

    @GetMapping("/rooms/{roomCode}/detail")
    public ResponseEntity<ApiResponse<LiveRoomDetailResponse>> getRoomDetail(
            @PathVariable String roomCode
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>("Lấy chi tiết phòng live thành công", liveAuctionService.getRoomDetail(roomCode))
        );
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<LiveRoomResponse>>> getMyRooms() {
        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách phòng live thành công", liveAuctionService.getMyRooms())
        );
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<LiveRoomResponse>> createRoom(
            @RequestBody CreateLiveRoomRequest request
    ) {
        LiveRoomResponse room = liveAuctionService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Tạo phòng live thành công", room));
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<LiveSessionResponse>>> getMyLiveSessions() {
        return ResponseEntity.ok(
                new ApiResponse<>("Lấy danh sách phiên live thành công", liveAuctionService.getMyLiveSessions())
        );
    }

    @PostMapping("/sessions")
    public ResponseEntity<ApiResponse<LiveSessionResponse>> createLiveSession(
            @RequestBody CreateLiveSessionRequest request
    ) {
        LiveSessionResponse session = liveAuctionService.createLiveSession(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Tạo phiên live thành công", session));
    }

    @GetMapping("/public/sessions/all")
    public ResponseEntity<ApiResponse<PageResponse<LiveHomeCardResponse>>> getLiveSessions(
        @RequestParam(defaultValue = "0") int page
    ) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Lấy danh sách live auction thành công",
                        liveAuctionService.getLiveSessions(page)
                )
        );
    }
}
