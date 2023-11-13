import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Backdrop, CircularProgress, Pagination } from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";
import Api from "../../api";
import titleCase from "../../components/functions/TitleCase";



const ListingPenagihan = () => {
  const { screenSize } = useStateContext();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [totalInvoice, setTotalInvoice] = useState([])
  const [listPenagihan, setListPenagihan] = useState([])


  useEffect(() => {
    window.scrollTo(0, 0);
    setStartDate(dayjs(new Date()));
    setEndDate(dayjs(new Date()));
    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeStartDate = (value) => {
    setStartDate(value);
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
  };


  const onChangePagination = (e, value) => {
    setPage(value);
  };

  const fetchData = async (query) => {
    setOpenBackdrop(true);
    await Api.get(
      `/penagihan`
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

  const onSearch = (e) => {
    e.preventDefault()
  }

  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20">Listing Penagihan</div>
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
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button onClick={(e) => onSearch(e)} className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white">
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
                <td className="p-5 border">Tanggal Penagihan</td>
                <td className="p-5 border">No Tagihan</td>
                <td className="p-5 border">Nilai Penagihan (Rp)</td>
                <td className="p-5 border">Status</td>
                <td className="p-5 border">Update Terakhir</td>
                <td className="p-5 border">User</td>
              </tr>
            </thead>
            <tbody>
              {listPenagihan.map((item, index) => (
                <tr
                  key={index}
                  className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                >
                  <td className="p-5 border">{item.vendor.nama}</td>
                  <td className="p-5 border">{item.created_at}</td>
                  <td className="p-5 border"></td>
                  <td className="p-5 border">Rp. {totalInvoice[index]}</td>
                  <td className="p-5 border">{titleCase(item.status, "_")}</td>
                  <td className="p-5 border">{dayjs(item.updated_at).format('DD/MM/YYYY HH:mm:ss')}</td>
                  <td className="p-5 border"></td>
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
