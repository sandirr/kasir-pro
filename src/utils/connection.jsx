export function checkInternetConnection() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.timeout = 3000;
    img.src = "https://www.google.com/favicon.ico?" + new Date().getTime();
  });
}
