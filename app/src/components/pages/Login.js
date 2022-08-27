import GoogleIcon from "../UI/GoogleIcon";
import GithubIcon from "../UI/GithubIcon";
import TwitterIcon from "../UI/TwitterIcon";
import FacebookIcon from "../UI/FacebookIcon";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/AuthContext";
const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const { login } = useContext(AuthContext);
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history("/");
    }
  }, [history]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(email);
    console.log(password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
        credentials: 'same-origin'
      });
      console.log(res);
      if (!res.ok) throw new Error("Invalid Credentials");
      const data = await res.json()
      console.log(data);
      login(
        data.token,
        new Date(new Date().getTime() + data.expireIn).toISOString()
      );

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
          <h1 className="mb-8 text-3xl text-center">Login</h1>
          {error && (
            <p className="text-center text-black w-full px-4 py-3 bg-red-200 mb-4 rounded">
              {error}
            </p>
          )}
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
            tabIndex={1}
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
            tabIndex={2}
          />
          <button
            type="submit"
            className={
              "w-full text-center py-3 rounded  hover:bg-blue-500 bg-blue-600 text-white text-xl hover:bg-green-dark focus:outline-none mb-3 my-1"
            }
            tabIndex={3}
          >
            Submit
          </button>
          <div className="w-full text-center mb-4">
            <Link to={"/forgot-password"}>Forgot your password?</Link>
          </div>
          <div className="flex flex-col justify-center items-center space-y-2">
            <div className="flex flex-row justify-center items-center space-x-2">
              <GoogleIcon />
              <FacebookIcon />
              <GithubIcon />
              <TwitterIcon />
            </div>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          not a member?{" "}
          <Link
            className="no-underline text-blue-600 hover:text-blue-500"
            to="/register"
          >
            sign up
          </Link>
          .
        </div>
      </form>
    </div>
  );
};

export default Login;
