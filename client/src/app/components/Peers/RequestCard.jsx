import React from "react";
import ChatService from "../../services/chat-service/chat.service";
import { toast } from "react-toastify";

export default function RequestCard({ request, currentUserId, fetchAllData }) {
  const userDetails = request;

  const onAccept = async (request) => {
    try {
      const response = await ChatService.getChat({
        chat_type: "Personal",
        requested_by: request.user_id,
        requested_to: {
          $elemMatch: {
            user_id: currentUserId,
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

  const onReject = async (request) => {
    try {
      const response = await ChatService.getChat({
        chat_type: "Personal",
        requested_by: request.user_id,
        requested_to: {
          $elemMatch: {
            user_id: currentUserId,
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
    <div className="col-span-4">
      <div className="group before:hover:scale-95 before:hover:h-72 before:hover:w-80 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-['] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-cyan-400 via-orange-200 to-blue-400 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
        <img
          src={
            userDetails?.profile_image ||
            "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
          }
          alt={`${userDetails?.fname} ${userDetails?.lname}`}
          className="w-36 h-36 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500"
        />
        <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
          <span className="text-2xl font-semibold">
            {userDetails?.fname} {userDetails?.lname}
          </span>
          <p>{userDetails?.username}</p>
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => onAccept(request)}
            className="bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(request)}
            className="bg-red-500 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-red-400"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
