import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatService from "../services/chat-service/chat.service";
import MessageService from "../services/chat-service/messages.service";
import AuthService from "../services/auth-service/auth.service";
import { useNavigate } from "react-router-dom";
import { fetchUserConnections } from "../utils/fetchUserConnections";

const RecentChats = () => {
  const [recentChats, setRecentChats] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const initializeRecentChats = async () => {
    try {
      // Fetch user connections, which already includes user details
      const res = await fetchUserConnections(user.user_id);

      // Extract chat IDs and user details
      const chatIds = res?.map((e) => e.chat_id);
      const userDetailsList = res?.map((e) => e.userDetails); // Reusing user details here

      // Fetch the latest message for each chat
      const messages = await Promise.all(
        chatIds.map(async (chatId) => {
          const messageRes = await MessageService.getAllMessages(
            1,
            1000000000000000,
            [],
            { chat_id: chatId },
            "",
            [],
            "cdate_time",
            "asc"
          );
          return messageRes?.data?.reverse()[0] || null;
        })
      );

      console.log("checking messages", messages);

      // Filter out messages sent by the current user and get user IDs for others
      const userIds = messages
        .filter((msg) => msg && msg.sender !== user.user_id)
        .map((msg) => msg.sender);

      console.log("get user ids", userIds);

      // Combine user details with the latest messages
      const final = userDetailsList
        .map((userDetail, index) => {
          const latestMessage = messages
            .filter(
              (message) => message && message.sender === userDetail.data.user_id
            )
            .sort((a, b) => new Date(b.cdate_time) - new Date(a.cdate_time))[0];

          if (!latestMessage) return null; // In case there's no message for the user

          const timeAgo = calculateTimeAgo(latestMessage.cdate_time);

          return {
            chatId: latestMessage.chat_id,
            desc: latestMessage.content,
            type: latestMessage.type,
            name: `${userDetail.data.fname} ${userDetail.data.lname}`,
            username: userDetail.data.username,
            fname: userDetail.data.fname,
            lname: userDetail.data.lname,
            profile_image: userDetail.data.profile_image,
            time: timeAgo,
          };
        })
        .filter((item) => item !== null); // Remove any null values if a user doesn't have a message

      console.log("Final data", final);
      setRecentChats(final);
    } catch (error) {
      console.error("Error fetching recent chats", error);
    }
  };

  const calculateTimeAgo = (dateTime) => {
    const messageDate = new Date(dateTime);
    const now = new Date();
    const difference = now - messageDate;
    const hoursAgo = Math.floor(difference / (1000 * 60 * 60));
    return `${hoursAgo}hr ago`;
  };

  useEffect(() => {
    if (user?.user_id) {
      initializeRecentChats();
    }
  }, [user?.user_id]);

  return (
    <div className="h-full bg-sky-100 p-3 rounded-xl border-sky-300 border-2 border-dashed shadow-md">
      <div className="flex justify-between">
        <div className="font-bold text-lg sm:text-xl ">
          Recent Chats
          <span className="text-slate-600 ml-1">
            {"("}
            {recentChats?.length}
            {")"}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-2 custom-scrollbar gap-2 rounded-lg">
        {recentChats?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center cursor-pointer shadow-sm p-2 rounded-lg border-2 bg-white "
            onClick={() => navigate("/messages")}
          >
            <div className="flex items-center gap-3">
              <img
                src={item?.profile_image}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                alt="Chat profile"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-base">
                  {item?.name}
                </span>{" "}
                {item?.type === "text" ? (
                  <span className="text-xs sm:text-sm line-clamp-1">
                    {item?.desc}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm line-clamp-1">
                    Sent a Photo
                  </span>
                )}{" "}
              </div>
            </div>
            <div>
              <button className="bg-gray-100 px-2 py-1 sm:px-3 sm:py-2 font-semibold text-stone-800 rounded-md text-xs md:text-sm">
                {item?.time}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
