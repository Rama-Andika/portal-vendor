import React from "react";

const ButtonSearch = ({ onSearch, className }) => {
  return (
    <button
      onClick={onSearch}
      className={`py-1 max-[415px]:w-full px-10 rounded-md shadow-sm bg-main-color  ${className}`}
    >
      Search
    </button>
  );
};

export default ButtonSearch;
