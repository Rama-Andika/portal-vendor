import { RiFileExcel2Line } from "react-icons/ri";

const ButtonPrintExcel = ({ onClickExport }) => {
  return (
    <button
      onClick={onClickExport}
      type="button"
      className="bg-[#38b000] text-white p-2 rounded-md"
    >
      <RiFileExcel2Line />
    </button>
  );
};

export default ButtonPrintExcel;
