import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatService from "../services/chat-service/chat.service";
import MessageService from "../services/chat-service/messages.service";
import AuthService from "../services/auth-service/auth.service";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { fetchUserConnections } from "../utils/fetchUserConnections";
import { toast } from "react-toastify";
import { fetchUserGroupData } from "../utils/fetchUserGroupData";

const RecentGroupChats = () => {
  const [recentChats, setRecentChats] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createModal, setCreateModal] = useState(false);
  const [myPeers, setMyPeers] = useState([]);
  const [formData, setFormData] = useState({
    chat_name: "",
    chat_type: "Group",
    requested_by: user.user_id,
    requested_to: [],
  });

  const fetchMyPeers = async () => {
    try {
      const response = await fetchUserConnections(user.user_id);

      console.log(
        "set dta mypeers",
        response.map((e) => ({
          chat_id: e.chat_id,
          ...e.userDetails.data,
        }))
      );
      setMyPeers(
        response.map((e) => ({
          chat_id: e.chat_id,
          ...e.userDetails.data,
        }))
      );
    } catch (error) {
      console.error("Error fetching my peers:", error);
    }
  };

  const options = myPeers.map((peer) => ({
    label: `${peer.fname} ${peer.lname}`,
    value: peer.user_id,
  }));

  useEffect(() => {
    fetchMyPeers();
  }, [user]);

  const initializeRecentChats = async () => {
    try {
      // Fetch the user group data
      const res = await fetchUserGroupData(user.user_id);

      // Extract chatIds from the response
      const chatIds = res?.map((e) => e.chat_id);

      // Fetch the latest message for each chat
      const messages = await Promise.all(
        chatIds.map(async (chatId) => {
          const messageRes = await MessageService.getAllMessages(
            1,
            10000000,
            [],
            { chat_id: chatId },
            "",
            [],
            "cdate_time",
            "asc"
          );
          return messageRes?.data?.reverse()[0] || null; // Get the latest message
        })
      );

      // Combine the group data and latest message details
      const final = res
        .map((group, index) => {
          const latestMessage = messages[index]; // Get the latest message for the current group

          if (!latestMessage) return null; // Skip if no message is found

          const timeAgo = calculateTimeAgo(latestMessage.cdate_time);

          return {
            ...group,
            desc: latestMessage.content,
            type: latestMessage.type,
            time: timeAgo,
          };
        })
        .filter((item) => item !== null); // Remove any null values

      console.log("Final data", final);
      setRecentChats(final); // Set the combined data to state
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  // Time difference calculation
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
  }, [user]);

  // Handle selection change
  const handleChange = (selected) => {
    const updatedRequestedTo = selected.map((item) => ({
      chat_status: "Accepted",
      user_id: item.value,
      user_type: "Member",
    }));

    setFormData({
      ...formData,
      requested_to: updatedRequestedTo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ChatService.createChat(formData);

      if (res && res.data) {
        setCreateModal(false);
        toast.success("Group Created successfully!");
      } else {
        throw new Error("Failed to create group. No response data.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(
        "An error occurred while creating the group. Please try again."
      );
    }
  };

  return (
    <div className="h-full bg-blue-100 p-3 rounded-xl border-blue-300 border-2 border-dashed shadow-md">
      <div className="flex justify-between">
        <div className="font-bold text-lg sm:text-xl ">
          Group Chats
          <span className="text-slate-600 ml-1">
            {"("}
            {recentChats?.length}
            {")"}
          </span>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="font-semibold text-md text-blue-500"
        >
          + New Group
        </button>
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
                src="https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png"
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full"
                alt="Chat profile"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm sm:text-base">
                  {item?.chat_name}
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

      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 border-2 w-1/2 rounded-lg shadow-xl">
            <h2 className="text-3xl text-blue-600 font-semibold text-center mb-3">
              Create New Group
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-6 md:grid-cols-12 gap-4"
            >
              <div className="col-span-12">
                <label className="block text-sm font-medium mb-1">
                  Enter Group Name
                </label>
                <input
                  id="formData.chat_name"
                  type="text"
                  value={formData.chat_name}
                  onChange={(e) =>
                    setFormData({ ...formData, chat_name: e.target.value })
                  }
                  placeholder="Enter group name"
                  className="w-full p-2 border-2 rounded-md"
                  required
                />
              </div>

              <div className="col-span-12">
                <label className="block text-sm font-medium mb-1">
                  Select Participants
                </label>
                <Select
                  options={options}
                  isMulti
                  value={formData.requested_to.map((item) => ({
                    label: options.find((opt) => opt.value === item.user_id)
                      ?.label,
                    value: item.user_id,
                  }))}
                  onChange={handleChange}
                  placeholder="Choose Participants"
                  className="basic-multi-select"
                />
              </div>

              <div className="col-span-6 md:col-span-12 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModal(false)}
                  className="py-2 px-4 text-white bg-red-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-md"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentGroupChats;
