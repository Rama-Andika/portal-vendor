import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { Backdrop, Fade, Modal, Pagination, Tooltip } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import { GoPencil } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { CgDanger } from "react-icons/cg";

const VendorAndNonVendor = () => {
  const { screenSize } = useStateContext();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [oriCurrency, setOriCurrency] = useState("");
  const [idrCurrency, setIdrCurrency] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const array = [1, 2, 3, 4];

  const onChangePagination = (e, value) => {
    setPage(value);
  };

  const onChangeTerm = (e) => {
    e.target.validity.valid ? setTerm(e.target.value) : setTerm("");
  };

  const onChangeOriCurrency = (e) => {
    e.target.validity.valid
      ? setOriCurrency(e.target.value)
      : setOriCurrency("");
  };

  const onChangeIdrCurrency = (e) => {
    e.target.validity.valid
      ? setIdrCurrency(e.target.value)
      : setIdrCurrency("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onClickEdit = (index) => {
    handleOpen();
  };
  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20">Vendor & Non Vendor</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form action="">
              <div className="flex gap-5 items-center mb-5">
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Supplier Name
                    </label>
                    <div className="hidden ">:</div>
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
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      PR Number
                    </label>
                    <div className="hidden">:</div>
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
              <div className="flex gap-5 items-center">
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Type
                    </label>
                    <div className="hidden">:</div>
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
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Status
                    </label>
                    <div className="hidden">:</div>
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
        <div className="w-full overflow-x-auto shadow-md text-[14px]">
          <table className="w-full table-monitoring">
            <thead>
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td className="p-5 border">Action</td>
                <td className="p-5 border">No</td>
                <td className="p-5 border">Vendor & Non Vendor</td>
                <td className="p-5 border">Tanggal</td>
                <td className="p-5 border">Month</td>
                <td className="p-5 w-8 border"></td>
                <td className="p-5 border">PR Number</td>
                <td className="p-5 border">Supplier</td>
                <td className="p-5 border">Currency</td>
                <td className="p-5 border">Ori Currency</td>
                <td className="p-5 border">Rate</td>
                <td className="p-5 border">IDR Currency</td>
                <td className="p-5 border">Term (Days)</td>
                <td className="p-5 border">Outstanding Date</td>
                <td className="p-5 border">Indicator</td>
                <td className="p-5 border">Bank Out</td>
                <td className="p-5 border">MCM Reff No</td>
                <td className="p-5 border">Date MCM</td>
                <td className="p-5 border">Payment Date</td>
                <td className="p-5 border">Status</td>
                <td className="p-5 border">Settlement In Oxy</td>
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
                  <td className="p-5 border">Non Vendor</td>
                  <td className="p-5 border">Jul 25, 2023</td>
                  <td className="p-5 border">7</td>
                  <td className="p-5 border w-16">KP</td>
                  <td className="p-5 border">PR/10/22/00402</td>
                  <td className="text-left ps-2 p-5 border">
                    PT MANDIRI TRI MAKMUR (MCM 2MINGGU ON DES 2022 - 11)
                  </td>
                  <td className="p-5 border">IDR</td>
                  <td className="p-5 border">4498777</td>
                  <td className="p-5 border">-</td>
                  <td className="p-5 border">0</td>
                  <td className="p-5 border">2</td>
                  <td className="p-5 border">Jul 25, 2023</td>
                  <td className="p-5 border">
                    <div className="text-red-400 flex items-center gap-1">
                      <span>
                        <CgDanger />
                      </span>
                      Need to pay
                    </div>
                  </td>
                  <td className="text-left p-5 ps-2 border">
                    Mandiri Out MCM Bali (1750001082477)
                  </td>
                  <td className="p-5 border">-</td>
                  <td className="p-5 border">11/4/2022</td>
                  <td className="p-5 border">11/4/2022</td>
                  <td className="p-5 border">Late</td>
                  <td className="p-5 border">TRUE</td>
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
                className={`border-0 bg-white  py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                  screenSize <= 548 ? "w-[90%]" : "w-fit"
                }`}
              >
                <div className="text-[20px] mb-5 font-semibold ">Edit Data</div>
                <div>
                  <form action="">
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Ori Currency</label>
                        </div>
                        <div>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={oriCurrency}
                            onChange={onChangeOriCurrency}
                            onKeyDown={(evt) =>
                              (evt.key === "e" || evt.key === "-") &&
                              evt.preventDefault()
                            }
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">IDR Currency</label>
                        </div>
                        <div>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={idrCurrency}
                            onChange={onChangeIdrCurrency}
                            onKeyDown={(evt) =>
                              (evt.key === "e" || evt.key === "-") &&
                              evt.preventDefault()
                            }
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Rate</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Term (Days)</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            pattern="[0-9]*"
                            value={term}
                            onChange={onChangeTerm}
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Outstanding Date</label>
                        </div>
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker className="w-[208px] max-[490px]:w-full z-[99999999]" />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Payment Date</label>
                        </div>
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker className="w-[208px] max-[490px]:w-full z-[99999999]" />
                            </DemoContainer>
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Bank Out</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">MCM Reff No</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Indicator</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Status</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                      <div>
                        <div className="mb-2">
                          <label htmlFor="">Settlement In Oxy</label>
                        </div>
                        <div>
                          <input
                            type="text"
                            className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="bg-[#0077b6] px-5 py-2 shadow-sm rounded-sm text-white ">
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </AdminWhSmith>
  );
};

export default VendorAndNonVendor;
