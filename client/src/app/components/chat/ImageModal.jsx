import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div className="max-w-full max-h-full">
        <img
          src={imageUrl}
          alt="Full Screen Image"
          className="w-[80vw] h-[90vh] object-contain"
        />
        <button
          className="absolute top-16 right-4 p-2 bg-white rounded-md text-gray-800"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
