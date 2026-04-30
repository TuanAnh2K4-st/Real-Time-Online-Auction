package vn.edu.nlu.fit.auction.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.nlu.fit.auction.dto.response.BidResponse;
import vn.edu.nlu.fit.auction.entity.Bid;

@Mapper(componentModel = "spring")
public interface BidMapper {

    @Mapping(target = "auctionId", source = "auction.auctionId")
    @Mapping(target = "bidder", source = "bidder.username")
    @Mapping(target = "price", source = "bidAmount")
    @Mapping(target = "type", constant = "NEW_BID")
    BidResponse toResponse(Bid bid);

}
