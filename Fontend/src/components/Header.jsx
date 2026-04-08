import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Auction</h1>

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <span>Welcome {user.username || user.email}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}