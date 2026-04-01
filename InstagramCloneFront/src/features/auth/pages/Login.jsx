import React, { useState } from "react";
import "../styles/form.scss";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import {useNavigate} from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading...</p>;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    await handleLogin(username, password)
      .then((response) => {
        console.log("Login successful:", response);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            id="username"
            placeholder="Username"
          />
          <input
            onInput={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
