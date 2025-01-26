import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, logout } from "../slices/auth";
import Logo from "../../assets/chatfusionlogo.png";
import SideCover from "../../assets/login.jpeg";
import Brand from "../../assets/chatFusiontext.png";

const LoginComponent = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      toast.message("Redirecting to home page...");
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(loginData)).unwrap();
      console.log("Login response:", response);
      toast.success("Signed In Successfully");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center bg-white">
      <div className="bg-sky-50 w-full md:w-1/2 h-full flex justify-center items-center">
        <div className="max-w-md w-full mx-auto p-8 bg-sky-50 bg-opacity-90 rounded-lg">
          <div className="flex flex-col md:flex-row lg:flex-col gap-1 justify-center items-center mb-8 md:mb-4 lg:mb-8">
            <img
              loading="lazy"
              src={Logo}
              alt="Logo"
              className="w-56 md:w-20 lg:w-56 object-cover"
            />

            <img
              loading="lazy"
              src={Brand}
              alt="Brand"
              className="w-64 md:w-36 lg:w-64 object-cover"
            />
          </div>
          <h3 className="text-3xl text-center font-bold mb-4 text-gray-700">
            Sign in
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username or Email"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              className="w-full p-3 border-0 border-b-2 border-gray-300 focus:border-blue-500 rounded-b-md focus:outline-none focus:ring-0"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full p-3 border-0 border-b-2 border-gray-300 focus:border-blue-500 rounded-b-md focus:outline-none focus:ring-0"
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="/forgot-password" className="hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition duration-300"
            >
              Sign in
            </button>
            <p className="text-center mt-4 text-sm">
              Don't have an account?
              <a href="/sign-up" className="text-blue-400 hover:underline ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src={SideCover}
          alt="Login"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default LoginComponent;
