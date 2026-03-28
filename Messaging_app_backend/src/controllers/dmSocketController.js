import { createDMMessageService } from "../services/dmMessageService.js";
import {
  NEW_DM_MESSAGE,
  NEW_DM_MESSAGE_RECEIVED,
  JOIN_CONVERSATION,
  LEAVE_CONVERSATION,
} from "../utils/common/eventConstant.js";

export default function dmMessageHandler(io, socket) {
  // Handle sending a new DM
  socket.on(NEW_DM_MESSAGE, async function createDMMessageHandler(data, cb) {
    try {
      const room = data.conversationId;
      console.log("DM data", data);
      const messageResponse = await createDMMessageService(data);
      io.to(room).emit(NEW_DM_MESSAGE_RECEIVED, messageResponse);
      cb({
        success: true,
        status: "DM sent successfully",
        data: messageResponse,
      });
    } catch (error) {
      console.error("Error creating DM:", error);
      cb({
        success: false,
        error: error.message || "Failed to send DM",
      });
    }
  });

  // Handle joining a conversation
  socket.on(
    JOIN_CONVERSATION,
    async function joinConversationHandler(data, cb) {
      const roomId = data.conversationId;
      socket.join(roomId);
      cb({
        success: true,
        message: "Successfully joined the conversation",
        data: roomId,
      });
    },
  );

  // Handle leaving a conversation
  socket.on(
    LEAVE_CONVERSATION,
    async function leaveConversationHandler(data, cb) {
      const roomId = data.conversationId;
      socket.leave(roomId);
      cb({
        success: true,
        message: "Successfully left the conversation",
        data: roomId,
      });
    },
  );
}
