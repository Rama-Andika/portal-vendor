import { Backdrop, Fade, Modal } from "@mui/material";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import accountingNumber from "../../../components/functions/AccountingNumber";
import dayjs from "dayjs";
import Select from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import ButtonSearch from "../../../components/button/ButtonSearch";

const api = process.env.REACT_APP_BASEURL;
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
const ModalListReceive = ({ open, setIsOpen, vendorId, handleSelect }) => {
  const { screenSize } = useStateContext();
  const [data, setData] = useState([]);
  const [optionLokasi, setOptionLokasi] = useState([]);

  const handleClose = () => setIsOpen(false);

  const [locationId, setLocationId] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [ignoreDate, setIgnoreDate] = useState(1);

  const fetchData = async () => {
    try {
      let query = `?vendor_id=${vendorId}`;

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

      console.log(query);

      const response = await fetch(`${api}api/portal-vendor/receives${query}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      if (result && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
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
    }
  }, [open]);

  const handleClickSearch = (e) => {
    e.preventDefault();
    console.log("submit");
    fetchData();
  };

  if (!open) return null;

  return (
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
            className={`rounded-md border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-full overflow-y-auto z-[999999]  ${
              screenSize <= 1087 ? "w-[90%]" : "w-fit"
            }`}
          >
            <div className="text-[20px] mb-5 font-semibold ">List Incoming</div>
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
                  <label htmlFor="location">Nomor Invoice</label>
                  <input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="ps-2 h-[40px] border border-[#cecfcf] rounded-sm hover:border-[#565757] focus:border focus:border-[#0077b6]  "
                  />
                </div>
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
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="  whitespace-nowrap text-sm">
                  <tr className="text-left">
                    <th className="p-2">Action</th>
                    <th className="p-2">Nomor Invoice</th>
                    <th className="p-2">Nomor Incoming</th>
                    <th className="p-2">Nomor PO</th>
                    <th className="p-2">Tanggal Incoming</th>
                    <th className="p-2">Lokasi</th>
                    <th className="p-2 text-right">Jumlah</th>
                    <th className="p-2">Incoming PDF</th>
                    <th className="p-2">PO PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length === 0 && (
                    <tr>
                      <td className="p-2 text-center" colSpan={6}>
                        Tidak ada data yang ditemukan, silahkan menghubungi
                        admin
                      </td>
                    </tr>
                  )}
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 text-blue-400 cursor-pointer">
                        <div onClick={() => handleSelect(item)}>select</div>
                      </td>
                      <td className="p-2">{item.nomorInvoice}</td>
                      <td className="p-2">{item.nomorReceive}</td>
                      <td className="p-2">{item.nomorPurchase}</td>
                      <td className="p-2 whitespace-nowrap">
                        {item.date
                          ? dayjs(item.date).format("DD MMMM YYYY")
                          : ""}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {item.locationName}
                      </td>
                      <td className="p-2 text-right">
                        {accountingNumber(item.totalAmount)}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {item.nomorReceive && (
                          <a
                            href={`${apiInventory}servlet/com.project.ccs.report.RptIncomingGoodsPdfV2?incoming_number=${item.nomorReceive}&privValue=true`}
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
                            href={`${apiInventory}servlet/com.project.ccs.report.RptPurchaseOrderPDFV2?po_number=${item.nomorPurchase}&privValue=true`}
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
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalListReceive;
