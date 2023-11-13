import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";
import Select from "react-select";
import Api from "../../api";
import titleCase from "../../components/functions/TitleCase";
import isEmpty from "../../components/functions/CheckEmptyObject";
import toast from "react-hot-toast";

const options = [
  { value: "APPROVED", label: "APPROVED", key: 0 },
  { value: "REJECT", label: "REJECT", key: 1 },
];
const PendingTask = () => {
  const { screenSize } = useStateContext();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState({
    value: "APPROVED",
    label: "APPROVED",
    key: 0,
  });
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalInvoice, setTotalInvoice] = useState([]);

  const [listPenagihan, setListPenagihan] = useState([]);
  const [penagihanDetail, setPenagihanDetail] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    fetchData();

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

  const onClikOpen = (item) => {
    handleOpen();

    setPenagihanDetail(item);
  };

  const fetchData = async (query) => {
    setOpenBackdrop(true);
    await Api.get(
      `/penagihan?status=waiting_for_approval${
        query !== undefined ? query : ""
      }`
    ).then((response) => {
      setOpenBackdrop(false);
      // eslint-disable-next-line array-callback-return
      response.data.map((data, index) => {
        var total = 0;
        data.nilai_invoices.map((nilai) => (total += nilai));
        setTotalInvoice((prev) => {
          return [...prev, total];
        });
      });

      setListPenagihan(response.data);
    });
  };

  const btnSearch = (e) => {
    console.log("search");
    e.preventDefault();
    let queryString = "";
    if (name.trim().length > 0) {
      queryString += `&vendor.name=${name}`;
    }
    fetchData(queryString);
  };

  const onSubmitDocument = async (item) => {
    let isSave = false;
    if (status.value === "REJECT") {
      if (reason.trim().length > 0) {
        isSave = true;
      } else {
        isSave = false;
      }
    } else {
      isSave = true;
    }

    if (isSave) {
      const inititalValue = item;
      inititalValue.updated_at = dayjs(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      inititalValue.reason = reason;
      inititalValue.status = status.value;
      setOpenBackdrop(true);
      await Api.put(`/penagihan/${item.id}`, inititalValue, {
        headers: {
          "content-type": "application/json",
        },
      })
        .then(() => {
          setOpen(false);
          setOpenBackdrop(false);
          fetchData();
          toast.success("Penagihan update success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        })
        .catch(() => {
          setOpenBackdrop(false);
          toast.error("Penagihan update failed!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        });
    } else {
      toast.error("Reason Masih Kosong!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20 max-[349px]:mb-5">Pending Task</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form onSubmit={(e) => btnSearch(e)}>
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
                      value={name}
                      name=""
                      id=""
                      onChange={(e) => setName(e.target.value)}
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
                <button
                  type="submit"
                  className="py-1 max-[415px]:w-full px-10 rounded-md shadow-sm bg-[#0077b6] text-white"
                >
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
              {listPenagihan.map((item, index) => (
                <tr
                  key={index}
                  className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                >
                  <td className="p-5 border">{item.vendor.nama}</td>
                  <td className="p-5 border"></td>
                  <td className="p-5 border">
                    {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </td>

                  <td className="p-5 border"></td>
                  <td className="p-5 border">Rp. {totalInvoice[index]}</td>

                  <td
                    onClick={() => onClikOpen(item)}
                    className="p-5 border cursor-pointer"
                  >
                    <div className="py-2 px-1 rounded-lg bg-gray-200">
                      Detail
                    </div>
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
              {!isEmpty(penagihanDetail) && (
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
                        {penagihanDetail.vendor.nama}
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
                        {titleCase(penagihanDetail.tipe_penagihan)}
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
                        {penagihanDetail.nomer_po}
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
                        {dayjs(penagihanDetail.tanggal_po).format("DD/MM/YYYY")}
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
                        {penagihanDetail.nomer_do}
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
                        {titleCase(penagihanDetail.delivery_area)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start  gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        No Invoice
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="flex flex-col gap-1">
                        {penagihanDetail.nomer_invoices.map((nomer) => (
                          <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {nomer}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Tanggal Invoice
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="flex flex-col gap-1">
                        {penagihanDetail.tanggal_invoices.map((tanggal) => (
                          <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {dayjs(tanggal).format('DD/MM/YYYY')}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Nilai Invoice
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="flex flex-col gap-1">
                        {penagihanDetail.nilai_invoices.map((nilai) => (
                          <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                            Rp. {nilai}
                          </div>
                        ))}
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
                        {penagihanDetail.isPajak === 0 ? "Ya" : "Tidak"}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        No Seri Faktur Pajak
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="flex flex-col gap-1">
                        {penagihanDetail.nomer_seri_pajak.map((nilai) => (
                          <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {nilai}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-sm py-2 px-5 text-white bg-[#217346] w-fit cursor-pointer">
                    Download
                  </div>

                  <div className="flex max-[402px]:flex-col items-center max-[402px]:items-start gap-2 mt-5">
                    <div className="w-[100px]">Set status to</div>
                    <div className="max-[402px]:w-full">
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

                  <div className="mt-5 flex max-[479px]:flex-col max-[479px]:items-start items-center gap-2 text-center justify-between">
                    <div
                      onClick={handleClose}
                      className="rounded-md py-2 px-5 shadow-sm border border-gray-400 cursor-pointer max-[479px]:w-full"
                    >
                      Back
                    </div>
                    <div
                      onClick={() => onSubmitDocument(penagihanDetail)}
                      className="rounded-md py-2 px-5 shadow-sm bg-[#0077b6] text-white cursor-pointer max-[479px]:w-full"
                    >
                      Submit
                    </div>
                  </div>
                </div>
              )}
            </Fade>
          </Modal>
        </div>
      </div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999999999,
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </AdminWhSmith>
  );
};

export default PendingTask;
