import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from 'react-router-dom'
import { DrawerProvider } from '@/context/sideBar'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DrawerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DrawerProvider>
  </React.StrictMode>
);
