import axios from "@/config/axiosConfig.js";

export const uploadFileRequest = async ({ file, token }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/uploads", formData, {
    headers: {
      "x-access-token": token,
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data?.data;
};
