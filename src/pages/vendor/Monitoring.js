import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";
import Admin from "../../layouts/Admin";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Api from "../../api";
import dayjs from "dayjs";

const Monitoring = () => {
  const { screenSize } = useStateContext();
  const [open, setOpen] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState();
  const vendorId = Cookies.get("vendor_id")
  const [listPenagihan, setListPenagihan] = useState([]);
  const [detail, setDetail] = useState({});

  const fetchData = async () => {
    setOpenBackdrop(true)
    await Api.get(`penagihan?vendor_id=${vendorId}`).then((response) => {
        setListPenagihan(response.data)
        setOpenBackdrop(false)
    })
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const onClickNoRequest = (item) => {
    handleOpen();
    setDetail(item)
  };

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <>
    <Admin>
      {console.log(detail)}
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10"
        } pt-20 font-roboto `}
      >
        Monitoring
        <div className="w-full mt-20">
          <div className="w-full overflow-x-auto shadow-md text-[14px]">
            <table className="w-full table-monitoring">
              <thead>
                <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                  <td className="p-5 border">No Request </td>
                  <td className="p-5 border">Tanggal Submit</td>
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
                    <td className="p-5 border">{dayjs(item.tanggal_po).format('DD/MM/YYYY')}</td>

                    <td className="p-5 border"></td>
                    <td className="p-5 border">{item.status}</td>
                    <td className="p-5 border"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <div className="text-[20px] mb-5 font-semibold ">Detail</div>
              <div className="flex flex-col gap-2">
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    No Request
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {detail.no_request}
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Tanggal Submit
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {detail.tanggal_po}
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Supplier
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    PT xx
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Tipe Penagihan
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden text-red-500">
                    {detail.tipe_penagihan === 0 ? (
                      'Beli Putus'
                    ) : (
                      'Konsinyasi'
                    )}
                    
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    No Purchase Order (PO)
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {detail.nomer_do}
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Tanggal PO
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {detail.tanggal_po}
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Delivery Area
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    Bali
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowwrap font-bold">
                    Periode Acuan Penagihan
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    12/09/23
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    No Invoice
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    PTXX12345678901234567YY
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Tanggal Invoice
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                    18/09/23
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Nilai Invoice
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col">
                    <div>Rp. 100.000,00</div>
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Apakah Barang Termasuk Pajak
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col">
                    <div>
                    {detail.is_pajak === 0 ? (
                      'Ya'
                    ) : (
                      'Tidak'
                    )}
                    </div>
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-start gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    No Seri Faktur Pajak
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col">
                    <div>{detail.nomer_seri_pajak}</div>
                                
                  </div>
                </div>
                <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Status
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden flex flex-col font-bold underline">
                    <div>{detail.status}</div>
                  </div>
                </div>
                {status === "Reject" && (
                  <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                  <div className="w-[270px] whitespace-nowrap font-bold">
                    Reject Message
                  </div>
                  <div className="max-[549px]:hidden min-[550px]:block">:</div>
                  <div className="w-[240px] overflow-hidden flex flex-col">
                    <div>Dokumen yang disubmit kurang lengkap dan nilai tidak sesuai dengan invoice</div>
                  </div>
                </div>
                )}
              </div>

              {(status === "Draft" || status === "Reject") && (
                <Link className="flex justify-end" to="/vendor/penagihan/edit/2">
                  <div className="mt-5 rounded-sm py-1 px-8 text-white bg-[#00b4d8] w-fit cursor-pointer">
                    Revisi
                  </div>
                </Link>
              )}
            </div>
          </Fade>
        </Modal>
      </div>
    </Admin>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 99999 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Monitoring;
