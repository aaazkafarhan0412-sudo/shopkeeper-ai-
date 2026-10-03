import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ShotPage from "./shots/ShotPage";
import Studio from "./shots/Studio";

const params = new URLSearchParams(window.location.search);
const shotId = params.get("shot");
const isMediaKit = params.has("screens") || params.has("studio") || window.location.hash === "#screens";

// Screenshot pages render motion-free with hidden scrollbars (see index.css).
if (shotId) document.documentElement.classList.add("shot-mode");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {shotId ? <ShotPage id={shotId} nonce={params.get("n") ?? ""} /> : isMediaKit ? <Studio /> : <App />}
  </StrictMode>,
);
