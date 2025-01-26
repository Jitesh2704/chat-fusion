import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import UserCard from "./UserCard";
import PeerCard from "./PeerCard";
import RequestCard from "./RequestCard";
import AuthService from "../../services/auth-service/auth.service";
import ChatService from "../../services/chat-service/chat.service";
import NavBar from "../NavBar";
import Footer from "../Footer";

const MyPeers = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Explore Users");
  const tabs = ["Explore Users", "My Connections", "Incoming Requests"];
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myPeers, setMyPeers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllData = async () => {
    try {
      // Fetch all authenticated users
      const usersResponse = await AuthService.getAllAuthUsers(
        1,
        10000,
        [],
        {},
        searchText,
        ["fname", "lname"]
      );
      console.log("Fetched all users:", usersResponse.data);

      // Fetch existing personal chats where the user is either requested_by or requested_to
      const existingChats = await ChatService.getAllChats(
        1,
        1000,
        ["requested_to", "requested_by", "chat_id"],
        {
          chat_type: "Personal",
          $or: [
            {
              requested_by: userId,
              requested_to: {
                $elemMatch: { chat_status: "Accepted" },
              },
            },
            {
              requested_to: {
                $elemMatch: { user_id: userId, chat_status: "Accepted" },
              },
            },
          ],
        }
      );

      // Filter out the Pending status from the chats before setting myPeers
      const connectedUserIdsWithChatId = existingChats?.data
        ?.filter((chat) => {
          const isAccepted = chat.requested_to.some(
            (to) => to.chat_status === "Accepted"
          );
          return isAccepted;
        })
        .map((chat) => {
          const connectedUser =
            chat.requested_by === userId
              ? chat.requested_to[0]?.user_id
              : chat.requested_by;
          const chatId = chat.chat_id; // Attach chat_id
          return { user_id: connectedUser, chat_id: chatId }; // Return both user_id and chat_id
        })
        .filter(Boolean);

      console.log(
        "Connected User IDs with Chat ID:",
        connectedUserIdsWithChatId
      );

      // Filter peers and other users along with chat_id in the response
      setMyPeers(
        usersResponse.data
          .filter((user) =>
            connectedUserIdsWithChatId.some(
              (peer) => peer.user_id === user.user_id
            )
          )
          .map((user) => {
            // Attach the respective chat_id to each user
            const peer = connectedUserIdsWithChatId.find(
              (peer) => peer.user_id === user.user_id
            );
            return { ...user, chat_id: peer?.chat_id }; // Include chat_id
          })
      );

      const response = await ChatService.getAllChats(1, 1000);

      console.log("Response", response.data);

      const incomingReqUserIdsWithChatId = response.data
        .filter(
          (e) =>
            e.requested_to && // Ensure requested_to exists
            e.requested_to.length > 0 && // Ensure it's not empty
            e.requested_to[0].user_id === userId && // Check for the correct user_id
            e.requested_to[0].chat_status === "Pending" // Ensure the chat status is Pending
        )
        .map((e) => {
          const userId = e.requested_by;
          const chatId = e.chat_id; // Attach chat_id
          return { user_id: userId, chat_id: chatId }; // Return both user_id and chat_id
        });

      console.log(
        "Incoming Request User IDs with Chat ID:",
        incomingReqUserIdsWithChatId
      );

      // Filter users from usersResponse whose user_id matches any in incomingReqUserIdsWithChatId
      setIncomingRequests(
        usersResponse.data
          .filter((user) =>
            incomingReqUserIdsWithChatId.some(
              (peer) => peer.user_id === user.user_id
            )
          )
          .map((user) => {
            // Attach the respective chat_id to each user
            const peer = incomingReqUserIdsWithChatId.find(
              (peer) => peer.user_id === user.user_id
            );
            return { ...user, chat_id: peer?.chat_id }; // Include chat_id in user data
          })
      );

      setAllUsers(
        usersResponse.data.filter(
          (user) =>
            !connectedUserIdsWithChatId.some(
              (connectedUser) => connectedUser.user_id === user.user_id
            ) &&
            !incomingReqUserIdsWithChatId.some(
              (incomingUser) => incomingUser.user_id === user.user_id
            )
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchText, userId]);

  useEffect(() => {
    if (activeTab === "Explore Users") {
      setTotalPages(Math.ceil(allUsers.length / itemsPerPage));
    } else if (activeTab === "My Connections") {
      setTotalPages(Math.ceil(myPeers.length / itemsPerPage));
    } else {
      setTotalPages(Math.ceil(incomingRequests.length / itemsPerPage));
    }
  }, [activeTab, allUsers, myPeers, incomingRequests, itemsPerPage]);

  const handleClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="bg-slate-100 overflow-y-auto custom-scrollbarrelative">
      <div className="absolute top-0 right-0 left-0">
        <NavBar />
      </div>
      <div className="bg-slate-100  pt-4 pb-6 px-10 ">
        <div className="py-3 flex flex-row justify-between items-center">
          <iframe
            src="https://lottie.host/embed/196bb041-e744-4a0a-911e-28fc6b84edba/Km1ikrWp23.lottie"
            className="w-full h-80"
          ></iframe>
          <div className="flex flex-col justify-center px-16 py-6 rounded-full bg-blue-200 border-4 border-blue-400 border-dotted">
            <div className="font-bold text-3xl text-center">
              Heyy, <span className="text-blue-600">{user?.fname}</span>
            </div>
            <div className="text-lg text-center leading-6 mt-2">
              <div>
                Dive into the world of conversations. Connect, chat, and make
                new friends!
              </div>
            </div>
          </div>

          <iframe
            src="https://lottie.host/embed/38e1ea8c-b3fa-4812-914d-a2b535b86b39/uFqspBLVui.lottie"
            className="w-full h-96"
          ></iframe>
        </div>

        <div className="grid grid-cols-12 gap-2 px-8">
          <div className="col-span-5 w-fit flex bg-white rounded-full border h-16 mt-3">
            <div className="flex mx-0.5 min-w-max py-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleClick(tab)}
                  className={`px-4 py-2 mx-1 whitespace-nowrap rounded-full items-center transition-colors duration-150 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{tab}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-6 w-full">
            <div className="flex-col w-full">
              <div className="tracking-widest text-xs font-semibold mb-1 uppercase">
                SEARCH
              </div>
              <div className="h-12 flex flex-row w-full mt-1 bg-white rounded-xl border-2">
                <div className="pl-4 pr-3 py-2.5">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-500 text-lg"
                  />
                </div>
                <input
                  type="text"
                  className="opacity-60 pr-4 py-2 text-slate-800 outline-none rounded-xl w-full"
                  placeholder="Search Users"
                  value={searchText}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4 border-b border-gray-300" />
        <div className="text-xl font-semibold my-4">{activeTab}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {activeTab === "Explore Users" &&
            allUsers
              ?.filter((user) => user?.user_id !== userId)
              .map((user) => (
                <UserCard
                  key={user?.user_id}
                  user={user}
                  currentUserId={userId}
                />
              ))}
          {activeTab === "My Connections" &&
            (myPeers.length > 0 ? (
              myPeers.map((peer) => <PeerCard key={peer.user_id} peer={peer} />)
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center">
                <div className="text-xl font-semibold mb-4">
                  No Connections Found
                </div>
                <p>
                  Looks like you haven't connected with any Connections yet.
                </p>
                <p>Start by sending some requests!</p>
              </div>
            ))}
          {activeTab === "Incoming Requests" &&
            (incomingRequests.length > 0 ? (
              incomingRequests.map((request) => (
                <RequestCard
                  key={request.user_id}
                  request={request}
                  currentUserId={userId}
                  fetchAllData={fetchAllData}
                />
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center">
                <div className="text-xl font-semibold mb-4">
                  No Incoming Requests
                </div>
                <p>You have no pending peer requests at the moment.</p>
                <p>Check back later or invite your friends!</p>
              </div>
            ))}
        </div>

        <div className="flex justify-between items-center my-4 px-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-700 text-white disabled:opacity-50 text-xs sm:text-sm"
          >
            Previous
          </button>
          <div className="text-xs sm:text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-1 sm:px-4 sm:py-2 rounded-md bg-blue-700 text-white disabled:opacity-50 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyPeers;
