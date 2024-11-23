import App from "App";
import Settings from "app/settings";
import ProductsMng from "app/settings/products";
import Starter from "app/starter";
import Pricing from "app/starter/pricing";
import Transaction from "app/transaksi";
import AppLayout from "elements/app-layout";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "starter",
    element: <Starter />,
    children: [
      {
        path: "pricing",
        element: <Pricing />,
      },
    ],
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

export default router;