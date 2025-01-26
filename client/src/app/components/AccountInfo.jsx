import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthService from "../services/auth-service/auth.service";
import { Slide, toast } from "react-toastify";

export default function AccountInfo() {
  const { user } = useSelector((state) => state.auth);
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    username: user.username,
    profile_image: user.profile_image,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the authenticated user details
      const res = await AuthService.updateAuthUser(user?.user_id, formData);

      if (res && res.data) {
        // Update user data in localStorage
        localStorage.setItem("user", JSON.stringify(res.data));

        // Close the edit modal
        setEditModal(false);

        // Optional: Provide feedback to the user
        toast.success("Profile updated successfully!");
      } else {
        throw new Error("Failed to update user details. No response data.");
      }
    } catch (error) {
      // Handle errors gracefully
      console.error("Error updating user details:", error);
      toast.error(
        "An error occurred while updating the profile. Please try again."
      );
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        alert(
          "Invalid file type. Please upload an image (JPEG, PNG, GIF, JPG)."
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // Limit file size to 5MB
        alert("File size exceeds the limit of 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  return (
    <div className="p-3 bg-orange-100 border-2 border-orange-200 border-dashed rounded-xl w-full shadow-md h-72 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-end mb-3">
        <div className="font-bold text-xs md:text-lg lg:text-xl">
          Account Info
        </div>
        <button
          onClick={() => setEditModal(true)}
          className="font-semibold text-md text-orange-500 hover:text-white px-3  rounded-md border border-orange-500 hover:bg-orange-500 transition-all duration-300 cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <img
          src={
            user.profile_image ||
            "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
          }
          alt="Profile Image"
          className="w-32 h-32 object-cover border-2 rounded-full"
        ></img>
        <div className="text-2xl font-semibold text-gray-900">
          {user.fname} {user.lname}
        </div>
        <div className="text-lg font-medium text-gray-700">
          @{user.username}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>

      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 border-2 w-1/2 rounded-lg shadow-xl">
            <h2 className="text-3xl text-blue-600 font-semibold text-center mb-6">
              Your Account Information
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-6 md:grid-cols-12 gap-4"
            >
              <div className="col-span-6">
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  id="formData.fname"
                  type="text"
                  value={formData.fname}
                  onChange={(e) =>
                    setFormData({ ...formData, fname: e.target.value })
                  }
                  className="w-full p-2 border-2 rounded-md"
                  required
                />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  id="formData.lname"
                  type="text"
                  value={formData.lname}
                  onChange={(e) =>
                    setFormData({ ...formData, lname: e.target.value })
                  }
                  className="w-full p-2 border-2 rounded-md"
                  required
                />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  id="formData.username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full p-2 border-2 rounded-md"
                  required
                />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="formData.email"
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border-2 rounded-md"
                  required
                />
              </div>

              <div
                className={`col-span-6 ${
                  formData.profile_image ? "md:col-span-6" : "md:col-span-12"
                }`}
              >
                <label className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                <div className="flex items-center justify-center py-2">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, or GIF (Max: 5MB)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {formData.profile_image && (
                <div className="col-span-6 flex flex-col justify-center items-center">
                  <p className="block text-sm font-medium mb-2">Preview:</p>
                  <img
                    src={formData.profile_image}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border border-gray-300"
                  />
                </div>
              )}

              <div className="col-span-6 md:col-span-12 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="py-2 px-4 text-white bg-red-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
