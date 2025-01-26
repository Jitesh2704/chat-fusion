import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatService from "../services/chat-service/chat.service";
import AuthService from "../services/auth-service/auth.service";
import { toast } from "react-toastify";

const IncomingRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        // Fetch all authenticated users
        const usersResponse = await AuthService.getAllAuthUsers(1, 1000000);
        console.log("Fetched all users:", usersResponse.data);

        const response = await ChatService.getAllChats(1, 1000000);

        console.log("Response", response.data);

        const incomingReqUserIds = response.data
          .filter(
            (e) =>
              e.requested_to && // Ensure requested_to exists
              e.requested_to.length > 0 && // Ensure it's not empty
              e.requested_to[0].user_id === userId && // Check for the correct user_id
              e.requested_to[0].chat_status === "Pending" // Ensure the chat status is Pending
          )
          .map((e) => e.requested_by);

        console.log("Incoming Request User IDs in short:", incomingReqUserIds);

        setIncomingRequests(
          usersResponse.data.filter((user) =>
            incomingReqUserIds.includes(user.user_id)
          )
        );
      } catch (error) {
        console.error("Error fetching incoming requests:", error);
      }
    };

    fetchIncomingRequests();
  }, [userId]);

  const handleAccept = async (request) => {
    try {
      const response = await ChatService.getChat({
        chat_type: "Personal",
        requested_by: request.user_id,
        requested_to: {
          $elemMatch: {
            user_id: userId,
            chat_status: "Pending",
            user_type: "Friend Connection",
          },
        },
      });
      console.log("fetched chat", response.data);

      const update = await ChatService.updateChat(response.data.chat_id, {
        requested_to: [
          {
            ...response.data.requested_to[0],
            chat_status: "Accepted",
          },
        ],
      });
      console.log("updated", update.data);
      toast.success("Request Accepted");
      fetchAllData();
    } catch (error) {
      console.error("Failed to get request:", error);
    }
  };

  const handleReject = async (request) => {
    try {
      const response = await ChatService.getChat({
        chat_type: "Personal",
        requested_by: request.user_id,
        requested_to: {
          $elemMatch: {
            user_id: userId,
            chat_status: "Pending",
            user_type: "Friend Connection",
          },
        },
      });
      console.log("fetched chat", response.data);

      const update = await ChatService.updateChat(response.data.chat_id, {
        requested_to: [
          {
            ...response.data.requested_to[0],
            chat_status: "Rejected",
          },
        ],
      });
      console.log("updated", update.data);
      toast.warn("Request Rejected");
      fetchAllData();
    } catch (error) {
      console.error("Failed to get request:", error);
    }
  };

  return (
    <div className="p-3 bg-yellow-100 border-2 border-yellow-300 border-dashed rounded-xl w-full shadow-md h-72 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-end mb-6">
        <div className="font-bold text-xs md:text-lg lg:text-xl">
          Incoming Requests
          <span className="text-yellow-400 ml-1">
            {"("}
            {incomingRequests?.length}
            {")"}
          </span>
        </div>
        {/* Implement navigation to "More.." as needed */}
        <div
          onClick={() => navigate("/explore")}
          className="font-semibold text-xs md:text-base lg:text-md cursor-pointer" // Adjust text size for readability
        >
          More..
        </div>
      </div>

      {incomingRequests?.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-1 gap-4">
          {incomingRequests?.map((request, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between bg-white p-2 rounded-lg shadow-md"
            >
              <div className="flex gap-2 items-center">
                <img
                  src={
                    request.profile_image ||
                    "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
                  }
                  alt="Profile"
                  className="w-20 h-20 object-cover rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-md">
                    {request.fname} {request.lname}
                  </span>{" "}
                  {/* Adjust text size */}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 sm:mt-0">
                <button
                  className="bg-blue-100 hover:bg-blue-300 px-3 py-2 font-bold text-blue-500 rounded-lg text-xs sm:text-sm" // Adjust button text size
                  onClick={() => handleReject(request)}
                >
                  Reject
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs sm:text-sm" // Adjust button text size
                  onClick={() => handleAccept(request)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-center">
          <p className="text-gray-600 text-xs lg:text-sm">
            No incoming requests at the moment.
          </p>{" "}
          {/* Adjust text size */}
        </div>
      )}
    </div>
  );
};

export default IncomingRequests;
