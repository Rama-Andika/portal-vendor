import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Backdrop, Fade, Modal, Pagination } from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";
import Select from "react-select";

const options = [
  { value: 0, label: "APPROVED", key: 0 },
  { value: 1, label: "REJECT", key: 1 },
];
const PendingTask = () => {
  const { screenSize } = useStateContext();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState({ value: 0, label: "APPROVED", key: 0 });
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const array = [1, 2, 3, 4];

  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#569cb8"
        : state.isFocused && "#caf0f8",
    }),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setStartDate(dayjs(new Date()));
    setEndDate(dayjs(new Date()));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeStartDate = (value) => {
    setStartDate(value);
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
  };

  const onChangeStatus = (item) => {
    if (item.label === "APPROVED") {
      setReason("");
    }
    setStatus(item);
  };

  const onChangePagination = (e, value) => {
    setPage(value);
  };

  const onClikOpen = () => {
    handleOpen();
  };
  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20">Pending Task</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form action="">
              <div className="flex max-[1254px]:flex-col gap-5 items-center mb-5">
                <div className="flex flex-col gap-3 mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Supplier Name
                    </label>
                    <div className="hidden ">:</div>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[40px] border border-[#cecfcf] rounded-sm hover:border-[#565757] focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-3 w-full ">
                  {screenSize > 500 ? (
                    <>
                      <div className="whitespace-nowrap flex">
                        <label
                          htmlFor=""
                          className="w-36 text-[14px] text-slate-400"
                        >
                          Date
                        </label>
                        <div className="hidden">:</div>
                      </div>

                      <div className="w-full">
                        <div className="flex max-[501px]:flex-col max-[501px]:gap-2 items-center gap-5">
                          <div className="w-full">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  className="w-full"
                                  value={startDate}
                                  onChange={onChangeStartDate}
                                  slotProps={{ textField: { size: "small" } }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                          <div>to</div>
                          <div className="w-full">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                  className="w-full"
                                  value={endDate}
                                  onChange={onChangeEndDate}
                                  slotProps={{ textField: { size: "small" } }}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label
                          className="w-36 text-[14px] text-slate-400"
                          htmlFor=""
                        >
                          From Date
                        </label>
                      </div>
                      <div className="w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="w-full"
                              value={startDate}
                              onChange={onChangeStartDate}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>

                      <div className="mt-8">
                        <label
                          className="w-36 text-[14px] text-slate-400"
                          htmlFor=""
                        >
                          To Date
                        </label>
                      </div>
                      <div className="w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="w-full"
                              value={endDate}
                              onChange={onChangeEndDate}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </>
                  )}
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
                <td className="p-5 border">Nama Supplier </td>
                <td className="p-5 border">Kode Supplier</td>
                <td className="p-5 border">Tanggal Penagihan</td>
                <td className="p-5 border">No Tagihan</td>
                <td className="p-5 border">Nilai Penagihan (Rp)</td>
                <td className="p-5 border">Action</td>
              </tr>
            </thead>
            <tbody>
              {array.map((item, index) => (
                <tr
                  key={index}
                  className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                >
                  <td className="p-5 border">PT xx</td>
                  <td className="p-5 border">001</td>
                  <td className="p-5 border">12/09/23</td>
                  <td className="p-5 border">FR/mm/yy/00000</td>
                  <td className="p-5 border">Rp.</td>
                  <td
                    onClick={onClikOpen}
                    className="p-5 border cursor-pointer text-blue-500 underline"
                  >
                    Open
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 mt-5 rounded-sm py-2 px-5 shadow-md bg-[#217346] w-fit text-white cursor-pointer">
          <div>
            <RiFileExcel2Line />
          </div>
          <div>Download</div>
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
                className={`border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                  screenSize <= 548 ? "w-[90%]" : "w-fit"
                }`}
              >
                <div className="text-[20px] mb-5 font-semibold ">Detail</div>
                <div className="flex flex-col gap-2">
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Supplier
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      PT. Danaco Global Solusi
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Tipe Penagihan
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      Beli Putus
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      No Purchase Order (PO)
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      PO12345678
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Tanggal PO
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      12/09/23
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      No Delivery Order (DO)
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      PTXX12345678901234567XX
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Delivery Area
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      Bali
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      No Invoice
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      PTXX12345678901234567XX
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Tanggal Invoice
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      12/09/23
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Nilai Invoice
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      Rp. 100.000,00
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      Apakah Barang Termasuk Pajak
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                      Ya
                    </div>
                  </div>
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-start gap-2">
                    <div className="w-[270px] whitespace-nowrap font-bold">
                      No Seri Faktur Pajak
                    </div>
                    <div className="max-[549px]:hidden min-[550px]:block">
                      :
                    </div>
                    <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col">
                      <div>010.010-23.12345678</div>
                      <div>010.010-23.12345678</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-sm py-2 px-5 text-white bg-[#217346] w-fit cursor-pointer">
                  Download
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <div className="w-[100px]">Set status to</div>
                  <div>
                    <Select
                      value={status}
                      onChange={onChangeStatus}
                      className="whitespace-nowrap"
                      options={options}
                      noOptionsMessage={() => "Data not found"}
                      styles={customeStyles}
                      required
                    />
                  </div>
                </div>

                {status.label === "REJECT" && (
                  <div className="mt-5 flex flex-col gap-2">
                    <label htmlFor="">Reject Reason</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      cols="30"
                      rows="5"
                    ></textarea>
                  </div>
                )}

                <div className="mt-5 flex max-[479px]:flex-col max-[479px]:items-start items-center gap-2 text-center">
                  <div
                    onClick={handleClose}
                    className="rounded-sm py-2 px-4 shadow-sm border border-gray-400 cursor-pointer max-[479px]:w-full"
                  >
                    Back
                  </div>
                  <div className="rounded-sm py-2 px-4 shadow-sm bg-[#0077b6] text-white cursor-pointer max-[479px]:w-full">
                    Submit
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </AdminWhSmith>
  );
};

export default PendingTask;
