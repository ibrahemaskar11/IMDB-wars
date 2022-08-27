import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";

const PrivatScreen = () => {
  const [error, setError] = useState("");
  const [privateData, setPrivatData] = useState(null);
  const history = useNavigate()
  const {logout} = useContext(AuthContext)
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history("/login");
    }
    const fetchPrivateData = async () => {
      try {
        const res = await fetch("/api/private", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await res.json();
        setPrivatData(data.data);
      } catch (error) {
        setError("You are not authorized please log in");
        localStorage.removeItem("authToken");
      }
    };
    fetchPrivateData();
  }, []);
  const logoutHandler = () => {
    logout()
    history("/login");
  };
  return error ? (
    <span className="text-center text-black w-full px-4 py-3 bg-red-200 mb-4 rounded">
      {error}
    </span>
  ) : (
    <>
      <div className="bg-green-600 text-white">{privateData}</div>
      <button onClick={logoutHandler}>Logout</button>
    </>
  );
};

export default PrivatScreen;
