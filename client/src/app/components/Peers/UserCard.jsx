import React, { useState, useEffect } from "react";
import ChatService from "../../services/chat-service/chat.service";
import { toast } from "react-toastify";

export default function UserCard({ user, currentUserId }) {
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState("");

  const handleSendRequest = async () => {
    try {
      const create = await ChatService.createChat({
        chat_type: "Personal",
        requested_by: currentUserId,
        requested_to: [
          {
            user_id: user.user_id,
            chat_status: "Pending",
            user_type: "Friend Connection",
          },
        ],
      });
      console.log("created chat", create);
      toast.success("Friend Connection Request Sent Sucessfully!");
      setRequestSent(true);
      setError("");
    } catch (error) {
      console.error("Failed to send request:", error);
      setError("Failed to send request. Please try again later.");
    }
  };

  useEffect(() => {
    const checkChatRequest = async () => {
      try {
        const check = await ChatService.getChat({
          chat_type: "Personal",
          requested_by: currentUserId,
          requested_to: {
            $elemMatch: {
              user_id: user.user_id,
              chat_status: "Pending",
              user_type: "Friend Connection",
            },
          },
        });
        console.log("Created chat:", check);
        setRequestSent(true);
      } catch (error) {
        console.error("Failed to get request:", error);
      }
    };

    if (currentUserId && user.user_id) {
      checkChatRequest();
    }
  }, [currentUserId, user.user_id]);

  return (
    <div className="w-full ">
      <div className="group before:hover:scale-95 before:hover:h-72 before:hover:w-64 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-['] before:w-64 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-cyan-400 via-orange-200 to-blue-400 before:absolute before:top-0 w-64 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden border border-gray-300">
        <img
          src={
            user.profile_image ||
            "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
          }
          alt={`${user.fname} ${user.lname}`}
          className="w-32 object-cover h-32 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500"
        />
        <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
          <span className="text-2xl font-semibold">
            {user.fname} {user.lname}
          </span>
          <p>{user.username}</p>
        </div>
        <button
          onClick={() => handleSendRequest()}
          disabled={requestSent}
          aria-label={
            requestSent ? "Request already sent" : "Send friend request"
          }
          className={`bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 ${
            requestSent
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-125 transition-all duration-500 hover:bg-blue-500"
          }`}
        >
          {requestSent ? "Request Sent" : "Send Request"}{" "}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
