import crudRepository from "./crudRepository.js";
import DMMessage from "../schema/dmMessage.js";

const dmMessageRepository = {
  ...crudRepository(DMMessage),

  // Get paginated messages for a conversation
  getPaginatedMessages: async function (conversationId, page = 1, limit = 20) {
    const messages = await DMMessage.find({ conversationId })
      .populate("senderId", "username email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return messages.reverse(); // Return in chronological order
  },

  // Get total message count for a conversation
  getMessageCount: async function (conversationId) {
    const count = await DMMessage.countDocuments({ conversationId });
    return count;
  },

  // Get latest message in a conversation
  getLatestMessage: async function (conversationId) {
    const message = await DMMessage.findOne({ conversationId })
      .sort({ createdAt: -1 })
      .populate("senderId", "username email avatar");
    return message;
  },
};

export default dmMessageRepository;
