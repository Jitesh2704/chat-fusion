import React from "react";

const QuotedMessage = ({ message, onClose }) => {
   let content = "";

   if (message.type === "text") {
     content = message.content;
   } else if (message.type === "image") {
     content = "Photo";
   } else if (message.type === "file") {
     content = "Attachment";
   }
  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col flex-1">
        <div className="font-semibold">Replying to:</div>
        <div className="text-black">{content}</div>
      </div>
      <button
        onClick={onClose}
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
  );
};

export default QuotedMessage;
