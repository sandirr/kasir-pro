const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("offlineImagesDB", 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject("IndexedDB error: " + e.target.error);
  });
};

export const saveImageToDB = async (file, ref = "", field = "") => {
  const db = await openDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  const image = {
    file,
    ref,
    field,
    status: "pending",
    timestamp: Date.now(),
  };
  store.add(image);
  await tx.complete;
};

export const getPendingImages = async () => {
  const db = await openDB();
  const tx = db.transaction("images", "readonly");
  const store = tx.objectStore("images");
  const request = store.getAll();
  await tx.complete;
  return request.result.filter((image) => image.status === "pending");
};

export const updateImageStatus = async (id, status) => {
  const db = await openDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  const image = await store.get(id);
  image.status = status;
  store.put(image);
  await tx.complete;
};

export const deleteImageFromDB = async (id) => {
  const db = await openDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  store.delete(id);
  await tx.complete;
};
