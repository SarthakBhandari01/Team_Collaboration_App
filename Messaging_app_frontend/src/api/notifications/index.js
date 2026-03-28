import axios from "@/config/axiosConfig";

export const getNotificationsRequest = async ({ token }) => {
  try {
    const response = await axios.get("/notifications", {
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in get notifications request", error);
    throw error.response?.data || error;
  }
};

export const getUnreadCountRequest = async ({ token }) => {
  try {
    const response = await axios.get("/notifications/unread-count", {
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in get unread count request", error);
    throw error.response?.data || error;
  }
};

export const markNotificationReadRequest = async ({ id, token }) => {
  try {
    const response = await axios.put(
      `/notifications/${id}/read`,
      {},
      {
        headers: {
          "x-access-token": token,
        },
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error in mark notification read request", error);
    throw error.response?.data || error;
  }
};

export const markAllReadRequest = async ({ token }) => {
  try {
    const response = await axios.put(
      "/notifications/read-all",
      {},
      {
        headers: {
          "x-access-token": token,
        },
      },
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error in mark all read request", error);
    throw error.response?.data || error;
  }
};
