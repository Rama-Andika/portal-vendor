import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import isEmpty from "../components/functions/CheckEmptyObject";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Select from "react-select";
import toast from "react-hot-toast";
import accountingNumber from "../components/functions/AccountingNumber";
import titleCase from "../components/functions/TitleCase";
import ButtonPrintExcel from "../components/button/icon/ButtonPrintExcel";
import ButtonPrintPdf from "../components/button/icon/ButtonPrintPdf";
const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const KartuHutang = () => {
  const [totalInvoice, setTotalInvoice] = useState([]);

  const { screenSize } = useStateContext();
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const vendorId = Cookies.get("vendoroxy_id");
  const adminId = Cookies.get("admin_id");
  const userId = Cookies.get("id");
  const [listPenagihan, setListPenagihan] = useState([]);
  const [data, setData] = useState([]);

  const [optionVendor, setOptionVendor] = useState([]);
  const [srcVendor, setSrcVendor] = useState([]);
  const [ignoreDate, setIgnoreDate] = useState(1);
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [loading, setLoading] = useState(false);
  const [grandTotalMasuk, setGrandTotalMasuk] = useState(0);
  const [grandTotalKeluar, setGrandTotalKeluar] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
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
    try {
      if (srcVendor.length > 0) {
        setOpenBackdrop(true);
        const response = await fetch(
          `${api}api/portal-vendor/list/kartuhutang`,
          {
            method: "POST",
            body: JSON.stringify(parameter),
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        if (result.data) {
          const { data } = result;
          setData(data);
          let grandTotalMasuk = 0;
          let grandTotalKeluar = 0;
          let grandTotal = 0;

          data.map((d) => {
            grandTotalMasuk += d.subtotal_masuk;
            grandTotalKeluar += d.subtotal_keluar;
            grandTotal += d.subtotal;
          });

          setGrandTotalMasuk(grandTotalMasuk);
          setGrandTotalKeluar(grandTotalKeluar);
          setGrandTotal(grandTotal);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenBackdrop(false);
    }
  };

  // const fetchData = async (parameter = new Object()) => {
  //   setOpenBackdrop(true);
  //   if (vendorId !== undefined) {
  //     parameter["vendor_id"] = vendorId;
  //     await fetch(`${api}api/portal-vendor/list/kartuhutang`, {
  //       method: "POST",
  //       body: JSON.stringify(parameter),
  //     })
  //       .then((response) => response.json())
  //       .then((res) => {
  //         // eslint-disable-next-line array-callback-return
  //         res.data.map((data) => {
  //           var total = 0;
  //           setTotal(data.total);
  //           setCount(Math.ceil(data.total / data.limit));
  //           setLimit(data.limit);
  //           data.nilai_invoices.map((nilai) => (total += nilai));
  //           setTotalInvoice((prev) => [
  //             ...prev,
  //             { id: data.id, total: total.toFixed(2) },
  //           ]);
  //         });

  //         setListPenagihan(res.data);
  //         setOpenBackdrop(false);
  //       })
  //       .catch((err) => {
  //         setOpenBackdrop(false);
  //       });
  //   } else {
  //     setOpenBackdrop(false);
  //   }
  // };

  const onChangeStartDate = (value) => {
    setStartDate(value);
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (srcVendor.length > 0) {
      const srcVendorCopy = srcVendor.map((v) => v.value);
      parameter["vendorId"] = srcVendorCopy;
    }

    parameter["startDate"] = dayjs(startDate).format("YYYY-MM-DD 00:00:00");
    parameter["endDate"] = dayjs(endDate).format("YYYY-MM-DD 23:59:59");

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

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  const getVendor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api}api/vendor`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      if (result.data) {
        const { data } = result;
        const optionVendorCopy = data.map((v) => {
          return { value: v.id, label: v.name };
        });

        const vendorCopy = data.find((v) => v.id === vendorId);

        setOptionVendor(optionVendorCopy);
        setSrcVendor([{ value: vendorCopy.id, label: vendorCopy.name }]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendor();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickExportExcel = () => {
    let vendorIds = "";
    if (srcVendor.length > 0) {
      srcVendor.map((v) => {
        vendorIds += (vendorIds.length > 0 ? "," : "") + v.value;
      });
    }

    const strStartDate = dayjs(startDate).format("YYYY-MM-DD");
    const strEndDate = dayjs(endDate).format("YYYY-MM-DD");
    const loginId = adminId;

    window.open(
      `${apiExport}servlet/com.project.fms.report.ReportApCardWithoutCoaXLS?vendorIds=${vendorIds}&dateStart=${strStartDate}&dateEnd=${strEndDate}&oid=${loginId}`,
      "_blank"
    );
  };

  const onClickExportPdf = () => {
    let vendorIds = "";
    if (srcVendor.length > 0) {
      srcVendor.map((v) => {
        vendorIds += (vendorIds.length > 0 ? "," : "") + v.value;
      });
    }

    const strStartDate = dayjs(startDate).format("YYYY-MM-DD");
    const strEndDate = dayjs(endDate).format("YYYY-MM-DD");
    const loginId = adminId;

    window.open(
      `${apiExport}fin/print/print_ap_card_without_coa.jsp?dateStart=${strStartDate}&dateEnd=${strEndDate}&vendorIds=${vendorIds}&uid=${loginId}&show_saldo=1&header_per_vendor=0`,
      "_blank"
    );
  };

  return (
    <>
      <>
        <div
          className={`${
            screenSize < 768 ? "px-5 pt-20" : "px-10"
          } pt-20 font-roboto `}
        >
          <div className="mb-20 max-[349px]:mb-5">Kartu Hutang</div>
          <div className="mb-5 w-[500px] max-[638px]:w-full">
            <div className="mb-5 text-slate-400">Parameter Pencarian</div>
            <div>
              <form onSubmit={onSearch}>
                <div className="flex flex-col gap-1 w-full mb-3 ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Vendor
                    </label>
                  </div>

                  <div className="w-full">
                    <Select
                      isDisabled={vendorId !== undefined ? true : false}
                      isMulti
                      value={srcVendor}
                      onChange={(value) => setSrcVendor(value)}
                      className="whitespace-nowrap"
                      options={optionVendor}
                      noOptionsMessage={() => "Data not found"}
                      styles={customeStyles}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-full mb-3 ">
                  <div className="flex justify-between items-center">
                    <div className="whitespace-nowrap flex">
                      <label
                        htmlFor=""
                        className="w-36 text-[14px] text-slate-400"
                      >
                        Tanggal
                      </label>
                    </div>
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
                  </div>
                </div>

                <div className="flex justify-end mt-5">
                  <button
                    type="submit"
                    onClick={(e) => onSearch(e)}
                    className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full mt-20 mb-10">
            <div className="flex items-center gap-1 mb-2">
              <ButtonPrintExcel onClickExport={onClickExportExcel} />
              <ButtonPrintPdf onClickExport={onClickExportPdf} />
            </div>
            <div className="overflow-x-auto text-[14px]">
              <table className="table-monitoring shadow-md">
                <thead>
                  <tr className="text-center whitespace-nowrap border border-gray-400 bg-[#eaf4f4]">
                    <td
                      rowSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[80px] max-w-[80px] min-w-[80px]"
                    >
                      Tanggal{" "}
                    </td>
                    <td
                      rowSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[500px] max-w-[500px] min-w-[500px]"
                    >
                      Keterangan
                    </td>
                    <td
                      rowSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[150px] max-w-[150px] min-w-[150px]"
                    >
                      Nomor Dokumen
                    </td>
                    <td
                      rowSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[150px] max-w-[150px] min-w-[150px]"
                    >
                      Tanggal Jatuh Tempo
                    </td>
                    <td
                      colSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[150px] max-w-[150px] min-w-[150px]"
                    >
                      Mutasi
                    </td>
                    <td
                      rowSpan={2}
                      className="p-3 border border-opacity-40 border-gray-400 w-[150px] max-w-[150px] min-w-[150px] text-center"
                    >
                      Saldo
                    </td>
                  </tr>
                  <tr className="border border-opacity-40 border-gray-400 bg-[#eaf4f4]">
                    <td className="p-3 border border-opacity-40 border-gray-400 w-[120px] max-w-[120px] min-w-[120px] text-center">
                      Masuk
                    </td>
                    <td className="p-3 border border-opacity-40 border-gray-400 w-[120px] max-w-[120px] min-w-[120px] text-center">
                      Keluar
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 &&
                    data.map((d) => (
                      <>
                        <tr className="bg-[#0077b6]/50">
                          <td className="p-3 border text-white" colSpan={7}>
                            Vendor : {d.vendor_code} - {d.vendor_name}
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 border text-center">
                            {dayjs(d.start_date).format("DD/MM/YYYY")}
                          </td>
                          <td className="p-3 border">Saldo awal hutang</td>
                          <td className="p-3 border"></td>
                          <td className="p-3 border"> </td>
                          <td className="p-3 text-center border">
                            {accountingNumber(d.saldo_masuk)}
                          </td>
                          <td className="p-3 text-center border">
                            {accountingNumber(d.saldo_keluar)}
                          </td>
                          <td className="p-3 border text-center">
                            {accountingNumber(d.saldo_balance)}
                          </td>
                        </tr>
                        {d.detail &&
                          d.detail.map((detail) => (
                            <tr>
                              <td className="p-3 border text-center">
                                {dayjs(detail.transaction_date).format(
                                  "DD/MM/YYYY"
                                )}
                              </td>
                              <td className="p-3 border">{detail.note}</td>
                              <td className="p-3 border">{detail.number}</td>
                              <td className="p-3 border text-center">
                                {dayjs(detail.due_date).format("DD/MM/YYYY")}
                              </td>
                              <td className="p-3 border text-center">
                                {accountingNumber(detail.saldo_masuk)}
                              </td>
                              <td className="p-3 border text-center">
                                {accountingNumber(detail.saldo_keluar)}
                              </td>
                              <td className="p-3 border text-center">
                                {accountingNumber(detail.saldo_balance)}
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td
                            colSpan={4}
                            className="p-3 border text-center font-semibold"
                          >
                            Total
                          </td>
                          <td className="p-3 text-center border font-semibold">
                            {accountingNumber(d.subtotal_masuk)}
                          </td>
                          <td className="p-3 text-center border font-semibold">
                            {accountingNumber(d.subtotal_keluar)}
                          </td>
                          <td className="p-3 border text-center font-semibold">
                            {accountingNumber(d.subtotal)}
                          </td>
                        </tr>
                      </>
                    ))}

                  <tr className="bg-gray-200">
                    <td
                      colSpan={4}
                      className="p-3 border text-center font-semibold"
                    >
                      Grand Total
                    </td>
                    <td className="p-3 text-center border">
                      {accountingNumber(grandTotalMasuk)}
                    </td>
                    <td className="p-3 text-center border">
                      {accountingNumber(grandTotalKeluar)}
                    </td>
                    <td className="p-3 border text-center">
                      {accountingNumber(grandTotal)}
                    </td>
                  </tr>
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

export default KartuHutang;
