import { createMessageService } from "../services/messageService.js";
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT,
} from "../utils/common/eventConstant.js";

export default function messageHandler(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    try {
      const room = data.channelId;
      console.log("data", data);
      const messageResponse = await createMessageService(data);
      io.to(room).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);
      cb({
        success: true,
        status: "Message sent successfully",
        data: messageResponse,
      });
    } catch (error) {
      console.error("Error creating message:", error);
      cb({
        success: false,
        error: error.message || "Failed to send message",
      });
    }
  });
}
