import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { EasyModeProvider } from "./utils/contextMode";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <EasyModeProvider>
      <RouterProvider router={router}></RouterProvider>
    </EasyModeProvider>
  </React.StrictMode>,
);
