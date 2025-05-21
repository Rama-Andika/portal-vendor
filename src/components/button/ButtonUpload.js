import React from "react";

const ButtonUpload = ({ onClick, className = undefined }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-[#0077B6] rounded-[5px] px-[20px] py-[2px] ${className} `}
    >
      Upload
    </button>
  );
};

export default ButtonUpload;
