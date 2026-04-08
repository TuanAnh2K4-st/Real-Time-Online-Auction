import { useState } from "react";
import {
  registerUserApi,
  registerSellerApi,
} from "../services/api/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [type, setType] = useState("user");
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (type === "user") {
        res = await registerUserApi(form);
      } else {
        res = await registerSellerApi(form);
      }

      alert(res.message); // 👉 message từ BE

      navigate("/login");
    } catch (err) {
      alert(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <button onClick={() => setType("user")}>User</button>
      <button onClick={() => setType("seller")}>Seller</button>

      <form onSubmit={handleSubmit}>
        {type === "user" && (
          <input
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        )}

        {type === "seller" && (
          <>
            <input
              placeholder="Company"
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
            />
            <input
              placeholder="Room"
              onChange={(e) =>
                setForm({ ...form, roomName: e.target.value })
              }
            />
          </>
        )}

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}