import channelRepository from "../repositories/channelRepository.js";
import userRepository from "../repositories/userRepository.js";
import { createMessageService } from "../services/messageService.js";
import { createNotification } from "../services/notificationService.js";
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECEIVED_EVENT,
} from "../utils/common/eventConstant.js";

// Extract @mentions from message body (Quill Delta JSON or plain text)
function extractMentions(body) {
  try {
    const mentions = [];
    let text = "";
    if (typeof body === "string") {
      try {
        const parsed = JSON.parse(body);
        if (parsed.ops) {
          text = parsed.ops
            .map((op) => (typeof op.insert === "string" ? op.insert : ""))
            .join("");
        } else {
          text = body;
        }
      } catch {
        text = body;
      }
    }
    // Match @username patterns (alphanumeric and underscores)
    const matches = text.match(/@(\w+)/g);
    if (matches) {
      matches.forEach((match) => {
        mentions.push(match.slice(1)); // Remove @ symbol
      });
    }
    return [...new Set(mentions)]; // Remove duplicates
  } catch {
    return [];
  }
}

export default function messageHandler(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    try {
      const room = data.channelId;
      console.log("data", data);
      const messageResponse = await createMessageService({
        channelId: data.channelId,
        body: data.body,
        senderId: data.senderId,
        workspaceId: data.workspaceId,
        fileUrl: data.fileUrl || null,
        fileType: data.fileType || null,
        fileName: data.fileName || null,
      });
      io.to(room).emit(NEW_MESSAGE_RECEIVED_EVENT, messageResponse);

      // Detect @mentions and create notifications
      const mentions = extractMentions(data.body);
      if (mentions.length > 0) {
        try {
          // Get channel details to get workspaceId
          const channel =
            await channelRepository.getChannelWithWorkspaceDetails(
              data.channelId,
            );
          const workspaceId = channel.workspaceId._id;
          const sender = await userRepository.getById(data.senderId);

          for (const username of mentions) {
            const mentionedUser = await userRepository.getByUsername(username);
            if (
              mentionedUser &&
              mentionedUser._id.toString() !== data.senderId
            ) {
              await createNotification(
                mentionedUser._id,
                workspaceId,
                "message_mention",
                "You were mentioned",
                `${sender?.username || "Someone"} mentioned you in #${channel.name}`,
                {
                  channelId: data.channelId,
                  channelName: channel.name,
                  messageId: messageResponse._id,
                  senderId: data.senderId,
                  senderName: sender?.username,
                },
              );
            }
          }
        } catch (notifError) {
          console.error("Error creating mention notification:", notifError);
        }
      }

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
