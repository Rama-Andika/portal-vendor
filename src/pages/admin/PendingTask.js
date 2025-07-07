import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";

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
import titleCase from "../../components/functions/TitleCase";
import isEmpty from "../../components/functions/CheckEmptyObject";
import accountingNumber from "../../components/functions/AccountingNumber";
import { PiFileZipDuotone } from "react-icons/pi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import ButtonSearch from "../../components/button/ButtonSearch";
import { PenagihanDetail } from "../vendor/Monitoring";

const options = [
  { value: "APPROVED", label: "APPROVED", key: 0 },
  { value: "REJECT", label: "REJECT", key: 1 },
  { value: "CANCEL", label: "CANCEL", key: 2 },
];

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const PendingTask = () => {
  const { screenSize } = useStateContext();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  // eslint-disable-next-line no-unused-vars
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [totalInvoice, setTotalInvoice] = useState([]);

  //pagination state
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [page, setPage] = useState(1);
  //end pagination state

  const [listPenagihan, setListPenagihan] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);
  const [penagihanDetail, setPenagihanDetail] = useState({});
  const [ignoreDate, setIgnoreDate] = useState(1);

  const navigate = useNavigate();
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
      setPenagihanDetail({ ...penagihanDetail, reason: "" });
    }
    setPenagihanDetail({ ...penagihanDetail, status: item.value });
  };

  const onClikOpen = (item) => {
    if (Cookies.get("admin_token") !== undefined) {
      handleOpen();
      setPenagihanDetail(item);
    } else {
      navigate("/admin");
    }
  };

  // eslint-disable-next-line no-new-object
  const fetchData = async (parameter = new Object()) => {
    setOpenBackdrop(true);
    parameter["status"] = "Waiting_for_approval";
    await fetch(`${api}api/portal-vendor/list/penagihan`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((data) => {
        setTotal(data.total);
        setCount(Math.ceil(data.total / data.limit));
        setLimit(data.limit);
        setOpenBackdrop(false);
        // eslint-disable-next-line array-callback-return
        data.data.map((data, index) => {
          var total = 0;
          data.nilai_invoices.map((nilai) => (total += nilai));
          setTotalInvoice((prev) => [
            ...prev,
            { id: data.id, total: total.toFixed(2) },
          ]);
        });

        setListPenagihan(data.data);
      })
      .catch((err) => {
        console.log(err);
        setOpenBackdrop(false);
      });
  };

  const btnSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (name.trim().length > 0) {
      parameter = { vendor_name: name };
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

    if (name.trim().length > 0) {
      parameter["name"] = name;
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  const onSubmitDocument = async (item) => {
    setOpenBackdrop(true);
    let isSave = false;
    if (item.status === "REJECT") {
      if (item.reason.trim().length > 0) {
        isSave = true;
      } else {
        isSave = false;
      }
    } else if (item.status === "APPROVED") {
      if (item.note.trim().length > 0) {
        isSave = true;
      } else {
        isSave = false;
      }
    } else {
      isSave = true;
    }

    const locationIds = item.locations.map((location) => location.id);

    if (Cookies.get("admin_token") !== undefined) {
      if (isSave) {
        const initialValue = {
          id: item.id,
          vendor_id: item.vendor_id,
          no_request: item.no_request,
          tipe_penagihan: item.tipe_penagihan,
          tipe_pengiriman: item.tipe_pengiriman,
          nomer_po: item.nomer_po,
          tanggal_po: item.tanggal_po,
          nomer_do: item.nomer_do,
          delivery_area: item.delivery_area,
          nomer_invoices: item.nomer_invoices,
          tanggal_invoices: item.tanggal_invoices,
          start_dates: item.start_dates,
          end_dates: item.end_dates,
          location_ids: locationIds.length > 0 ? locationIds : null,
          nilai_invoices: item.nilai_invoices,
          is_pajak: item.is_pajak,
          nomer_seri_pajak: item.nomer_seri_pajak,
          start_date_periode:
            item.start_date_periode !== null
              ? dayjs(item.start_date_periode).format("YYYY-MM-DD HH:mm:ss")
              : null,
          end_date_periode:
            item.end_date_periode !== null
              ? dayjs(item.end_date_periode).format("YYYY-MM-DD HH:mm:ss")
              : null,
          created_at: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          reason: item.reason,
          status: item.status,
          note: item.note,
          due_date:
            item.due_date !== null
              ? dayjs(item.due_date).format("YYYY-MM-DD HH:mm:ss")
              : dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          user_id: Cookies.get("admin_id"),
        };

        await fetch(`${api}api/portal-vendor/invoice`, {
          method: "POST",
          body: JSON.stringify(initialValue),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.data === "0") {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di perbaharui, " + res.message);
            } else {
              setOpen(false);
              fetchData();
              setOpenBackdrop(false);
              toast.success("Penagihan berhasil di perbaharui");
            }
          })
          .catch((err) => {
            console.log(err);
            setOpenBackdrop(false);
            fetchData();
            toast.error("Penagihan gagal di perbaharui");
          });
      } else {
        setOpenBackdrop(false);
        toast.error("Ada data yang masih kosong");
      }
    } else {
      navigate("/admin");
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20 max-[349px]:mb-5">Daftar Penagihan Tertunda</div>
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
                      Nama Vendor
                    </label>
                    <div className="hidden ">:</div>
                  </div>
                  <div className="w-full">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[40px] border border-[#cecfcf] rounded-sm hover:border-[#565757] focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full mb-3 ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Tanggal
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
                      <div className="whitespace-nowrap">Abaikan</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <ButtonSearch onSearch={(e) => btnSearch(e)} />
              </div>
            </form>
          </div>
        </div>
        <div className="w-full overflow-auto shadow-md max-h-[400px] text-[14px]">
          <table className="w-full table-monitoring">
            <thead className="sticky top-0">
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td className="p-5 border">Nomor Request</td>
                <td className="p-5 border">Nama</td>
                <td className="p-5 border">Kode</td>
                <td className="p-5 border">Tanggal Penagihan</td>
                <td className="p-5 border">Nomor Tagihan</td>
                <td className="p-5 border">Nilai Penagihan (Rp)</td>
                <td className="p-5 border">Action</td>
              </tr>
            </thead>
            <tbody>
              {listPenagihan.length > 0 ? (
                listPenagihan.map((item, index) => (
                  <tr
                    key={index}
                    className="whitespace-nowrap hover:bg-slate-100 border bg-white"
                  >
                    <td className="p-5 border">{item.no_request}</td>
                    <td className="p-5 border">{item.vendor.nama}</td>
                    <td className="p-5 border">{item.vendor.kode}</td>
                    <td className="p-5 border">
                      {dayjs(item.created_at).format("DD/MM/YYYY")}
                    </td>

                    <td className="p-5 border"></td>
                    <td className="p-5 border">
                      Rp.{" "}
                      {accountingNumber(
                        totalInvoice.filter((value) => value.id === item.id)[0]
                          ?.total
                      )}
                    </td>

                    <td
                      onClick={() => onClikOpen(item)}
                      className="p-5 border cursor-pointer"
                    >
                      <div className="py-2 px-4 rounded-lg bg-gray-200">
                        Detail
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-5" colSpan={7}>
                    Data Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {listPenagihan.length > 0 && (
          <>
            <a
              //onClick={ExportToExcel(data, "list penagihan")}
              href={`${apiExport}servlet/com.project.ccs.report.RptPVPenagihanDetailXLS?status=Waiting_for_approval&vendorName=${
                name.trim().length > 0 ? name : ""
              }&startDate=${
                ignoreDate === 0 ? dayjs(startDate).format("YYYY-MM-DD") : ""
              }&endDate=${
                ignoreDate === 0 ? dayjs(endDate).format("YYYY-MM-DD") : ""
              } `}
              className="flex items-center gap-2 mt-5 rounded-sm py-2 px-5 shadow-md bg-[#217346] w-fit text-white cursor-pointer"
            >
              <div>
                <RiFileExcel2Line />
              </div>
              <div>Download</div>
            </a>

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
                  className={`border-0 rounded-md bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                    screenSize <= 548 ? "w-[90%]" : "w-fit"
                  }`}
                >
                  <div className="text-[20px] mb-5 font-semibold ">Detail</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Vendor
                      </div>

                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {penagihanDetail.vendor.nama}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Tipe Penagihan
                      </div>

                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(penagihanDetail.tipe_penagihan)}
                      </div>
                    </div>
                    {penagihanDetail.tipe_penagihan === "konsinyasi" && (
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Duration
                        </div>

                        <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                          {titleCase(penagihanDetail.penagihan_cons_type)}
                        </div>
                      </div>
                    )}
                    {penagihanDetail.start_dates.some(
                      (invoice) => invoice !== null
                    ) > 0 && (
                      <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                        <div className="w-[270px] whitespace-nowrap font-bold">
                          Date
                        </div>

                        <div className="flex flex-col gap-1">
                          {penagihanDetail.start_dates.map((date, i) => (
                            <div className="flex items-center gap-2 w-[240px] ">
                              <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                                {dayjs(date).format("DD/MM/YYYY")}
                              </div>
                              <span>s/d</span>
                              <div className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                                {dayjs(penagihanDetail.end_dates[i]).format(
                                  "DD/MM/YYYY"
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <PenagihanDetail data={penagihanDetail} />
                  </div>

                  <a
                    href={`${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?oid=${penagihanDetail.id}`}
                    className="mt-5 rounded-sm py-2 px-5 text-white bg-[#d4a373] w-fit cursor-pointer flex gap-1 items-center"
                  >
                    <div>
                      <PiFileZipDuotone />
                    </div>
                    <div>Download</div>
                  </a>

                  <div className="flex max-[402px]:flex-col items-center max-[402px]:items-start gap-2 mt-5">
                    <div className="w-[100px]">Set status to</div>
                    <div className="max-[402px]:w-full">
                      <Select
                        value={{
                          value: penagihanDetail.status,
                          label: penagihanDetail.status,
                        }}
                        onChange={onChangeStatus}
                        className="whitespace-nowrap"
                        options={options}
                        noOptionsMessage={() => "Data not found"}
                        styles={customeStyles}
                        required
                      />
                    </div>
                  </div>

                  {penagihanDetail.status === "REJECT" && (
                    <div className="mt-5 flex flex-col gap-2">
                      <label htmlFor="">Reject Reason</label>
                      <textarea
                        value={penagihanDetail.reason}
                        onChange={(e) =>
                          setPenagihanDetail({
                            ...penagihanDetail,
                            reason: e.target.value,
                          })
                        }
                        cols="30"
                        rows="5"
                      ></textarea>
                    </div>
                  )}

                  {penagihanDetail.status === "APPROVED" && (
                    <>
                      <div className="mt-5 flex flex-col gap-2">
                        <label htmlFor="">Note *</label>
                        <textarea
                          value={penagihanDetail.note}
                          onChange={(e) =>
                            setPenagihanDetail({
                              ...penagihanDetail,
                              note: e.target.value,
                            })
                          }
                          cols="30"
                          rows="5"
                        ></textarea>
                      </div>

                      <div className="mt-5 flex flex-col gap-2">
                        <label htmlFor="">Due Date</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="w-full"
                              value={
                                penagihanDetail.due_date !== null
                                  ? dayjs(penagihanDetail.due_date)
                                  : dayjs(new Date())
                              }
                              onChange={(value) =>
                                setPenagihanDetail({
                                  ...penagihanDetail,
                                  due_date: value,
                                })
                              }
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </>
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
                      className="rounded-md py-2 px-5 shadow-sm bg-main-color text-white cursor-pointer max-[479px]:w-full"
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
    </>
  );
};

export default PendingTask;
