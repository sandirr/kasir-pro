export const saveImageToDB = async (file, ref = "", field = "") => {
  try {
    // Read file as Data URL
    const fileData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    // Prepare image object
    const image = {
      id: Date.now(), // Gunakan timestamp sebagai unique id
      file: fileData,
      ref,
      field,
      status: "pending",
      timestamp: Date.now(),
    };

    // Ambil images yang sudah ada
    const existingImages = JSON.parse(
      localStorage.getItem("offlineImages") || "[]",
    );

    // Tambahkan image baru
    existingImages.push(image);

    // Simpan kembali ke localStorage
    localStorage.setItem("offlineImages", JSON.stringify(existingImages));

    return image.id;
  } catch (error) {
    console.error("Error in saveImageToDB", error);
    throw error;
  }
};

export const getPendingImages = async () => {
  // Ambil semua images dari localStorage
  const existingImages = JSON.parse(
    localStorage.getItem("offlineImages") || "[]",
  );

  // Filter hanya pending images
  return existingImages.filter((image) => image.status === "pending");
};

export const deleteImageFromDB = async (id) => {
  // Ambil images yang sudah ada
  const existingImages = JSON.parse(
    localStorage.getItem("offlineImages") || "[]",
  );

  // Filter out image dengan id yang diberikan
  const updatedImages = existingImages.filter((image) => image.id !== id);

  // Simpan kembali ke localStorage
  localStorage.setItem("offlineImages", JSON.stringify(updatedImages));
};

export const updateImageStatus = async (id, status) => {
  // Ambil images yang sudah ada
  const existingImages = JSON.parse(
    localStorage.getItem("offlineImages") || "[]",
  );

  // Cari dan update status image
  const updatedImages = existingImages.map((image) =>
    image.id === id ? { ...image, status } : image,
  );

  // Simpan kembali ke localStorage
  localStorage.setItem("offlineImages", JSON.stringify(updatedImages));
};
