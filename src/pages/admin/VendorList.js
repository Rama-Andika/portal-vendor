import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";

import { useEffect, useState } from "react";
import titleCase from "../../components/functions/TitleCase";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PiFileZipDuotone } from "react-icons/pi";
import isEmpty from "../../components/functions/CheckEmptyObject";
import { IoMdEye } from "react-icons/io";
import { HiMiniPencil } from "react-icons/hi2";

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;
const VendorList = () => {
  const { screenSize } = useStateContext();
  // eslint-disable-next-line no-unused-vars

  //pagination state
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [page, setPage] = useState(1);
  //end pagination state

  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [term, setTerm] = useState("");
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  const [listVendor, setListVendor] = useState([]);
  const [vendorDetail, setVendorDetail] = useState({});

  const [listUser, setListUser] = useState([]);
  const [userDetail, setUserDetail] = useState({})

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const onChangeTerm = (e) => {
  //   e.target.validity.valid ? setTerm(e.target.value) : setTerm("");
  // };

  // eslint-disable-next-line no-new-object
  const fetchData = async (parameter = new Object()) => {
    setOpenBackdrop(true);
    parameter["status"] = "APPROVED";
    await fetch(`${api}api/portal-vendor/list/vendors`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((res) => {
        setOpenBackdrop(false);
        setTotal(res.total);
        setCount(Math.round(res.total / res.limit));
        setLimit(res.limit);
        setListVendor(res.data);

        let queryString = [];
        // eslint-disable-next-line array-callback-return
        res.data.map((data, index) => {
          queryString[index] = data.id;
        });
        fetchUser(queryString);
      })
      .catch((err) => {
        setOpenBackdrop(false);
      });
  };

  const fetchUser = async (query) => {
    await fetch(`${api}api/portal-vendor/list/users`, {
      method: "POST",
      body: JSON.stringify({
        vendor_id: query,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          setOpenBackdrop(false);
          setListUser(res.data);
        } else {
          setOpenBackdrop(false);
        }
      })
      .catch((err) => {
        setOpenBackdrop(false);
      });
  };

  // eslint-disable-next-line no-unused-vars
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

    if (code.trim().length > 0) {
      parameter["code"] = code;
    }

    if (email.trim().length > 0) {
      parameter["email"] = email;
    }

    if (location.trim().length > 0) {
      parameter["location"] = location;
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (name.trim().length > 0) {
      parameter["name"] = name.trim();
    }
    if (code.trim().length > 0) {
      parameter["code"] = code.trim();
    }
    if (location.trim().length > 0) {
      parameter["location"] = location.trim();
    }
    if (email.trim().length > 0) {
      parameter["email"] = email.trim();
    }

    fetchData(parameter);
  };

  const onClickView = (item, user) => {
    if (Cookies.get("admin_token") !== undefined) {
      setUserDetail(user)
      setVendorDetail(item);
      handleOpen();
    } else {
      navigate("/admin");
      toast.error("Silahkan Login Terlebih Dahulu!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const onClickEdit = (item) => {
    if (Cookies.get("admin_token") !== undefined) {
      navigate("/admin/vendor/edit", { state: { vendor_id: item.id } });
    } else {
      navigate("/admin");
      toast.error("Silahkan Login Terlebih Dahulu!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const onClickDownload = (id) => {
    if (Cookies.get("admin_token") !== undefined) {
      window.location = `${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?oid=${id}`;
    } else {
      navigate("/admin");
      toast.error("Silahkan Login Terlebih Dahulu!", {
        position: "top-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  // const onClickEdit = (index) => {
  //   handleOpen();
  // };
  return (
    <>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20">Vendor List</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Searching Parameter</div>
          <div>
            <form onSubmit={(e) => onSearch(e)}>
              <div className="flex gap-5 items-center mb-5">
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Supplier Name
                    </label>
                    <div className="hidden ">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Supplier Code
                    </label>
                    <div className="hidden">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Location
                    </label>
                    <div className="hidden">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
                <div className="flex flex-col  gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Email
                    </label>
                    <div className="hidden">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full overflow-auto max-h-[400px] shadow-md text-[14px]">
          <table className="w-full table-monitoring">
            <thead>
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td className="p-5 border">Action</td>
                <td className="p-5 border">No</td>
                <td className="p-5 border">Supplier Name</td>
                <td className="p-5 border">Supplier Code</td>
                <td className="p-5 border">Term Of Payment</td>
                <td className="p-5 border">Location</td>
                <td className="p-5 border">Contact Person</td>
                <td className="p-5 border">Email</td>
              </tr>
            </thead>
            <tbody>
              {listVendor.length > 0 ? (
                listVendor.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                  >
                    <td className="p-5 border">
                      <div className="flex gap-2 items-center justify-center">
                        <div
                          className={`cursor-pointer rounded-md`}
                          onClick={() => onClickView(item, listUser[index])}
                        >
                          <IoMdEye />
                        </div>
                        <div
                          className={`cursor-pointer rounded-md`}
                          onClick={() => onClickEdit(item)}
                        >
                          <HiMiniPencil />
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border">{start + index + 1}</td>
                    <td className="text-left p-5 border">{item.nama}</td>
                    <td className="p-5 border">{item.kode}</td>
                    <td className="p-5 border">{item.term_pembayaran}</td>
                    <td className="p-5 border">{titleCase(item.provinsi)}</td>
                    <td className="p-5 border">{item.no_wa_purchase_order}</td>
                    <td className="p-5 border">{item.email_korespondensi}</td>
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
        {listVendor.length > 0 && (
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
              {!isEmpty(vendorDetail) && (
                <div
                  className={`border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                    screenSize <= 548 ? "w-[90%]" : "w-fit"
                  }`}
                >
                  <div className="text-[20px] mb-5 font-semibold ">Detail</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Nama
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.nama)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Username
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {userDetail.username}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Tipe Perusahaan
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.tipe_perusahaan)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Tipe Perusahaan Lainnya
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.tipe_perusahaan_lainnya)}
                      </div>
                    </div>

                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Alamat
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] max-[549px]:w-full whitespace-pre-wrap">
                        {vendorDetail.alamat}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Provinsi
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.provinsi)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Kota
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.kota)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start  gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Kode Pos
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.kode_pos)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Tipe Pembelian
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.tipe_pembelian)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Status Pajak
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {vendorDetail.status_pajak}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start items-center gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        NPWP
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {vendorDetail.npwp}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Website
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {vendorDetail.website}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Nama Pemilik
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.nama_pemilik)}
                      </div>
                    </div>
                    <div className="flex max-[549px]:flex-col max-[549px]:items-start gap-2">
                      <div className="w-[270px] whitespace-nowrap font-bold">
                        Nama Penanggung Jawab
                      </div>
                      <div className="max-[549px]:hidden min-[550px]:block">
                        :
                      </div>
                      <div className="w-[240px] whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {titleCase(vendorDetail.nama_penanggung_jawab)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onClickDownload(vendorDetail.id)}
                      className="mt-5 rounded-sm py-2 px-5 text-white bg-[#d4a373] w-fit cursor-pointer flex gap-1 items-center"
                    >
                      <div>
                        <PiFileZipDuotone />
                      </div>
                      <div>Download</div>
                    </button>
                  </div>

                  <div
                    className={` max-[402px]:flex-col items-center max-[402px]:items-start gap-2 mt-5 ${
                      vendorDetail.status === "APPROVED" ? "hidden" : "flex"
                    } `}
                  ></div>

                  <div className="mt-5 flex max-[479px]:flex-col max-[479px]:items-start items-center gap-2 text-center justify-between">
                    <div
                      onClick={handleClose}
                      className="rounded-md py-2 px-5 shadow-sm border border-gray-400 cursor-pointer max-[479px]:w-full"
                    >
                      Back
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

export default VendorList;
