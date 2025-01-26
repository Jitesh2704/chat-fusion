// MessageDropdown.jsx

import React from "react";
import { useSelector } from "react-redux";

const MessageDropdown = ({ msg, onReply, onCopy, onEdit, onClose, onDelete }) => {
    const { user } = useSelector((state) => state.auth);
    const userId = user?.user_id;

  return (
    <div className="mt-2 w-48 bg-white border rounded-md shadow-lg origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <button
          onClick={onReply}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Reply
        </button>
        {msg.content !== "this message has been deleted" &&
          msg.type === "text" && (
            <button
              onClick={onCopy}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Copy
            </button>
          )}
        {userId === msg.sender &&
          msg.content !== "this message has been deleted" &&
          msg.type === "text" && (
            <button
              onClick={onEdit}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Edit
            </button>
          )}
        {userId === msg.sender &&
          msg.content !== "this message has been deleted" && (
            <button
              onClick={onDelete}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Delete
            </button>
          )}
        <button
          onClick={onClose}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageDropdown;
