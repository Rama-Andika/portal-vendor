import { RiFileExcel2Line } from "react-icons/ri";

const ButtonPrintExcel = ({ href = "", name = "Download" }) => {
  return (
    <a
      href={href}
      className="flex items-center gap-2 mt-5 rounded-sm py-2 px-5 shadow-md bg-[#217346] w-fit text-white cursor-pointer"
    >
      <div>
        <RiFileExcel2Line />
      </div>
      <div>{name}</div>
    </a>
  );
};

export default ButtonPrintExcel;
