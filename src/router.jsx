import App from "App";
import Settings from "app/settings";
import ProductsMng from "app/settings/products";
import StarterLayout from "elements/starter-layout";
import CashierSystem from "starter/cashier-system";
import Pricing from "starter/pricing";
import Transaction from "app/transaksi";
import AppLayout from "elements/app-layout";
import { createBrowserRouter } from "react-router-dom";
import Workbench from "app/settings/workbench";
import CategoriesMng from "app/settings/categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "starter",
    element: <StarterLayout />,
    children: [
      {
        index: true,
        element: <CashierSystem />,
      },
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
            index: true,
            element: <Workbench />,
          },
          {
            path: "workbench",
            element: <Workbench />,
          },
          {
            path: "products",
            element: <ProductsMng />,
          },
          {
            path: "category",
            element: <CategoriesMng />,
          },
        ],
      },
    ],
  },
]);

export default router;
