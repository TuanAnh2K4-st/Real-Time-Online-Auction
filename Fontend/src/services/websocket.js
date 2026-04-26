import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
let currentSubscription = null;

/**
 * Kết nối WebSocket theo auctionId
 */
export const connectWebSocket = (auctionId, onMessage) => {
  // Nếu đã có connection cũ → ngắt trước
  if (stompClient) {
    disconnectWebSocket();
  }

  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: () => {}, // có thể bật log nếu cần
  });

  stompClient.onConnect = () => {
    console.log("✅ Connected WebSocket");

    // subscribe vào topic auction
    currentSubscription = stompClient.subscribe(
      `/topic/auction/${auctionId}`,
      (message) => {
        try {
          const data = JSON.parse(message.body);
          onMessage(data);
        } catch (err) {
          console.error("❌ Parse message error:", err);
        }
      }
    );
  };

  stompClient.onStompError = (frame) => {
    console.error("❌ Broker error:", frame.headers["message"]);
  };

  stompClient.activate();
};

/**
 * Ngắt kết nối WebSocket
 */
export const disconnectWebSocket = () => {
  if (stompClient) {
    try {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
        currentSubscription = null;
      }

      stompClient.deactivate();
      console.log("❌ Disconnected WebSocket");
    } catch (err) {
      console.error("❌ Disconnect error:", err);
    } finally {
      stompClient = null;
    }
  }
};

/**
 * Gửi bid lên server
 */
export const sendBid = (data) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/place-bid",
      body: JSON.stringify(data),
    });
  } else {
    console.warn("⚠️ WebSocket chưa kết nối");
  }
};