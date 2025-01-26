import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Logo from "../../assets/chatfusionlogo.png";
import Brand from "../../assets/chatFusiontext.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth-service/auth.service";
import { updatePassword } from "../slices/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordError, setPasswordError] = useState("");
  const [found, setFound] = useState(false);

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPass)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleBlur = (validationFunction) => {
    validationFunction();
  };

  const handleCheckRecord = async (event) => {
    event.preventDefault();
    if (!email) {
      toast.warn("Please Enter your Email Address!");
    }

    try {
      const response = await AuthService.getAuthUser({ email: email }, [
        "user_id",
        "email",
      ]);
      if (response.data.user_id) {
        setFound(true);
        setEmail(response.data.email);
      }
    } catch (error) {
      setFound(false);
      toast.error(error.message ?? "User Not Found!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    dispatch(
      updatePassword({
        email: email,
        new_password: newPass,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Password changed successfully!");
        setEmail("");
        setNewPass("");
        setFound(false);
        navigate("/sign-in");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to change password.");
      });
  };

  return (
    <div className="h-screen bg-sky-100 flex flex-col justify-center">
      <div className="flex flex-col justify-center items-center mb-6">
        <div className="flex flex-col gap-1 justify-center items-center">
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
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-blue-600">
          Forgot your password?
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-4 rounded-xl border-2 border-sky-300">
          <form
            className="space-y-6"
            onSubmit={found ? handleSubmit : handleCheckRecord}
          >
            {found && (
              <div className="w-full bg-green-100 border-2 border-green-300 py-2 px-3 text-green-500 font-medium rounded-md">
                <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                Account with given email Found!
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {found && (
              <div>
                <label
                  htmlFor="newPass"
                  className="block text-sm font-medium text-gray-700"
                >
                  Set New Password :
                </label>
                <input
                  type="newPass"
                  name="newPass"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  onBlur={() => handleBlur(validatePassword)}
                  placeholder="Enter New Password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
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
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </div>
            )}

            <div className="flex flex-col justify-center items-center">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {found ? "Change Password" : "Find Account Details"}
              </button>

              <a
                href="/sign-in"
                className="mt-3 text-blue-500 hover:text-blue-600 hover:underline"
              >
                Back to Sign In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
