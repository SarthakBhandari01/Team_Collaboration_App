import { JOIN_CHANNEL, LEAVE_CHANNEL } from "../utils/common/eventConstant.js";

export default function channelHandler(io, socket) {
  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    const roomId = data.channelId;
    socket.join(roomId);
    cb({
      success: true,
      message: "Successfully joined the channels",
      data: roomId,
    });
  });

  socket.on(LEAVE_CHANNEL, async function leaveChannelHandler(data, cb) {
    const roomId = data.channelId;
    socket.leave(roomId);
    cb({
      success: true,
      message: "Successfully left the channel",
      data: roomId,
    });
  });
}
