import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const ForgotPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { resetToken } = useParams();
  const history = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords don't match");
    }

    try {
      const res = await fetch(`/api/auth/reset-password/${resetToken}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        mode: "cors",
      });
      if(!res.ok) throw new Error('Invalid Request')
      const data = await res.json();
      localStorage.setItem('authToken', data.token)
      console.log(data);
      history('/')
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <form
        className="container max-w-sm sm:max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2"
        onSubmit={onSubmitHandler}
      >
        <div className="bg-white px-6 py-8 rounded-xl shadow-xl text-black w-full border">
          <h1 className="mb-8 text-3xl text-center">Reset Password</h1>
          {error && (
            <p className="text-center text-black w-full px-4 py-3 bg-red-200 mb-4 rounded">
              {error}
            </p>
          )}
          <input
            type="password"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="ConfirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full text-center py-3 rounded  hover:bg-blue-500 bg-blue-600 text-white text-xl hover:bg-green-dark focus:outline-none mb-4"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
