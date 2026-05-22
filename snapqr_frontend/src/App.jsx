import { useState } from "react";
import Signup from "./Signup";
import Login  from "./Login";


export default function App() {
  const [page, setPage] = useState("signup"); // "signup" | "login"

  return page === "signup"
    ? <Signup onSwitchToLogin={()  => setPage("login")}  />
    : <Login  onSwitchToSignup={() => setPage("signup")} />;
}
