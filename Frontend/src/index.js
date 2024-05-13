import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import { loginLoader, storageLoader } from "./utils/loaders"
import Home from "./componets/Home";
import ErrorPage from "./componets/ErrorPage";
import Login from "./componets/Login";
import Storage from "./componets/storage/Storage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/storage/*",
    element: <Storage />,
    loader: storageLoader,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
