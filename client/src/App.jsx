import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import LoginComponent from "./app/pages/Login.jsx";
import Register from "./app/pages/Register.jsx";
import "./App.css";
import ForgotPassword from "./app/pages/ForgotPassword.jsx";
import Home from "./app/components/Home.jsx";
import MyPeers from "./app/components/Peers/MyPeers.jsx";
import UnifiedChatScreen from "./app/components/UnifiedChatScreen.jsx";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? <Navigate to="/sign-in" /> : <Navigate to="/home" />
          }
        />

        <Route
          path="/sign-up"
          element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/sign-in"
          element={!isLoggedIn ? <LoginComponent /> : <Navigate to="/" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/home" element={<Home />} />

        <Route path="/explore" element={<MyPeers />} />

        <Route path="/messages" element={<UnifiedChatScreen />} />

        <Route path="*" element={<>Not Found!!</>} />
      </Routes>
    </Router>
  );
}

export default App;
