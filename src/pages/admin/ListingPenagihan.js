import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Pagination } from "@mui/material";
import { RiFileExcel2Line } from "react-icons/ri";



const ListingPenagihan = () => {
  const { screenSize } = useStateContext();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [page, setPage] = useState(1);

  const array = [1, 2, 3, 4];

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


  const onChangePagination = (e, value) => {
    setPage(value);
  };

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
                <td className="p-5 border">Tanggal Penagihan</td>
                <td className="p-5 border">No Tagihan</td>
                <td className="p-5 border">Nilai Penagihan (Rp)</td>
                <td className="p-5 border">Status</td>
                <td className="p-5 border">Update Terakhir</td>
                <td className="p-5 border">User</td>
              </tr>
            </thead>
            <tbody>
              {array.map((item, index) => (
                <tr
                  key={index}
                  className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                >
                  <td className="p-5 border">PT xx</td>
                  <td className="p-5 border">12/09/23</td>
                  <td className="p-5 border">FR/mm/yy/00000</td>
                  <td className="p-5 border">Rp. 100.000,00</td>
                  <td className="p-5 border">Waiting for Approval</td>
                  <td className="p-5 border">12/09/23 00:00:00</td>
                  <td className="p-5 border">Komang</td>
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
    </AdminWhSmith>
  );
};

export default ListingPenagihan;
