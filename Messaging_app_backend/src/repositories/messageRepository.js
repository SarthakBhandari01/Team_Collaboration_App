import Message from "../schema/message.js";
import crudRepository from "./crudRepository.js";

const messageRepository = {
  ...crudRepository(Message),
  getPaginatedMessages: async (messageParams, page, limit) => {
    try {
      const messages = await Message.find(messageParams)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("senderId", "username email avatar");
      return messages;
    } catch (error) {
      console.error("Error fetching paginated messages:", error);
      throw error;
    }
  },
  getMessageDetails: async (messageId) => {
    const message = await Message.findById(messageId).populate(
      "senderId",
      "username email avatar",
    );
    return message;
  },
  deleteManyByFilter: async (filter) => {
    try {
      const response = await Message.deleteMany(filter);
      return response;
    } catch (error) {
      console.error("Error deleting messages by filter:", error);
      throw error;
    }
  },
};

export default messageRepository;
