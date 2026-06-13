package vn.edu.nlu.fit.auction.agora;

public interface PackableEx extends Packable {
    void unmarshal(ByteBuf in);
}