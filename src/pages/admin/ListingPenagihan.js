import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Backdrop, CircularProgress } from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";
import titleCase from "../../components/functions/TitleCase";
import accountingNumber from "../../components/functions/AccountingNumber";

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const ListingPenagihan = () => {
  const { screenSize } = useStateContext();
  const [vendorName, setVendorName] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [totalInvoice, setTotalInvoice] = useState([]);
  const [listPenagihan, setListPenagihan] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);
  const [ignoreDate, setIgnoreDate] = useState(1);

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

  // eslint-disable-next-line no-unused-vars
  const onChangePagination = (e, value) => {
    setPage(value);
  };

  const fetchData = async (parameter) => {
    setOpenBackdrop(true);

    

    await fetch(`${api}api/portal-vendor/list/penagihan`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenBackdrop(false);

        // eslint-disable-next-line array-callback-return
        data.data.map((data, index) => {
          var total = 0;
          data.nilai_invoices.map((nilai) => (total += nilai));
          setTotalInvoice((prev) => {
            return [...prev, total.toFixed(2)];
          });
        });

        const customeHeaders = data.data.map((item, index) => {
          let listTanggal;
          let listNoPajak;
          let total = 0;

          listTanggal = item.tanggal_invoices.map((tanggal) => {
            return dayjs(tanggal).format("DD/MM/YYYY");
          });

          let countNoPajak = 0;
          listNoPajak = item.nomer_seri_pajak.map((nomer) => {
            return nomer === null ? (countNoPajak -= 1) : (countNoPajak += 1);
          });

          // eslint-disable-next-line array-callback-return
          item.nilai_invoices.map((nilai) => {
            total += nilai;
          });
          return {
            No: index + 1,
            Supplier: item.vendor.nama,
            "Tipe Penagihan": item.tipe_penagihan,
            "No Purchase Order": item.nomer_po,
            "Tanggal PO": dayjs(item.tanggal_po).format("DD/MM/YYYY"),
            "No Delivery Order": item.nomer_do,
            "Delivery Area": item.delivery_area,
            "No Invoice": item.nomer_invoices.toString(),
            "Tanggal Invoice": listTanggal[0],
            "Nilai Invoice": total.toFixed(2),
            "Termasuk Pajak": item.is_pajak === 0 ? "Ya" : "Tidak",
            "No Faktur Pajak":
              countNoPajak === listNoPajak.length ? listNoPajak.toString() : "",
            "Periode Dari":
              item.start_date_periode !== null ? item.start_date_periode : "",
            "Periode Ke":
              item.end_date_periode !== null ? item.end_date_periode : "",
            Status: item.status,
          };
        });
        setData(customeHeaders);
        setListPenagihan(data.data);
      })
      .catch((err) => {
        setOpenBackdrop(false);
      });
  };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (vendorName.trim().length > 0) {
      parameter = { vendor_name: vendorName };
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    fetchData(parameter);
  };

  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20">Listing Penagihan</div>
        <div className="mb-5 w-[80%] max-[638px]:w-full">
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
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value.trim())}
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
                      Date
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
                <button
                  onClick={(e) => onSearch(e)}
                  className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full overflow-x-auto shadow-md text-[14px]">
          <table id="table" className="w-full table-monitoring">
            <thead>
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td className="p-5 border">Nama Supplier </td>
                <td className="p-5 border">Tanggal Penagihan</td>
                <td className="p-5 border">No Tagihan</td>
                <td className="p-5 border">Nilai Penagihan (Rp)</td>
                <td className="p-5 border">Status</td>
                <td className="p-5 border">Update Terakhir</td>
          
              </tr>
            </thead>
            <tbody>
              {listPenagihan.length > 0 ? (
                listPenagihan.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                  >
                    <td className="p-5 border">{item.vendor.nama}</td>
                    <td className="p-5 border">
                      {dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")}
                    </td>
                    <td className="p-5 border">{item.doc_receive_number}</td>
                    <td className="p-5 border">
                      Rp. {accountingNumber(totalInvoice[index])}
                    </td>
                    <td className="p-5 border">
                      {titleCase(item.status, "_")}
                    </td>
                    <td className="p-5 border">
                      {dayjs(item.updated_at).format("DD/MM/YYYY HH:mm:ss")}
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
              href={`${apiExport}servlet/com.project.ccs.report.RptPVPenagihanDetailXLS?vendorName=${
                vendorName.trim().length > 0 ? vendorName : ""
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

            {/* <div className="mt-10">
              <Pagination
                count={20}
                page={page}
                onChange={onChangePagination}
                showFirstButton
                showLastButton
                size="small"
              />
            </div> */}
          </>
        )}
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

export default ListingPenagihan;
