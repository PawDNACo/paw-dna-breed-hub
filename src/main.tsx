import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeScreenshotPrevention } from "./utils/screenshotPrevention";

// Initialize screenshot prevention
initializeScreenshotPrevention();

createRoot(document.getElementById("root")!).render(<App />);
