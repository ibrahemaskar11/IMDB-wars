import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        mode: "cors",
      });
      if (!res.ok) throw new Error("Invalid Credentials");
      const data = await res.json();

      setMessage(data.data);
    } catch (error) {
      setError(error.message);
      setEmail("");
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
          <h1 className="mb-8 text-3xl text-center">Forgot Password</h1>
          {error && (
            <p className="text-center text-black w-full px-4 py-3 bg-red-200 mb-4 rounded">
              {error}
            </p>
          )}
          {message && (
            <p className="text-center text-black w-full px-4 py-3 bg-green-200 mb-4 rounded">
              {message}
            </p>
          )}
          <input
            type="text"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            type="submit"
            className="w-full text-center py-3 rounded  hover:bg-blue-500 bg-blue-600 text-white text-xl hover:bg-green-dark focus:outline-none mb-4"
          >
            Reset Password
          </button>
          <div className="w-full text-center mb-4">
            <Link to={"/login"} className="text-blue-600">
              login?
            </Link>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          not a member?{" "}
          <Link
            className="no-underline text-blue-600 hover:text-blue-500"
            to="/signup"
          >
            sign up
          </Link>
          .
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
