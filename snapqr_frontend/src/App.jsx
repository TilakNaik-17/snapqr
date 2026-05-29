import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import SnapQRHomepage from "./home";
import mngclients from "./addclients";

export default function App() {

  const [page, setPage] = useState("signup");

  return (
    <>
      {page === "signup" && (
        <Signup
          onSwitchToLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login
          onSwitchToSignup={() => setPage("signup")}
          onLoginSuccess={() => setPage("home")}
        />
      )}

      {page === "home" && (
        <SnapQRHomepage />
      )}
    </>
  );
}