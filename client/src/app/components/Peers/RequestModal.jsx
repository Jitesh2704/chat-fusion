// RequestModal.js
import React, { useState } from "react";

function RequestModal({ isOpen, onClose, onConfirm }) {
  const [receiverStatus, setReceiverStatus] = useState("");
  const [senderStatus, setSenderStatus] = useState("");

  const handleClose = () => {
    setReceiverStatus("");
    setSenderStatus("");
    onClose(); // Invoke the onClose function passed as prop to close the modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ receiverStatus, senderStatus });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 border-2 w-1/2 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Send Connection Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="receiverStatus"
              className="block text-sm font-medium mb-1"
            >
              Receiver Status:
            </label>
            <input
              id="receiverStatus"
              type="text"
              value={receiverStatus}
              onChange={(e) => setReceiverStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="senderStatus"
              className="block text-sm font-medium mb-1"
            >
              Your Status:
            </label>
            <input
              id="senderStatus"
              type="text"
              value={senderStatus}
              onChange={(e) => setSenderStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;
