import { FileUploader } from "react-drag-drop-files";
import { useStateContext } from "../../contexts/ContextProvider";
import Admin from "../../layouts/Admin";
import { useState } from "react";

const UploadFile = () => {
  const { screenSize } = useStateContext();
  const [file, setFile] = useState(null);
  const fileTypes = ["JPEG", "PDF"];

  const handleChangeFile = (file) => {
    setFile(file);
  };

  return (
    <Admin>
      <div className={`${screenSize < 768 ? "px-5 pt-20" : "px-10 pt-20"}`}>
        <div className="flex flex-col justify-center items-center px-10">
          <FileUploader
            name="file"
            handleChange={handleChangeFile}
            types={fileTypes}
          />
          <div className="mt-5">
            {file ? `File Name : ${file.name}` : "Upload Your File"}
          </div>
          <div className="mt-5">
            <button className="py-2 px-10 shadow-sm text-white rounded-sm bg-[#0077b6]">
              Upload
            </button>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default UploadFile;
