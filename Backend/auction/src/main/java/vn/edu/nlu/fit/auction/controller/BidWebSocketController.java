package vn.edu.nlu.fit.auction.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.BidRequest;
import vn.edu.nlu.fit.auction.service.AuctionService;

@Controller
@RequiredArgsConstructor
public class BidWebSocketController {

    private final AuctionService auctionService;

    @MessageMapping("/place-bid")
    public void bid(BidRequest request) {
        auctionService.placeBid(request);
    }
}