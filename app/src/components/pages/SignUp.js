import GoogleIcon from "../UI/GoogleIcon";
import GithubIcon from "../UI/GithubIcon";
import TwitterIcon from "../UI/TwitterIcon";
import FacebookIcon from "../UI/FacebookIcon";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history("/");
    }
  }, [history]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(username);
    console.log(password);

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      setError("Passwords do not match");
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        mode: "cors",
      });
      if (!res.ok) throw new Error('Invalid Credentials');
      const data = await res.json();
      console.log(data);
      console.log(data.user);
      localStorage.setItem("authToken", data.token);
      history("/");
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
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          {error && (
            <p className="text-center text-black w-full px-4 py-3 bg-red-200 mb-4 rounded">
              {error}
            </p>
          )}
          <input
            type="text"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="fullname"
            placeholder="Full Name"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            tabIndex={1}
          />

          <input
            type="text"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            tabIndex={2}
          />

          <input
            type="password"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            tabIndex={3}
          />
          <input
            type="password"
            className="block border border-gray-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            tabIndex={4}
          />

          <button
            type="submit"
            className={
              "w-full text-center py-3 rounded  hover:bg-blue-500 bg-blue-600 text-white text-xl hover:bg-green-dark focus:outline-none mb-4"
            }
            tabIndex={5}
          >
            Create Account
          </button>
          <div className="flex flex-col justify-center items-center space-y-2">
            <p className="text-center">or sign up with</p>
            <div className="flex flex-row justify-center items-center space-x-2">
              <GoogleIcon />
              <FacebookIcon />
              <GithubIcon />
              <TwitterIcon />
            </div>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          Already have an account?{" "}
          <Link
            className="no-underline text-blue-600 hover:text-blue-500"
            to="/login/"
            tabIndex={6}
          >
            Log in
          </Link>
          .
        </div>
      </form>
    </div>
  );
};

export default SignUp;
