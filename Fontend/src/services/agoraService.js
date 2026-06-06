import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

export const client = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});

let localTracks = [];

const APP_ID = "2bfe19f30e2d40a288594ecc01f372d5";

export const joinAsHost = async (channelName) => {

  const { data } = await axios.get(
    `http://localhost:8080/api/agora/token?channel=${channelName}`
  );

  const { token, uid } = data;

  await client.setClientRole("host");

  await client.join(
    APP_ID,
    channelName,
    token,
    uid
  );
  console.log("HOST TOKEN", data);

  const tracks =
    await AgoraRTC.createMicrophoneAndCameraTracks();

  localTracks = tracks;

  await client.publish(tracks);

  return tracks;
};


export const joinAsAudience = async (channelName) => {

  const { data } = await axios.get(
    `http://localhost:8080/api/agora/token?channel=${channelName}`
  );

  const { token, uid } = data;

  await client.setClientRole("audience");

  await client.join(
    APP_ID,
    channelName,
    token,
    uid
  );
  console.log("AUDIENCE TOKEN", data);
};

export const leaveChannel = async () => {

  localTracks.forEach(track => {
    track.stop();
    track.close();
  });

  localTracks = [];

  await client.leave();
};