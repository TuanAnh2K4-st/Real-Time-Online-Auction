package vn.edu.nlu.fit.auction.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import vn.edu.nlu.fit.auction.dto.request.BidRequest;
import vn.edu.nlu.fit.auction.dto.request.ChatMessageRequest;
import vn.edu.nlu.fit.auction.service.AuctionService;

@Controller
@RequiredArgsConstructor
public class BidWebSocketController {

    private final AuctionService auctionService;

    @MessageMapping("/place-bid")
    public void bid(BidRequest request, Principal principal) {
        auctionService.placeBid(request, principal);
    }

    @MessageMapping("/send-chat")
    public void chat(ChatMessageRequest request, Principal principal) {
        auctionService.sendChat(request, principal);
    }
}