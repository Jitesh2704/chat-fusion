import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faBan,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "./TimesAgo";
import MessageService from "../../services/chat-service/messages.service";
import AuthService from "../../services/auth-service/auth.service";
import ImageModal from "./ImageModal";
import { gunzip } from "fflate";

const MessageSent = ({ msg }) => {
  const [senderDetails, setSenderDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [replyDetails, setReplyDetails] = useState(null);
  const [replySenderDetails, setReplySenderDetails] = useState(null);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setModalOpen(false);
  };

  const handleDecompression = async (fileUrl) => {
    try {
      // Fetch the compressed Blob
      const response = await fetch(fileUrl);
      const compressedBlob = await response.blob();

      // Read Blob as an ArrayBuffer
      const arrayBuffer = await compressedBlob.arrayBuffer();

      // Decompress using gunzip
      const decompressedData = await new Promise((resolve, reject) => {
        gunzip(new Uint8Array(arrayBuffer), (err, decompressed) => {
          if (err) reject(err);
          else resolve(decompressed);
        });
      });

      // Convert decompressed data back to a Blob
      const decompressedBlob = new Blob([decompressedData]);

      // Create a new Blob URL
      const decompressedUrl = URL.createObjectURL(decompressedBlob);

      // Open the decompressed file in a new tab
      window.open(decompressedUrl, "_blank");
    } catch (error) {
      console.error("Error decompressing file:", error);
    }
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
    <div className="flex flex-row justify-end my-3 mr-2">
      <div className="flex flex-col">
        <div className="bg-orange-400 text-white max-w-2xl h-fit rounded-xl rounded-ee-none p-2 relative">
          {replyDetails && (
            <div className="bg-gray-100 p-2 border-l-4 border-gray-500 rounded-md flex flex-col text-xs">
              {replySenderDetails && (
                <span className="text-orange-600 font-semibold text-md">
                  {replySenderDetails.fname}
                </span>
              )}
              <div className="text-xs text-black line-clamp-3">
                {replyDetails.type === "text" ? (
                  <span>{replyDetails.content}</span>
                ) : replyDetails.type === "image" ? (
                  <span>Photo</span>
                ) : (
                  <span>Attachment</span>
                )}
              </div>
            </div>
          )}
          <div>
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
                  <div key={index} className="flex flex-col">
                    <button
                      onClick={() => handleDecompression(file)}
                      className="text-white font-semibold hover:text-orange-200 mr-2 my-1"
                    >
                      View attachment {index + 1}{" "}
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        className="ml-1"
                      />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end items-end text-xs">
          <div className="mr-1">
            <TimeAgo date={msg?.cdate_time} />
          </div>
          {msg.status}
        </div>
      </div>
      {senderDetails && senderDetails.profile_image && (
        <img
          src={
            senderDetails.profile_image
              ? senderDetails.profile_image
              : "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1709269806~exp=1709273406~hmac=780d28e2257d638333c1a7391b510d7c38f13566799496a89b7f49c2a4b506db&w=740"
          }
          alt="Profile"
          className="w-9 h-9 rounded-full ml-1 object-cover"
        />
      )}
    </div>
  );
};

export default MessageSent;
