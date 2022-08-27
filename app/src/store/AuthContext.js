import React, { useState, useEffect, useCallback } from "react";
let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemaningTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remaningDuration = adjExpirationTime - currentTime;
  return remaningDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("authToken");
  const storedExpirationTime = localStorage.getItem("expirationTime");
  const remaningTime = calculateRemaningTime(storedExpirationTime);
  if (remaningTime <= 3600) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return { storedToken, duration: remaningTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  console.log(tokenData)
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;
  console.log(userIsLoggedIn)
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.clear("expirationTime");
    localStorage.clear("authToken");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("expirationTime", expirationTime);
    const remaningTime = calculateRemaningTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remaningTime);
  };
  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    } else {
    }
  }, [tokenData, logoutHandler]);
  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
