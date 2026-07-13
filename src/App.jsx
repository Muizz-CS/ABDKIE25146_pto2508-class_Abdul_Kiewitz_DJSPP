import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import FavouritesPage from "./pages/FavouritesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/show/:id" element={<ShowDetailPage />} />
      <Route path="/favourites" element={<FavouritesPage />} />
    </Routes>
  );
}