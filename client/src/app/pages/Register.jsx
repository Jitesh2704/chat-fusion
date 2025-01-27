import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../slices/auth";
import Logo from "../../assets/chatfusionlogo.png";
import Brand from "../../assets/chatfusiontext.png";
import SideImage from "../../assets/register.jpeg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { fname, lname, username, email, password, confirmPassword } =
      formData;

    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{8,30}$/;

    if (
      !fname.trim() ||
      !lname.trim() ||
      !usernameRegex.test(username) ||
      !emailRegex.test(email) ||
      !passwordRegex.test(password) ||
      password !== confirmPassword
    ) {
      toast.error("Please check your input fields for errors.");
      return false;
    }

    return true;
  };

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9_]{8,30}$/;
    if (!usernameRegex.test(formData.username)) {
      setUsernameError(
        "Username must be between 8 and 30 characters and can only contain letters, numbers, and underscores"
      );
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email format");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleBlur = (validationFunction) => {
    validationFunction();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await dispatch(register(formData)).unwrap();
      toast.success(response?.message ?? "Registration successful");
      setFormData({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/");
    } catch (error) {
      toast.error(error.message ?? "Registration failed");
    }
  };

  return (
    <div className="">
      <div className="w-full grid grid-cols-6 md:grid-cols-12">
        <style>
          {`
                .error-message {
                    color: red;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                .toggle-checkbox {
                    height: 20px;
                    width: 40px;
                    background-color: #ccc;
                    border-radius: 20px;
                    position: relative;
                    -webkit-appearance: none;
                    outline: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .toggle-checkbox:checked {
                    background-color: #209CEE;
                }

                .toggle-checkbox:checked::before {
                    transform: translateX(20px);
                }

                .toggle-checkbox::before {
                    content: "";
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: white;
                    top: 0;
                    left: 0;
                    transition: transform 0.3s;
                }
                `}
        </style>
        <div className="col-span-6 flex flex-col justify-center items-center bg-sky-50 py-6 md:py-0">
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

          <h3 className="text-center text-blue-500 text-2xl lg:text-3xl font-semibold mb-6 md:mb-3 lg:mb-6">
            Create New Account
          </h3>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full px-5 md:px-8 xl:px-20 flex flex-col justify-center items-center"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  First Name :
                </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  placeholder="Enter your First Name"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Name :
                </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleInputChange}
                  placeholder="Enter your Last Name"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Username :
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(validateUsername)}
                  placeholder="Enter your Username"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {usernameError && (
                  <p className="error-message">{usernameError}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(validateEmail)}
                  placeholder="Enter your Email"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Password :
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(validatePassword)}
                  placeholder="Enter Password"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Re-Enter Password :
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(validateConfirmPassword)}
                  placeholder="Confirm Password"
                  className="px-4 py-2 w-full border mt-0.5 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {confirmPasswordError && (
                  <p className="error-message">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </button>

            <a
              href="/sign-in"
              className="font-medium text-blue-500 hover:text-blue-600 hover:underline"
            >
              Back to Sign In
            </a>
          </form>
        </div>

        <div className="col-span-6">
          <img
            src={SideImage}
            className="w-full object-cover h-screen"
            alt="Register Image"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
