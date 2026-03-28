import axios from "@/config/axiosConfig";

export const deleteMessage = async ({ messageId, token }) => {
  try {
    const response = await axios.delete(`/messages/${messageId}`, {
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in delete message request", error);
    throw error;
  }
};

export const deleteDMMessage = async ({ messageId, token }) => {
  try {
    const response = await axios.delete(
      `/conversations/messages/${messageId}`,
      {
        headers: {
          "x-access-token": token,
        },
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error in delete DM message request", error);
    throw error;
  }
};
