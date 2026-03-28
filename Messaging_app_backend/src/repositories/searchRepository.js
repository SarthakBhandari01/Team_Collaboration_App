import Channel from "../schema/channel.js";
import Conversation from "../schema/conversation.js";
import DMMessage from "../schema/dmMessage.js";
import Message from "../schema/message.js";

const searchRepository = {
  // Search channel messages by text
  searchChannelMessages: async function (workspaceId, query, limit = 20) {
    const messages = await Message.find({
      workspaceId,
      $text: { $search: query },
    })
      .populate("senderId", "username email avatar")
      .populate("channelId", "name")
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(limit);
    return messages;
  },

  // Search DM messages for a user
  searchDMMessages: async function (workspaceId, userId, query, limit = 20) {
    // First get all conversation IDs this user is part of
    const userConversations = await Conversation.find({
      workspaceId,
      members: userId,
    }).select("_id");

    const conversationIds = userConversations.map((c) => c._id);

    if (conversationIds.length === 0) {
      return [];
    }

    const messages = await DMMessage.find({
      workspaceId,
      conversationId: { $in: conversationIds },
      $text: { $search: query },
    })
      .populate("senderId", "username email avatar")
      .populate({
        path: "conversationId",
        populate: {
          path: "members",
          select: "username email avatar",
        },
      })
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .limit(limit);
    return messages;
  },

  // Search channels by name (regex for partial match)
  searchChannels: async function (workspaceId, query, limit = 10) {
    const channels = await Channel.find({
      workspaceId,
      name: { $regex: query, $options: "i" },
    }).limit(limit);
    return channels;
  },
};

export default searchRepository;
