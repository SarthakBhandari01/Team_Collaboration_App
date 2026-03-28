import crudRepository from "./crudRepository.js";
import Conversation from "../schema/conversation.js";

const conversationRepository = {
  ...crudRepository(Conversation),

  // Find conversation between two specific members in a workspace
  findConversationByMembers: async function (workspaceId, userId1, userId2) {
    const conversation = await Conversation.findOne({
      workspaceId,
      members: { $all: [userId1, userId2], $size: 2 },
    }).populate("members", "username email avatar");
    return conversation;
  },

  // Get all conversations for a user in a workspace
  getUserConversations: async function (workspaceId, userId) {
    const conversations = await Conversation.find({
      workspaceId,
      members: userId,
    })
      .populate("members", "username email avatar")
      .sort({ updatedAt: -1 });
    return conversations;
  },

  // Get conversation by ID with populated members
  getConversationWithMembers: async function (conversationId) {
    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "username email avatar",
    );
    return conversation;
  },
};

export default conversationRepository;
