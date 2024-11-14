import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "elements/app-layout";
import Transaction from "app/transaksi";
import ProductsMng from "app/settings/products";
import Settings from "app/settings";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#1212b5",
      100: "#1212b5",
      200: "#1212b5",
      900: "#1e1e4d",
      600: "#1e1e4d",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>sipp</div>,
    children: [],
  },
  {
    path: "test",
    element: <App />,
  },
  {
    path: "app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Transaction />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "products",
            element: <ProductsMng />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>,
);
