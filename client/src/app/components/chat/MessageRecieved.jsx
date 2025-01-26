import React from "react";
import { useState, useEffect } from "react";
import TimeAgo from "./TimesAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../services/auth-service/auth.service";
import ImageModal from "./ImageModal";
import MessageService from "../../services/chat-service/messages.service";

const MessageRecieved = ({ msg }) => {
  const [senderDetails, setSenderDetails] = useState(null);
  const [replyDetails, setReplyDetails] = useState(null);
  const [replySenderDetails, setReplySenderDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setModalOpen(false);
  };

  useEffect(() => {
    // Fetch sender details when component mounts
    const fetchSenderDetails = async () => {
      try {
        const response = await AuthService.getAuthUser({ user_id: msg.sender });
        setSenderDetails(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching sender details:", error);
      }
    };

    fetchSenderDetails();

    if (msg.reply_to) {
      const fetchReplyMessage = async () => {
        try {
          const response = await MessageService.getMessage({
            message_id: msg.reply_to,
          });
          setReplyDetails(response.data);
          const senderResponse = await AuthService.getAuthUser({
            user_id: response.data.sender,
          });
          setReplySenderDetails(senderResponse.data);
        } catch (error) {
          console.error("Error fetching replied message:", error);
        }
      };

      fetchReplyMessage();
    }
  }, [msg.sender, msg.reply_to]);

  return (
    <div className="flex flex-row justify-start my-3 mx-1 ">
      {/* <div className="bg-orange-200 line-clamp-1 whitespace-nowrap rounded-t-lg "></div> */}

      <div>
        {senderDetails && senderDetails.profile_image && (
          <img
            src={
              senderDetails.profile_image ||
              "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
            }
            alt="Profile"
            className="w-9 h-9 rounded-full mr-2 object-cover"
          />
        )}
      </div>
      <div className="flex flex-col">
        {senderDetails && (
          <div className="flex items-center text-xs font-semibold text-green-600">
            <span className="mr-1">
              {senderDetails.fname} {senderDetails.lname}
            </span>
          </div>
        )}
        <div className=" bg-white rounded-xl rounded-ss-none p-2 max-w-2xl">
          {replyDetails && (
            <div className="bg-gray-100 p-2 border-l-4 border-orange-500 rounded-l-md flex flex-col text-xs">
              {replySenderDetails && (
                <span className="text-orange-400 font-semibold text-md">
                  {replySenderDetails.fname}
                </span>
              )}
              <div className="text-xs line-clamp-3">
                {replyDetails.type === "text" ? (
                  <span key="text">{replyDetails.content}</span>
                ) : replyDetails.type === "image" ? (
                  <span key="image">Photo</span>
                ) : (
                  <span key="attachment">Attachment</span>
                )}
              </div>
            </div>
          )}
          <div className="text-orange-600">
            {msg.type === "text" ? (
              <>
                {msg.status === "deleted" && (
                  <FontAwesomeIcon icon={faBan} className="text-md mr-1" />
                )}
                {msg?.content}
              </>
            ) : msg.type === "image" ? (
              <>
                {msg.files.map((file, index) => (
                  <div key={index} className="flex flex-row">
                    <img
                      src={file}
                      alt={`Image preview ${index}`}
                      className="w-48 h-48 object-cover cursor-pointer rounded-lg"
                      onClick={() => openModal(file)} // Passing the URL to the modal
                    />
                  </div>
                ))}
                {modalOpen && (
                  <ImageModal imageUrl={selectedImage} onClose={closeModal} />
                )}
              </>
            ) : (
              <>
                {msg.files.map((file, index) => (
                  <div className="flex flex-col">
                    <a
                      key={index}
                      href={`http://localhost:5000/api/multimedia/files/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 font-semibold hover:text-orange-700 mr-2 my-1"
                    >
                      View attachment {index + 1}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="ml-2"
                      />
                    </a>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="flex text-slate-400 justify-end align-bottom mt-0.5">
            <TimeAgo date={msg?.cdate_time} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageRecieved;
