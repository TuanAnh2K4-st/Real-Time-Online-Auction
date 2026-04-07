import { useEffect, useState } from "react";
import { getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  return (
    <div>
      <h1>🏠 Home</h1>

      {user?.username ? (
        <>
          <h2>Welcome {user.username} 👋</h2>
          <button onClick={() => {
            logout();
            setUser(null);
          }}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => navigate("/login")}>
          Đăng nhập
        </button>
      )}
    </div>
  );
}

export default Home;