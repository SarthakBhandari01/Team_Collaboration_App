import { useState } from "react";

import { uploadFileRequest } from "@/api/uploads";
import { useAuth } from "@/hooks/context/useAuth";

export const useUploadFile = () => {
  const { auth } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const data = await uploadFileRequest({ file, token: auth?.token });
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to upload file";
      setUploadError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadError };
};
