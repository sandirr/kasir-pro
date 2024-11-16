import { useState } from "react";
import axios from "axios";

const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const uploadFile = async (file) => {
    if (!file) {
      setError(true);
      setErrorMessage("Please select a file first!");
      return null;
    }

    setLoading(true);
    setSuccess(false);
    setError(false);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bizpro");
    formData.append("folder", "public/bizpro");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dobbf6ejq/image/upload",
        formData,
      );

      setSuccess(true);
      return response.data.secure_url;
    } catch (err) {
      setSuccess(false);
      setError(true);
      setErrorMessage(
        err.response?.data?.error?.message || "Gagal mengunggah file",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, success, error, errorMessage };
};

export default useCloudinaryUpload;
