import { Route, Routes } from "react-router-dom";
import DashBoard from "./components/pages/DashBoard";
import Login from './components/pages/Login'
import SignUp from './components/pages/SignUp'
import ResetPassword from "./components/pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/pages/ForgotPassword";
import PrivatScreen from "./components/pages/PrivatScreen";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <PrivateRoute>
            <PrivatScreen />
          </PrivateRoute>
        }
      />
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
