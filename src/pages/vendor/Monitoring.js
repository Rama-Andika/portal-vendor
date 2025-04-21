import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import titleCase from "../../components/functions/TitleCase";
import isEmpty from "../../components/functions/CheckEmptyObject";
import accountingNumber from "../../components/functions/AccountingNumber";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Select from "react-select";
import ButtonSearch from "../../components/button/ButtonSearch";
import { toast } from "sonner";

const srcStatusOptions = [
  { value: 0, label: "All", key: 0 },
  { value: "APPROVED", label: "Approved", key: 0 },
  { value: "DRAFT", label: "Draft", key: 1 },
  { value: "REJECT", label: "Reject", key: 1 },
  { value: "Waiting_for_approval", label: "Waiting", key: 1 },
  { value: "CLOSED", label: "Closed", key: 1 },
];

const api = process.env.REACT_APP_BASEURL;

const Monitoring = () => {
  const [totalInvoice, setTotalInvoice] = useState([]);

  const { screenSize } = useStateContext();
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState();
  const vendorId = Cookies.get("vendor_id");
  const [listPenagihan, setListPenagihan] = useState([]);
  const [detail, setDetail] = useState({});

  const [srcStatus, setSrcStatus] = useState({});
  const [ignoreDate, setIgnoreDate] = useState(1);
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));

  //pagination state
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [page, setPage] = useState(1);
  //end pagination state

  const navigate = useNavigate();

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

  // eslint-disable-next-line no-new-object
  const fetchData = async (parameter = new Object()) => {
    setOpenBackdrop(true);
    if (vendorId !== undefined) {
      parameter["vendor_id"] = vendorId;
      await fetch(`${api}api/portal-vendor/list/penagihan`, {
        method: "POST",
        body: JSON.stringify(parameter),
      })
        .then((response) => response.json())
        .then((res) => {
          setTotal(res.total);
          setCount(Math.ceil(res.total / res.limit));
          setLimit(res.limit);
          // eslint-disable-next-line array-callback-return
          res.data.map((data) => {
            var total = 0;
            data.nilai_invoices.map((nilai) => (total += nilai));
            setTotalInvoice((prev) => [
              ...prev,
              { id: data.id, total: total.toFixed(2) },
            ]);
          });

          setListPenagihan(res.data);
          setOpenBackdrop(false);
        })
        .catch((err) => {
          setOpenBackdrop(false);
        });
    } else {
      setOpenBackdrop(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onClickNoRequest = (item) => {
    if (Cookies.get("token") !== undefined) {
      if (item.status === "DRAFT") {
        navigate(`/vendor/penagihan/edit/${item.id}`, {
          state: { vendor_id: vendorId },
        });
      } else {
        handleOpen();
        setDetail(item);
      }
    } else {
      navigate("/");
      toast.error("Silahkan Login Terlebih Dahulu!");
    }
  };

  const onChangeSrcStatus = (item) => {
    setSrcStatus(item);
  };

  const onChangeStartDate = (value) => {
    setStartDate(value);
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (srcStatus.value !== 0) {
      parameter["status"] = srcStatus.value;
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    setStart(0);
    setPage(1);

    fetchData(parameter);
  };

  const onChangePagination = (e, value) => {
    let parameter = {};
    let limitTemp = limit;

    if (value > page) {
      limitTemp = limitTemp * value - limit;
      parameter = { start: limitTemp };
    } else {
      limitTemp = limitTemp * value - limit;
      parameter = { start: limitTemp };
    }

    if (srcStatus.value !== 0) {
      parameter["status"] = srcStatus.value;
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <>
        <div
          className={`${
            screenSize < 768 ? "px-5 pt-20" : "px-10"
          } pt-20 font-roboto `}
        >
          <div className="mb-20 max-[349px]:mb-5">Monitoring</div>
          <div className="mb-5 w-[80%] max-[638px]:w-full">
            <div className="mb-5 text-slate-400">Searching Parameter</div>
            <div>
              <form action="">
                <div className="flex max-[1254px]:flex-col gap-5 items-center mb-5">
                  <div className="flex flex-col gap-3 mb-3 w-full ">
                    <div className="whitespace-nowrap flex">
                      <label
                        htmlFor=""
                        className="w-36 text-[14px] text-slate-400"
                      >
                        Status
                      </label>
                      <div className="hidden ">:</div>
                    </div>
                    <div className="w-full">
                      <Select
                        value={srcStatus}
                        onChange={onChangeSrcStatus}
                        className="whitespace-nowrap"
                        options={srcStatusOptions}
                        noOptionsMessage={() => "Data not found"}
                        styles={customeStyles}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full mb-3 ">
                    <div className="whitespace-nowrap flex">
                      <label
                        htmlFor=""
                        className="w-36 text-[14px] text-slate-400"
                      >
                        Date Submit
                      </label>
                      <div className="hidden">:</div>
                    </div>
                    <div className="flex max-[1254px]:items-start items-center gap-2 max-[1254px]:flex-col">
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
                      <div className="flex gap-1 items-center text-[12px]">
                        <div>
                          <input
                            onChange={() =>
                              setIgnoreDate((prev) => (prev === 1 ? 0 : 1))
                            }
                            type="checkbox"
                            className="checked:bg-[#0077b6] border-[#cecfcf]"
                            value="1"
                            checked={ignoreDate === 1 ? true : false}
                          />
                        </div>
                        <div className="whitespace-nowrap">Ignore</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <ButtonSearch onClick={(e) => onSearch(e)} />
                </div>
              </form>
            </div>
          </div>
          <div className="w-full mt-20 mb-10">
            <div className="w-full overflow-x-auto shadow-md text-[14px]">
              <table className="w-full table-monitoring">
                <thead>
                  <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                    <td className="p-5 border">No Request </td>
                    <td className="p-5 border">Tanggal Submit</td>
                    <td className="p-5 border">Tanggal Approved</td>
                    <td className="p-5 border">Tanggal Pembayaran</td>
                    <td className="p-5 border">Nilai Penagihan</td>
                    <td className="p-5 border">Status Penagihan</td>
                    <td className="p-5 border">No Tukar Faktur</td>
                  </tr>
                </thead>
                <tbody>
                  {listPenagihan.map((item, index) => (
                    <tr
                      key={index}
                      className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white "
                    >
                      <td
                        onClick={() => onClickNoRequest(item)}
                        className="p-5 border underline text-blue-400 cursor-pointer"
                      >
                        {item.no_request}
                      </td>
                      <td className="p-5 border">
                        {dayjs(item.created_at).format("DD/MM/YYYY")}
                      </td>
                      <td className="p-5 border">
                        {item.status === "APPROVED"
                          ? dayjs(item.updated_at).format("DD/MM/YYYY")
                          : ""}
                      </td>
                      <td className="p-5 border">
                        {item.due_date
                          ? dayjs(item.due_date).format("DD/MM/YYYY")
                          : ""}
                      </td>
                      <td className="p-5 border">
                        Rp.{" "}
                        {accountingNumber(
                          totalInvoice.filter(
                            (value) => value.id === item.id
                          )[0]?.total
                        )}
                      </td>
                      <td className="p-5 border">
                        {titleCase(item.status, "_")}
                      </td>
                      <td className="p-5 border">{item.doc_receive_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {listPenagihan.length > 0 && (
              <>
                <div className="mt-10">
                  <Pagination
                    count={count}
                    page={page}
                    onChange={onChangePagination}
                    showFirstButton
                    showLastButton
                    size="small"
                  />
                </div>
              </>
            )}
          </div>
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
                {!isEmpty(detail) && (
                  <>
                    <div className="text-[20px] mb-5 font-semibold ">
                      Detail
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          No Request
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                          {detail.no_request}
                        </div>
                      </div>
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Tanggal Submit
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                          {dayjs(detail.created_at).format("DD/MM/YYYY")}
                        </div>
                      </div>
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Supplier
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                          {detail.vendor.nama}
                        </div>
                      </div>
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Tipe Penagihan
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden text-red-500">
                          {titleCase(detail.tipe_penagihan, "_")}
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
                          {detail.nomer_po}
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
                          {dayjs(detail.tanggal_po).format("DD/MM/YYYY")}
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
                          {detail.delivery_area}
                        </div>
                      </div>
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowwrap font-bold">
                          Periode Acuan Penagihan
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                          12/09/23
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
                          {detail.nomer_invoices.map((nomer) => (
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
                          {detail.tanggal_invoices.map((tanggal) => (
                            <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                              {dayjs(tanggal).format("DD/MM/YYYY")}
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
                          {detail.nilai_invoices.map((nilai) => (
                            <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                              Rp. {accountingNumber(nilai)}
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
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col">
                          <div>{detail.is_pajak === 0 ? "Tidak" : "Ya"}</div>
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
                          {detail.nomer_seri_pajak.map((nomer) => (
                            <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                              {nomer}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Status
                        </div>
                        <div className="max-[549px]:hidden min-[550px]:block">
                          :
                        </div>
                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col underline">
                          <div>{detail.status}</div>
                        </div>
                      </div>
                      {detail.status === "REJECT" && (
                        <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                          <div className="w-[270px] whitespace-nowrap font-bold">
                            Reject Message
                          </div>
                          <div className="max-[549px]:hidden min-[550px]:block">
                            :
                          </div>
                          <div className="w-[240px] max-[549px]:w-full overflow-hidden flex flex-col">
                            <div>{detail.reason}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {detail.status === "REJECT" && (
                      <Link
                        className="flex justify-end"
                        to={`/vendor/penagihan/edit/${detail.id}`}
                        state={{ vendor_id: vendorId }}
                      >
                        <div className="mt-5 rounded-sm py-1 px-8 text-white bg-[#00b4d8] w-fit cursor-pointer">
                          Revisi
                        </div>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </Fade>
          </Modal>
        </div>
      </>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 99999 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Monitoring;
