package vn.edu.nlu.fit.auction.controller.Agora;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import vn.edu.nlu.fit.auction.agora.RtcTokenBuilder2;

@RestController
@RequestMapping("/api/agora")
public class AgoraController {

    @Value("${agora.app-id}")
    private String appId;

    @Value("${agora.app-certificate}")
    private String appCertificate;

    @GetMapping("/token")
    public Map<String, Object> getToken(
            @RequestParam String channel
    ) {

        int uid = (int) (Math.random() * 100000);

        int expire = 3600;

        RtcTokenBuilder2 tokenBuilder =
                new RtcTokenBuilder2();

        String token =
                tokenBuilder.buildTokenWithUid(
                        appId,
                        appCertificate,
                        channel,
                        uid,
                        RtcTokenBuilder2.Role.ROLE_PUBLISHER,
                        expire,
                        expire
                );

        return Map.of(
                "token", token,
                "uid", uid
        );
    }
}