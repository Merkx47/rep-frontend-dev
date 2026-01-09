import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Enable mock mode for frontend-only development
// Comment out these lines when using real backend
import { enableMockMode, autoLogin } from "./lib/mockApi";
enableMockMode();
// Auto-login with demo user for development
autoLogin();

createRoot(document.getElementById("root")!).render(<App />);
