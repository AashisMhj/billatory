import React from "react";
import ReactDOM from "react-dom/client";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './index.css';

import App from "./App";
import { BrowserRouter } from 'react-router-dom'
import { DrawerProvider } from '@/context/sideBar'
import { SettingsProvider } from "@/context/settings";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SettingsProvider>
          <DrawerProvider>
            <App />
          </DrawerProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
