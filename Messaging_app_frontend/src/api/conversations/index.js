import axios from "@/config/axiosConfig";

export const getConversations = async ({ workspaceId, token }) => {
  try {
    const response = await axios.get("/conversations", {
      params: { workspaceId },
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in get conversations request", error);
    throw error;
  }
};

export const createConversation = async ({ workspaceId, memberId, token }) => {
  try {
    const response = await axios.post(
      "/conversations",
      { workspaceId, memberId },
      {
        headers: {
          "x-access-token": token,
        },
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error in create conversation request", error);
    throw error;
  }
};

export const getConversationById = async ({ conversationId, token }) => {
  try {
    const response = await axios.get(`/conversations/${conversationId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in get conversation by id request", error);
    throw error;
  }
};

export const getConversationMessages = async ({
  conversationId,
  token,
  page,
  limit,
}) => {
  try {
    const response = await axios.get(
      `/conversations/${conversationId}/messages`,
      {
        params: { limit: limit || 20, page: page || 1 },
        headers: {
          "x-access-token": token,
        },
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error in get conversation messages request", error);
    throw error;
  }
};
