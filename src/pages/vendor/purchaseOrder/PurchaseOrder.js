import { Backdrop, CircularProgress, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import accountingNumber from "../../../components/functions/AccountingNumber";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Select from "react-select";
import { useStateContext } from "../../../contexts/ContextProvider";
import ButtonSearch from "../../../components/button/ButtonSearch";

const api = process.env.REACT_APP_BASEURL;
const apiSecond = process.env.REACT_APP_BASEURL_SECOND;
const apiInventory = process.env.REACT_APP_INVENTORY_URL;

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

const PurchaseOrder = () => {
  const { screenSize } = useStateContext();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [optionLokasi, setOptionLokasi] = useState([]);
  const [data, setData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [locationId, setLocationId] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [ignoreDate, setIgnoreDate] = useState(1);

  const vendorId = Cookies.get("vendoroxy_id");

  //pagination state
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [page, setPage] = useState(1);
  //end pagination state

  const navigate = useNavigate();
  // eslint-disable-next-line no-new-object
  const fetchData = async () => {
    setOpenBackdrop(true);
    if (vendorId !== undefined) {
      let query = `?vendor_id=${vendorId}&start=${start}`;

      if (locationId !== "") {
        query += `&location_id=${locationId}`;
      }

      if (poNumber !== "") {
        query += `&po_number=${poNumber}`;
      }

      if (invoiceNumber !== "") {
        query += `&invoice_number=${invoiceNumber}`;
      }

      if (ignoreDate === 0) {
        query += `&start_date=${dayjs(startDate).format(
          "YYYY-MM-DD 00:00:00"
        )}&end_date=${dayjs(endDate).format("YYYY-MM-DD 23:59:59")}`;
      }

      await fetch(`${apiSecond}api/oxy/purchase-orders${query}`)
        .then((response) => response.json())
        .then((res) => {
          setTotal(res.total);
          setCount(Math.ceil(res.total / res.limit));
          setLimit(res.limit);
          setData(res.data);
          setOpenBackdrop(false);
        })
        .catch((err) => {
          setOpenBackdrop(false);
        });
    } else {
      setOpenBackdrop(false);
    }
  };

  const onChangePagination = (e, value) => {
    let limitTemp = limit;

    limitTemp = limitTemp * value - limit;

    setStart(limitTemp);
    setPage(value);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, page]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await fetch(`${api}api/location`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        if (result.data) {
          const { data } = result;

          const options = data.map((d) => ({
            value: d.id,
            label: d.name,
          }));

          options.unshift({
            value: "",
            label: "Semua Lokasi",
          });

          setOptionLokasi(options);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLocation();
  }, []);

  const handleClickSearch = (e) => {
    e.preventDefault();
    fetchData();
  };
  return (
    <>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10"
        } pt-20 font-roboto `}
      >
        <div className="mb-20 max-[349px]:mb-5">Purchase Order</div>
        <div className="mb-5 w-[80%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form
              onSubmit={handleClickSearch}
              className="flex flex-col gap-3 mb-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 w-72 max-sm:w-full">
                  <label htmlFor="location">Nomor PO</label>
                  <input
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="ps-2 h-[40px] border border-[#cecfcf] rounded-sm hover:border-[#565757] focus:border focus:border-[#0077b6]  "
                  />
                </div>
                <div className="flex flex-col gap-1 w-72 max-sm:w-full">
                  <label htmlFor="location">Lokasi</label>
                  <Select
                    className="whitespace-nowrap"
                    options={optionLokasi}
                    noOptionsMessage={() => "Data not found"}
                    styles={customeStyles}
                    value={optionLokasi.find((o) => o.value === locationId)}
                    onChange={(value) => {
                      setLocationId(value.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="location">Tanggal</label>
                <div className="flex max-sm:items-start items-center gap-2 max-sm:flex-col max-sm:gap-0">
                  <div className="max-sm:w-full">
                    <div className="flex max-sm:flex-col max-sm:gap-0 items-center gap-5">
                      <div className="max-sm:w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="max-sm:w-full"
                              slotProps={{ textField: { size: "small" } }}
                              value={startDate}
                              onChange={(value) => setStartDate(value)}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                      <div>-</div>
                      <div className="max-sm:w-full">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="max-sm:w-full"
                              slotProps={{ textField: { size: "small" } }}
                              value={endDate}
                              onChange={(value) => setEndDate(value)}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center text-[12px]">
                    <div>
                      <input
                        id="ignoreDate"
                        type="checkbox"
                        className="checked:bg-[#0077b6] border-[#cecfcf]"
                        value="1"
                        checked={ignoreDate === 1}
                        onChange={() =>
                          setIgnoreDate((prev) => (prev === 1 ? 0 : 1))
                        }
                      />
                    </div>
                    <label htmlFor="ignoreDate" className="whitespace-nowrap">
                      Abaikan
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <ButtonSearch />
              </div>
            </form>
          </div>
        </div>
        <div className="w-full mt-20 mb-10">
          <div className="w-full overflow-x-auto shadow-md text-[14px]">
            <table className="w-full table-monitoring">
              <thead>
                <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                  <th className="p-2">Nomor PO</th>
                  <th className="p-2">Tanggal PO</th>
                  <th className="p-2">Nomor Incoming</th>
                  <th className="p-2">Tanggal Incoming</th>
                  <th className="p-2">Lokasi</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">PO PDF</th>
                  <th className="p-2">Incoming PDF</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white "
                  >
                    <td className="p-5 border">{item.nomorPurchase}</td>
                    <td className="p-5 border">
                      {item.date != null
                        ? dayjs(item.date).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <td className="p-5 border">{item.incomingNumber}</td>
                    <td className="p-5 border">
                      {item.incomingDate != null
                        ? dayjs(item.incomingDate).format("DD/MM/YYYY")
                        : ""}
                    </td>
                    <td className="p-5 border">{item.locationName}</td>
                    <td className="p-5 border">{item.status}</td>
                    <td className="p-2 whitespace-nowrap">
                      {item.nomorPurchase && (
                        <a
                          href={`${apiInventory}servlet/com.project.ccs.report.RptPurchaseOrderPDFV2?po_number=${item.nomorPurchase}&privValue=true`}
                          target="_blank"
                          className="text-blue-500"
                        >
                          Download
                        </a>
                      )}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {item.nomorPurchase && (
                        <a
                          href={`${apiInventory}servlet/com.project.ccs.report.RptIncomingGoodsPdfV2?incoming_number=${item.incomingNumber}&privValue=true`}
                          target="_blank"
                          className="text-blue-500"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.length > 0 && (
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 99999 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PurchaseOrder;
