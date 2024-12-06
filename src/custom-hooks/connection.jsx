import { useState, useEffect } from "react";

export const useInternetConnection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReallyOnline, setIsReallyOnline] = useState(navigator.onLine);

  const checkInternetConnection = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.timeout = 3000; // 3 detik timeout
      img.src = "https://www.google.com/favicon.ico?" + new Date().getTime();
    });
  };

  useEffect(() => {
    // Handler untuk event online/offline browser
    const handleOnline = () => {
      setIsOnline(true);
      // Lakukan pengecekan konkret
      checkInternetConnection().then(setIsReallyOnline);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReallyOnline(false);
    };

    // Tambahkan event listener
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Lakukan pengecekan awal
    checkInternetConnection().then(setIsReallyOnline);

    // Interval untuk pengecekan berkala (opsional)
    const intervalId = setInterval(() => {
      checkInternetConnection().then(setIsReallyOnline);
    }, 30000); // Cek setiap 30 detik

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return {
    isOnline,
    isReallyOnline,
  };
};
