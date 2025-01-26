import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import MessageDropdown from "./MessageDropdown";
import QuotedMessage from "./QuotedMessage.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faCirclePlus,
  faFile,
  faImage,
  faTimes,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import MessageRecieved from "./MessageRecieved.jsx";
import MessageSent from "./MessageSent.jsx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  chatSocket,
  subscribeToChatMessages,
} from "../../utils/socketio-client.js";
import imageCompression from "browser-image-compression";
import { gzip } from "fflate";
import MessageService from "../../services/chat-service/messages.service.js";
import ChatService from "../../services/chat-service/chat.service.js";

const ChatTab = ({ chatID }) => {
  console.log({ chatID });
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState("");
  const [type, setType] = useState("text");
  const chatId = chatID;
  const [isLoaded, setIsLoaded] = useState(false);
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  // const chatContainerRef = useRef();
  const chatContainerRef = useRef(null);
  const [floatingTimestamp, setFloatingTimestamp] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showDropdownForMessage, setShowDropdownForMessage] = useState(null);
  const [quotedMessage, setQuotedMessage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(null);

  const handleRightClick = (e, messageId) => {
    e.preventDefault();
    setShowDropdownForMessage(messageId); // Open dropdown for the clicked message
  };

  const handleFileChange = (event) => {
    // Get the selected files from the input element
    const files = Array.from(event.target.files);

    // Update the selectedFiles state with the new files
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    // Create a copy of selectedFiles
    const updatedFiles = [...selectedFiles];

    // Remove the file at the specified index from the copy
    updatedFiles.splice(index, 1);

    // Update the state with the modified array
    setSelectedFiles(updatedFiles);
  };

  const handleReply = (message) => {
    setQuotedMessage(message);
    setShowDropdownForMessage(null);
    setReplyingTo(message.message_id);
    chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (message) => {
    try {
      if (message.type === "text") {
        // Update the message content to indicate it's deleted
        const updatedMessage = {
          ...message,
          content: "this message has been deleted",
          status: "deleted",
        };
        await MessageService.updateMessage(message.message_id, updatedMessage);
        setShowDropdownForMessage(null);
      } else {
        // Delete the message
        await MessageService.deleteMessage(message.message_id);
        setShowDropdownForMessage(null);
      }
    } catch (error) {
      console.error("Error deleting the Message:", error.message);
      setShowDropdownForMessage(null);
    }
  };

  const handleEdit = (message) => {
    setEditMessage(message);
    setMsg(message.content); // Set the message content to the current message content
    setEditing(true); // Set editing mode to true
    setShowDropdownForMessage(null);
  };

  const handleCancelEdit = () => {
    setEditMessage(null); // Clear the edit message
    setMsg(""); // Clear the message input field
    setEditing(false); // Set editing mode to false
    setShowDropdownForMessage(null);
  };

  // Function to clear the replied message
  const clearReply = () => {
    setReplyingTo(null);
  };

  useEffect(() => {
    // console.log("I am Triggered");
    subscribeToChatMessages(
      (message) => {
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, message]);
        if (message.sender !== userId) {
          toast.success("New message arrived");
        }
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      },
      (updatedMessage) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.message_id === updatedMessage.message_id ? updatedMessage : msg
          )
        );
      }
    );
    fetchChat(chatId);

    return () => {
      chatSocket.off("new_message");
      chatSocket.off("update_message");
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const chatContainer = chatContainerRef.current;
      if (!chatContainer) {
        // Handle the case where chatContainer is null
        console.log("bro chat container is empty");
        return;
      }
      const scrollOffset = chatContainer.scrollTop;
      const visibleMessages = getVisibleMessages(chatContainer, messages);
      const firstMessage = visibleMessages[0];

      if (!firstMessage) {
        // No messages to display
        return;
      }

      const firstMessageDate = moment(firstMessage.cdate_time);
      const todayStart = moment().startOf("day");
      const yesterdayStart = moment().subtract(1, "days").startOf("day");

      if (firstMessageDate.isSame(todayStart, "day")) {
        setFloatingTimestamp("Today");
      } else if (firstMessageDate.isSame(yesterdayStart, "day")) {
        setFloatingTimestamp("Yesterday");
      } else {
        setFloatingTimestamp(firstMessageDate.format("DD MMM YYYY"));
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messages, chatId]); // Add messages as a dependency to update when messages change

  const getVisibleMessages = (container, messages) => {
    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;
    const visibleMessages = [];

    messages.forEach((message) => {
      const messageElement = document.getElementById(
        `message-${message.message_id}`
      );
      if (!messageElement) {
        console.log("bro cant get message element");
        return; // Skip if message element not found
      }
      const messageRect = messageElement.getBoundingClientRect();
      const messageTop = messageRect.top;
      const messageBottom = messageRect.bottom;

      if (messageBottom >= containerTop && messageTop <= containerBottom) {
        visibleMessages.push(message);
      }
    });

    return visibleMessages;
  };

  const handleSendMsg = async () => {
    try {
      if (!msg.trim()) {
        // If the message is empty or contains only whitespace
        // Display an alert message prompting the user to enter a message
        toast.warn("Please enter a message before sending.");
        return; // Exit the function without sending the message
      }

      if (editing && editMessage) {
        // If in editing mode, update the message
        const updatedMessage = { ...editMessage, content: msg };
        await MessageService.updateMessage(
          editMessage.message_id,
          updatedMessage
        );
        // Update the UI with the edited message
        // You may need to refresh the message list or update it locally
      } else {
        const messageData = {
          chat_id: chatId,
          sender: userId,
          content: msg,
          status: "sent",
          type: "text",
          reply_to: replyingTo,
        };

        // Call createMessage function to send the message
        const response = await MessageService.createMessage(messageData);

        // Log the response data to the console
        console.log("Message sent successfully:", response.data);
        // Reset the message input field and scroll to the bottom
      }
      setMsg("");
      setEditing(false);
      setEditMessage(null);
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;

      setQuotedMessage(null);
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      clearReply(); // Clear replied message after sending the new message
    }
  };

  const fetchChat = async () => {
    try {
      // Fetch messages related to the chat
      const messagesResponse = await MessageService.getAllMessages(
        1,
        10000,
        [],
        {
          chat_id: chatId,
        },
        "",
        [],
        "",
        ""
      );
      const messages = messagesResponse?.data?.reverse();

      // Fetch chat users related to the chat
      const chatUsersResponse = await ChatService.getChat(
        {
          chat_id: chatId,
        },
        ["requested_by", "requested_to"]
      );
      const chatUsers = [
        { user_id: chatUsersResponse.data.requested_by },
        ...chatUsersResponse.data.requested_to
          .filter((i) => i.chat_status === "Accepted")
          .map((e) => ({ user_id: e.user_id })),
      ];

      // Update state with the fetched data
      setMessages(messages);
      setChat(chatUsers);
      setIsLoaded(true);
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  useEffect(() => {
    fetchChat(); // Call fetchChatData when chatId changes
  }, [chatId]); // Depend on chatId

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      const uploadedFiles = [];
      const filePromises = [];

      const compressionOptions = {
        maxSizeMB: 0.1, // Aggressive compression (~100KB max per image)
        maxWidthOrHeight: 800, // Resize large images
        useWebWorker: true,
        fileType: "image/jpeg", // Convert everything to JPEG (smaller size)
      };

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Validate the file size (Limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} exceeds the 5MB size limit.`);
          return;
        }

        const filePromise = new Promise(async (resolve, reject) => {
          try {
            // Compress the image before reading it
            const compressedFile = await imageCompression(
              file,
              compressionOptions
            );

            const reader = new FileReader();
            reader.onloadend = () => {
              uploadedFiles.push(reader.result); // Store Base64 version
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            console.error("Compression Error:", error);
            reject(error);
          }
        });

        filePromises.push(filePromise);
      }

      // Wait for all files to be read
      await Promise.all(filePromises);

      const messageData = {
        chat_id: chatId,
        sender: userId,
        type: "image",
        status: "sent",
        files: uploadedFiles, // Assign the array of filenames
        reply_to: replyingTo,
      };

      const response = await MessageService.createMessage(messageData);
      // Clear form fields and state
      setMsg("");
      setType("text");
      setFile("");
      setSelectedFiles([]);
      setQuotedMessage(null);

      // Scroll to the bottom of the chat container
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } catch (error) {
      console.error("Error sending message: ", error.message);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    try {
      const uploadedFiles = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Compress the file using gzip
        const compressedData = await new Promise((resolve, reject) => {
          gzip(new Uint8Array(arrayBuffer), { level: 9 }, (err, compressed) => {
            if (err) reject(err);
            else resolve(compressed);
          });
        });

        // Convert the compressed data back to a Blob
        const compressedBlob = new Blob([compressedData], {
          type: "application/octet-stream",
        });

        // Generate a Blob URL for the compressed file
        const blobUrl = URL.createObjectURL(compressedBlob);

        uploadedFiles.push(blobUrl);
      }

      console.log("Updated compressed files", uploadedFiles);

      const messageData = {
        chat_id: chatId,
        sender: userId,
        type: "file",
        status: "sent",
        files: uploadedFiles, // Assign the array of filenames
        reply_to: replyingTo,
      };

      const response = await MessageService.createMessage(messageData);
      // Clear form fields and state
      setMsg("");
      setType("text");
      setFile("");
      setSelectedFiles([]);
      setQuotedMessage(null);

      //  // Scroll to the bottom of the chat container
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } catch (error) {
      console.error("Error sending message: ", error.message);
    }
  };

  const handleCopy = (content) => {
    // Copy message content to clipboard
    navigator.clipboard
      .writeText(content)
      .then(() => {
        // Handle success, e.g., show a success message
        toast.success("Message copied to clipboard");
        setShowDropdownForMessage(null);
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error("Error copying message to clipboard:", error);
        toast.error("Failed to copy message to clipboard");
        setShowDropdownForMessage(null);
      });
  };

  const handleClose = () => {
    setShowDropdownForMessage(null);
  };

  return (
    <div className="container w-full bg-orange-50 h-[82vh] px-1 pt-10 pb-4 flex flex-col shadow-lg rounded-lg">
      {floatingTimestamp && (
        <div className="flex items-center justify-center">
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 text-orange-600 text-sm font-medium py-1 px-3 rounded-full shadow-sm">
            {floatingTimestamp}
          </div>
        </div>
      )}
      <div
        className="w-full flex-grow h-[90vh] overflow-y-auto custom-scrollbar"
        ref={chatContainerRef}
      >
        {!isLoaded ? (
          <div className="flex items-center justify-center mt-8">
            <div className="border-t-4 border-orange-500 border-solid rounded-full animate-spin h-12 w-12"></div>
          </div>
        ) : !chat.some((obj) => obj.user_id === userId) ? (
          <div className="text-3xl m-30 w-full p-10 rounded-lg shadow">
            You do not have access to this chat!!!
          </div>
        ) : (
          <div>
            {messages?.map((msg, index) => {
              const messageId = `message-${msg.message_id}`;
              return msg.sender.toString() == userId.toString() ? (
                <div
                  key={index}
                  id={messageId}
                  onContextMenu={(e) => handleRightClick(e, msg.message_id)}
                >
                  <MessageSent
                    key={index}
                    msg={msg}
                    onClick={() => {
                      setShowDropdownForMessage((prevState) => {
                        // If the clicked message already has the dropdown open, close it
                        if (prevState === msg.message_id) {
                          return null;
                        } else {
                          // Otherwise, toggle the dropdown for the clicked message
                          return msg.message_id;
                        }
                      });
                    }}
                  />
                  <div className="flex flex-row-reverse -mt-2">
                    {showDropdownForMessage === msg.message_id && (
                      <MessageDropdown
                        msg={msg}
                        onReply={() => handleReply(msg)}
                        onCopy={() => handleCopy(msg.content)}
                        onEdit={() => handleEdit(msg)}
                        onDelete={() => handleDelete(msg)}
                        onClose={handleClose}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  id={messageId}
                  onContextMenu={(e) => handleRightClick(e, msg.message_id)}
                >
                  <MessageRecieved
                    key={index}
                    msg={msg}
                    // onClick={() => setShowDropdownForMessage(null)}
                    onClick={() => {
                      setShowDropdownForMessage((prevState) => {
                        // If the clicked message already has the dropdown open, close it
                        if (prevState === msg.message_id) {
                          return null;
                        } else {
                          // Otherwise, toggle the dropdown for the clicked message
                          return msg.message_id;
                        }
                      });
                    }}
                  />
                  {showDropdownForMessage === msg.message_id && (
                    <MessageDropdown
                      msg={msg}
                      onReply={() => handleReply(msg)}
                      onCopy={() => handleCopy(msg.content)}
                      onEdit={() => handleEdit(msg)}
                      onDelete={() => handleDelete(msg)}
                      onClose={handleClose}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Text Input Field */}
      {quotedMessage && (
        <div className="bg-gray-100 border-l-4 border-orange-500 px-4 py-2 rounded-md mx-4">
          <QuotedMessage
            message={quotedMessage}
            onClose={() => setQuotedMessage(null)}
          />
        </div>
      )}

      {editing && (
        <div className="flex flex-row justify-between bg-gray-100 border px-4 py-2 rounded-md mx-4">
          Editing the message
          <button
            onClick={handleCancelEdit}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1a9 9 0 100 18 9 9 0 000-18zM6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mx-2 border p-2 rounded-xl bg-white shadow-md">
        {/* Add Media Button on the left */}
        <div>
          {type === "text" ? (
            <button htmlFor="mediaInput" className="cursor-pointer">
              <FontAwesomeIcon
                icon={faCirclePlus}
                className=" h-8 w-8 text-orange-500"
                // style={{ color: "#f97316" }}
                onClick={toggleDropdown}
              />
            </button>
          ) : (
            <button
              className=" h-8 w-8 rounded-full bg-orange-500 text-white"
              onClick={() => {
                setType("text");
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg text-white" />
            </button>
          )}

          {isDropdownOpen && (
            <div className="absolute bottom-24 left-4 bg-white border rounded-md shadow-lg">
              <div className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  {/* <button
                    type="button"
                    onClick={() => {
                      setType("doc");
                      setDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex flex-row gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 border rounded-md border-white hover:border hover:rounded-md hover:bg-gray-100 focus:outline-none focus:border-orange-300 focus:shadow-outline-orange active:bg-gray-200 transition duration-150 ease-in-out"
                  >
                    <div className="text-left ">
                      <FontAwesomeIcon
                        icon={faFile}
                       
                        className="px-2 text-orange-500"
                      />
                      Document
                    </div>
                  </button> */}

                  <button
                    type="button"
                    onClick={() => {
                      setType("image");
                      setDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex flex-row gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 border rounded-md border-white hover:border hover:rounded-md hover:bg-gray-100 focus:outline-none focus:border-orange-300 focus:shadow-outline-orange active:bg-gray-200 transition duration-150 ease-in-out"
                  >
                    <div className="text-left ">
                      <FontAwesomeIcon
                        icon={faImage}
                        // style={{ color: "#f1841e" }}
                        className="px-2 text-orange-500"
                      />
                      Image
                    </div>
                    {/* <input type="file" className="hidden" /> */}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex flex-row gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 border rounded-md border-white hover:border hover:rounded-md hover:bg-gray-100 focus:outline-none focus:border-orange-300 focus:shadow-outline-orange active:bg-gray-200 transition duration-150 ease-in-out"
                  >
                    <div className="text-left ">
                      <FontAwesomeIcon
                        icon={faTimes}
                        // style={{ color: "#f1841e" }}
                        className="px-2 text-orange-500"
                      />
                      Close
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {type === "text" ? (
          <input
            type="text"
            required
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            className="mx-3 w-10/12 flex-grow px-4 py-2 border border-gray-300 rounded-full bg-neutral-100 focus:outline-none focus:border-orange-500"
          />
        ) : type === "image" ? (
          <div className="w-10/12">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap gap-2 my-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16  object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 py-0.5 px-1 bg-white rounded-full text-xs font-medium text-red-600"
                    >
                      <FontAwesomeIcon icon={faClose} className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-10/12">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  .pdf, .docx, .doc (MAX. 500KB)
                </p>
              </div>
              <input
                type="file"
                id="file"
                name="file"
                accept=".pdf, .docx, .doc"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="grid grid-cols-2 gap-2 my-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="col-span-1 bg-amber-100 border-2 shadow-md  rounded-md border-yellow-300 p-2 flex flex-row justify-between"
                >
                  <span>
                    <FontAwesomeIcon
                      icon={faFile}
                      className="mr-2 text-amber-500"
                    />
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600"
                  >
                    <FontAwesomeIcon icon={faClose} className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="rounded-full bg-orange-500 w-12 h-12"
          onClick={
            type === "text"
              ? handleSendMsg
              : type === "image"
              ? handleImageUpload
              : handleFileUpload
          }
        >
          <FontAwesomeIcon
            icon={faPaperPlane}
            className=""
            style={{ color: "#ffffff" }}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
