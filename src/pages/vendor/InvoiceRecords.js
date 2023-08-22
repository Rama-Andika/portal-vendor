import { Backdrop, Fade, Modal, Pagination, Tooltip } from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";
import Admin from "../../layouts/Admin";
import { useState } from "react";
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { FileUploader } from "react-drag-drop-files";

const InvoiceRecords = () => {
  const { screenSize } = useStateContext();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const fileTypes = ["JPG", "PNG", "PDF"];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const array = [1, 2, 3, 4];

  const onChangePagination = (e, value) => {
    setPage(value);
  };

  const onClickEdit = () => {
    handleOpen();
  };

  const handleChangeFile = (file) => {
    setFile(file);
  };
  return (
    <Admin>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto pb-10 `}
      >
        <div className="mb-20">Invoice Records</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form action="">
              <div className="flex gap-1 items-center">
                <div className="flex flex-col min-[612px]:flex-row gap-1 min-[612px]:gap-2 mb-3 w-full min-[612px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                      Document Number
                    </label>
                    <div className="hidden min-[612px]:block">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[70%] max-[638px]:w-full overflow-x-auto shadow-md text-[14px]">
          <table className="w-full table-monitoring">
            <thead>
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td className="p-5 border w-[30px]">Action</td>
                <td className="p-5 border w-[30px]">No</td>
                <td className="p-5 border w-[30px]">Document Number</td>
                <td className="p-5 border">Document</td>
              </tr>
            </thead>
            <tbody>
              {array.map((item, index) => (
                <tr
                  key={index}
                  className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                >
                  <td className="p-5 border">
                    <div className="flex gap-2 items-center">
                      <Tooltip title="edit" arrow placement="left">
                        <div
                          className="cursor-pointer hover:scale-[1.1] text-orange-500"
                          onClick={() => onClickEdit(index)}
                        >
                          <GoPencil />
                        </div>
                      </Tooltip>

                      <Tooltip title="delete" arrow placement="right">
                        <div className="cursor-pointer hover:scale-[1.1] text-red-600">
                          <MdDeleteOutline />
                        </div>
                      </Tooltip>
                    </div>
                  </td>
                  <td className="p-5 border">{index + 1}</td>
                  <td className="p-5 border">DC001</td>
                  <td className="p-5 border text-blue-500 cursor-pointer">
                    Preview
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <Pagination
            count={20}
            page={page}
            onChange={onChangePagination}
            showFirstButton
            showLastButton
            size="small"
          />
        </div>

        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <div
                className={`border-0 bg-white  py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%]  overflow-y-auto z-[999999]  ${
                  screenSize <= 548 ? "w-[90%]" : "w-fit"
                }`}
              >
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
            </Fade>
          </Modal>
        </div>
      </div>
    </Admin>
  );
};

export default InvoiceRecords;
