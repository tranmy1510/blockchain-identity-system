import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "./context/WalletContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <WalletProvider>
        <Toaster position="top-right" />
        <App />
      </WalletProvider>
    </AuthProvider>
  </React.StrictMode>
);