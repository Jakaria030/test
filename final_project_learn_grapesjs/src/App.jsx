// src/App.jsx

import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import BuilderLayout from "./components/layout/BuilderLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {

  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // ✅ Show loading while checking auth
  if (loading) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <p style={{ color: "white", fontSize: 16 }}>Loading...</p>
      </div>
    );
  };

  // ✅ Show builder if logged in
  if (user) {
    return <BuilderLayout />;
  };

  // ✅ Show login or register
  return showLogin
    ? <Login onSwitch={() => setShowLogin(false)} />
    : <Register onSwitch={() => setShowLogin(true)} />;

};

export default App;