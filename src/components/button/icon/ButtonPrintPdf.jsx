import React from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { Link } from "react-router-dom";

const ButtonPrintPdf = ({ onClickExport }) => {
  return (
    <button onClick={onClickExport} type="button" className="bg-[#ef233c] text-white p-2 rounded-md">
      <BsFiletypePdf />
    </button>
  );
};

export default ButtonPrintPdf;
