import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import AudioPlayerBar from "./components/layout/AudioPlayerBar";
import LandingPage from "./pages/LandingPage";
import ShowDetailPage from "./pages/ShowDetailPage";
import FavouritesPage from "./pages/FavouritesPage";

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/show/:id" element={<ShowDetailPage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </main>
      <AudioPlayerBar />
    </>
  );
}