import React from "react";

const ButtonSearch = ({ type = "button", onClick, className = undefined }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-1 max-[415px]:w-full px-10 rounded-[5px] shadow-sm bg-[#0077b6] text-white ${className} `}
    >
      Search
    </button>
  );
};

export default ButtonSearch;
