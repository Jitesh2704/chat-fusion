import {
  faChevronDown,
  faChevronUp,
  faMessage,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChatTab from "./chat/Chat";
import NavBar from "./NavBar";
import Logo from "../../assets/chatfusionlogo.png";
import Brand from "../../assets/chatfusiontext.png";
import MessageService from "../services/chat-service/messages.service";
import TimeAgo from "./TimesAgo";
import { fetchUserGroupData } from "../utils/fetchUserGroupData";
import { fetchUserConnections } from "../utils/fetchUserConnections";

const ChatCard = ({ chat, onClickChatCard }) => {
  const [latestMessage, setLatestMessage] = useState(null);

  const getChatMessages = async () => {
    try {
      const message = await MessageService.getAllMessages(
        1,
        10000000000000,
        [],
        { chat_id: chat.chat_id },
        "",
        [],
        "cdate_time",
        "asc"
      );
      setLatestMessage(message?.data?.reverse()[0] || null);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  useEffect(() => {
    getChatMessages();
  }, [chat.chat_id]);

  return (
    <div
      className="border-b-2 p-2 border-gray-300 hover:bg-gray-100 h-20 grid grid-cols-12 gap-3"
      onClick={() => onClickChatCard(chat)}
    >
      <img
        src={
          chat.card_type === "Connection"
            ? chat.profile_image ||
              "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
            : "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png"
        }
        alt={chat.card_type === "Connection" ? chat.fname : chat.chat_name}
        className="col-span-3 w-16 h-16 rounded-full object-cover"
      />
      <div className="col-span-9 flex flex-col justify-start items-start relative">
        <div className="mb-2 text-md whitespace-nowrap font-semibold text-left">
          {chat.card_type === "Connection" ? (
            <>
              {chat.fname} {chat.lname}
            </>
          ) : (
            chat.chat_name
          )}
          <span className="text-xs font-medium text-gray-400 ml-2">
            (
            {chat.card_type === "Connection"
              ? `@${chat.username}`
              : `${chat.requested_to.length + 1} Members`}
            )
          </span>
        </div>
        {latestMessage?.chat_id === chat?.chat_id && (
          <div className="">
            {latestMessage?.content?.length > 22 ? (
              <>{latestMessage?.content.substring(0, 22)}...</>
            ) : (
              <>
                {latestMessage?.type === "text"
                  ? latestMessage?.content
                  : "Sent a Photo"}
              </>
            )}
            <div className="absolute bottom-2 right-2 font-medium">
              <TimeAgo date={latestMessage?.cdate_time} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function UnifiedChatScreen() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const [myPeers, setMyPeers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Connections");

  const fetchMyPeers = async () => {
    try {
      const result = await fetchUserConnections(user.user_id);
      setMyPeers(
        result.map((e) => ({
          chat_id: e.chat_id,
          ...e.userDetails.data,
          card_type: "Connection",
        }))
      );
    } catch (error) {
      console.error("Error fetching my peers:", error);
    }
  };

  const fetchGroupChats = async () => {
    try {
      const group = await fetchUserGroupData(user.user_id);
      if (Array.isArray(group)) {
        setGroupData(group.map((e) => ({ ...e, card_type: "Group" })));
      } else {
        console.error("Invalid group data received:", group);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchGroupChats();
    fetchMyPeers();
  }, [user.user_id]);

  const handleChatCardClick = (chat) => {
    setSelectedChat(chat);
  };

  const getFilteredChats = () => {
    switch (activeTab) {
      case "Connections":
        return myPeers;
      case "Groups":
        return groupData;
      default:
        return [];
    }
  };

  const filteredChats = getFilteredChats();

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <NavBar />
      <div className="w-full h-screen pt-14 overflow-y-auto custom-scrollbar flex">
        <div className="w-3/12 bg-white p-4 rounded-lg bg-gray-300 overflow-y-auto custom-scrollbar">
          <div className="mx-4 flex flex-row gap-3 pb-4">
            <FontAwesomeIcon
              icon={faMessage}
              className="text-orange-500 text-4xl"
            />
            <div className="text-3xl text-orange-500 font-bold">
              Chat Messages
            </div>
          </div>

          <div className="flex flex-row bg-white rounded-lg border border-gray-300 mb-2">
            <div className="pl-4 pr-3 py-2.5">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-gray-600 text-lg"
              />
            </div>
            <input
              type="text"
              className="opacity-60 pr-4 py-2 text-slate-950 outline-none w-full"
              placeholder="Search by Name"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>

          <div className="w-full flex flex-row gap-3 mb-4">
            <button
              className={`font-semibold rounded-md w-1/2 py-2 px-4 ${
                activeTab === "Connections"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("Connections")}
            >
              Connections
            </button>
            <button
              className={`font-semibold rounded-md w-1/2 py-2 px-4 ${
                activeTab === "Groups"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setActiveTab("Groups")}
            >
              Groups
            </button>
          </div>

          {filteredChats.map((chat) => (
            <ChatCard
              key={chat.chat_id}
              chat={chat}
              onClickChatCard={handleChatCardClick}
            />
          ))}
        </div>
        <div className="w-9/12 bg-orange-50 flex flex-col justify-center items-center">
          {!selectedChat ? (
            <>
              <div className="flex flex-col md:flex-row lg:flex-col gap-1 justify-center items-center mb-2">
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
              <div className="text-xl font-semibold">
                No Conversation selected
              </div>
              <p>Select a chat to start messaging</p>
            </>
          ) : (
            <>
              <div className="w-full h-20 -mt-2 bg-orange-400 text-white flex flex-row  border p-3">
                <img
                  src={
                    selectedChat.card_type === "Connection"
                      ? selectedChat.profile_image ||
                        "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
                      : "https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png"
                  }
                  alt={
                    selectedChat.card_type === "Connection"
                      ? selectedChat.fname
                      : selectedChat.chat_name
                  }
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="px-4 flex flex-col justify-start items-start">
                  <div className="text-3xl whitespace-nowrap font-semibold text-left">
                    {selectedChat.card_type === "Connection" ? (
                      <>
                        {selectedChat.fname} {selectedChat.lname}
                      </>
                    ) : (
                      selectedChat.chat_name
                    )}
                  </div>
                  <span className="text-md font-medium">
                    {selectedChat.card_type === "Connection"
                      ? `@${selectedChat.username}`
                      : `${selectedChat.requested_to.length + 1} Members`}
                  </span>
                </div>
              </div>
              <ChatTab chatID={selectedChat.chat_id} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
