import axios from "@/config/axiosConfig";

export const searchWorkspace = async ({ workspaceId, query, token }) => {
  try {
    const response = await axios.get("/search", {
      params: {
        workspaceId,
        q: query,
      },
      headers: {
        "x-access-token": token,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error in search request", error);
    throw error;
  }
};
