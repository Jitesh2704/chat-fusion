import React, { useState } from "react";
import ChatTab from "../chat/Chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function PeerCard({ peer }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  console.log("PEERS", peer);

  return (
    <div className="relative">
      <div className="group relative before:hover:scale-95 before:hover:h-72 before:hover:w-64 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-['] before:w-64 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-cyan-400 via-orange-200 to-blue-400 before:absolute before:top-0 w-64 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden border border-gray-300">
        <img
          src={
            peer.profile_image ||
            "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
          }
          alt={`${peer.fname} ${peer.lname}`}
          className="w-36 h-36 rounded-full border-4 border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20 transition-all duration-500"
        />
        <div className="z-10 group-hover:-translate-y-10 transition-all duration-500">
          <span className="text-2xl font-semibold">
            {peer.fname} {peer.lname}
          </span>
          <p>{peer.username}</p>
          <p className="text-sm text-gray-500">{peer.status}</p>
        </div>
        <button
          className="bg-orange-500 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-orange-400"
          onClick={toggleChat}
        >
          Chat
        </button>
      </div>

      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="relative bg-white w-full sm:w-2/5 h-full pt-14 shadow-lg transition-transform duration-300">
            <div className="flex items-center justify-between p-2 border-b border-gray-300 h-16">
              <div className="flex items-center">
                <img
                  src={
                    peer.profile_image ||
                    "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
                  }
                  alt="Profile"
                  className="w-14 h-14 object-cover rounded-full mr-3"
                />
                <h3 className="text-lg font-semibold">
                  {peer.fname} {peer.lname}
                </h3>
              </div>
              <button
                onClick={toggleChat}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md focus:outline-none"
              >
                <FontAwesomeIcon icon={faClose} className="text-xl" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <ChatTab chatID={peer.chat_id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
