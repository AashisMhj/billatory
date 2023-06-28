import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from 'react-router-dom'
import { DrawerProvider } from '@/context/sideBar'
import { SettingsProvider } from "@/context/settings";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <DrawerProvider>
          <App />
        </DrawerProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
