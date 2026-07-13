import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AudioPlayerProvider } from "./context/AudioPlayerContext.jsx";
import { FavouritesProvider } from "./context/FavouritesContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FavouritesProvider>
          <AudioPlayerProvider>
            <App />
          </AudioPlayerProvider>
        </FavouritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);