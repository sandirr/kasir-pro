import { useState } from "react";
import axios from "axios";
import { deleteImageFromDB, getPendingImages, saveImageToDB } from "utils/idb";
import { dbUPDATE, firestore } from "utils/firebase";
import { useInternetConnection } from "./connection";
import { doc } from "firebase/firestore";

const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isReallyOnline } = useInternetConnection();

  const uploadFile = async (file, ref = "", field = "") => {
    if (!file) {
      setError(true);
      setErrorMessage("Please select a file first!");
      return null;
    }

    if (!isReallyOnline) {
      await saveImageToDB(file, ref, field);
      setError(true);
      setErrorMessage("Offline mode: File saved locally.");
      return URL.createObjectURL(file);
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
        err.response?.data?.error?.message || "Failed to upload file",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadPendingImages = async () => {
    if (isReallyOnline) {
      const pendingImages = await getPendingImages();
      for (const image of pendingImages) {
        try {
          const imageUrl = await uploadFile(image.file);

          if (imageUrl) {
            await deleteImageFromDB(image.id);
            await dbUPDATE(doc(firestore, image.ref), {
              [image.field]: imageUrl,
            });
          }
        } catch (err) {
          console.error("Failed to upload pending image:", err);
        }
      }
    }
  };

  return {
    uploadFile,
    loading,
    success,
    error,
    errorMessage,
    uploadPendingImages,
  };
};

export default useCloudinaryUpload;
