import { useState } from "react";
import { login } from "../api/authApi";
import { saveUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({
        email,
        password,
      });

      const data = res.data.data;

      // ⚠️ phải đúng field BE trả về
      saveUser({
        token: data.token,
        username: data.username || data.email
      });

      alert("Login thành công");

      navigate("/"); // quay về home

    } catch (err) {
      console.error(err);
      alert("Login thất bại");
    }
  };

  return (
    <div>
      <h1>🔐 Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>
        Đăng nhập
      </button>
    </div>
  );
}

export default Login;