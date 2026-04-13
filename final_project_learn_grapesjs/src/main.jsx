// src/main.jsx

import { createRoot } from "react-dom/client";
import "./index.css";
import "grapesjs/dist/css/grapes.min.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EditorProvider } from "./context/EditorContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <EditorProvider>
      <App />
    </EditorProvider>
  </AuthProvider>
);