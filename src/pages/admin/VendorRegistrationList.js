import { Backdrop, CircularProgress, Fade, Modal } from "@mui/material";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminWhSmith from "../../layouts/AdminWhSmith";
import { useEffect, useState } from "react";
import isEmpty from "../../components/functions/CheckEmptyObject";
import titleCase from "../../components/functions/TitleCase";
import Select from "react-select";
import toast from "react-hot-toast";
import { PiFileZipDuotone } from "react-icons/pi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const options = [
  { value: "APPROVED", label: "APPROVED", key: 0 },
  { value: "RE_REGISTER", label: "RE REGISTER", key: 1 },
];

const srcStatusOptions = [
  { value: 0, label: "All", key: 0 },
  { value: "APPROVED", label: "APPROVED", key: 0 },
  { value: "RE_REGISTER", label: "PENDING", key: 1 },
];

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const VendorRegistrationList = () => {
  const { screenSize } = useStateContext();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({
    value: "APPROVED",
    label: "APPROVED",
    key: 0,
  });

  const [srcName, setSrcName] = useState("");
  const [srcStatus, setSrcStatus] = useState({
    value: 0,
    label: "All",
    key: 0,
  });
  const [code, setCode] = useState("");

  const [listVendor, setListVendor] = useState([]);
  const [vendorDetail, setVendorDetail] = useState({});
  const [listUser, setListUser] = useState([]);

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async (parameter) => {
    setOpenBackdrop(true);
    await fetch(`${api}api/portal-vendor/list/vendors`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          setListVendor(res.data);
          let queryString = [];
          // eslint-disable-next-line array-callback-return
          res.data.map((data, index) => {
            queryString[index] = data.id;
          });
          fetchUser(queryString);
        }else{
          setOpenBackdrop(false);
        }
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
    setPage(value);
  };

  const onChangeSrcStatus = (item) => {
    setSrcStatus(item);
  };

  const onChangeStatus = (item) => {
    setStatus(item);
  };

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

  const onClickEdit = (item) => {
    if (Cookies.get("admin_token") !== undefined) {
      setVendorDetail(item);
      handleOpen();
    } else {
      navigate("/wh-smith");
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

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (srcName.trim().length > 0) {
      parameter["name"] = srcName;
    }

    if (code.trim().length > 0) {
      parameter["code"] = code;
    }

    if (srcStatus.value !== 0) {
      parameter["status"] = srcStatus.value;
    }

    fetchData(parameter);
  };

  const onSubmitVendor = async (vendorDetail) => {
    //setOpenBackdrop(true);
    vendorDetail.status = status.value;
    vendorDetail.file_npwp = null;
    vendorDetail.file_ktp_pemilik = null;
    vendorDetail.file_ktp_penanggung_jawab = null;
    vendorDetail.file_spkp = null;
    vendorDetail.file_nib = null;
    vendorDetail.file_screenshot_rekening = null;
    vendorDetail.file_sertifikasi_bpom = null;
    await fetch(`${api}api/portal-vendor/sign-up`, {
      method: "POST",
      body: JSON.stringify(vendorDetail),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data !== 0) {
          setOpen(false);
          fetchData();
          setOpenBackdrop(false);
          toast.success("Update Success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        } else {
          setOpen(false);
          fetchData();
          setOpenBackdrop(false);
          toast.error("Update Failed!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      })
      .then((err) => {
        setOpenBackdrop(false);
      });
  };

  const onClickDownload = (id) => {
    if (Cookies.get("admin_token") !== undefined) {
      window.location = `${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?oid=${id}`;
    } else {
      navigate("/wh-smith");
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
  return (
    <AdminWhSmith>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
        } font-roboto `}
      >
        <div className="mb-20 max-[349px]:mb-5">Vendor Registration List</div>
        <div className="mb-5 w-[70%] max-[638px]:w-full">
          <div className="mb-5 text-slate-400">Parameter Pencarian</div>
          <div>
            <form onSubmit={(e) => onSearch(e)}>
              <div className="flex max-[349px]:flex-col gap-5 items-center mb-5">
                <div className="flex flex-col gap-1  mb-3 w-full ">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-36 text-[14px] text-slate-400"
                    >
                      Supplier Name
                    </label>
                    <div className="hidden">:</div>
                  </div>
                  <div className="w-full relative">
                    <input
                      value={srcName}
                      type="text"
                      name=""
                      id=""
                      onChange={(e) => setSrcName(e.target.value.trim())}
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
                      onChange={(e) => setCode(e.target.value.trim())}
                      type="text"
                      name=""
                      id=""
                      className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <div className="flex flex-col min-[863px]:flex-row gap-1 min-[863px]:gap-2 mb-3 w-full min-[863px]:items-center">
                  <div className="whitespace-nowrap flex">
                    <label
                      htmlFor=""
                      className="w-20 text-[14px] text-slate-400"
                    >
                      Status
                    </label>
                    <div className="hidden min-[863px]:block">:</div>
                  </div>
                  <div className="w-full relative">
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
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="py-1 max-[415px]:w-full px-10 rounded-md shadow-sm bg-[#0077b6] text-white"
                >
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
                <td className="p-5 border">Action</td>
                <td className="p-5 border">No</td>
                <td className="p-5 border">Supplier Name</td>
                <td className="p-5 border">Supplier Code</td>
                <td className="p-5 border">Password</td>
                <td className="p-5 border">Status</td>
                <td className="p-5 border">Check List</td>
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
                          className={`cursor-pointer py-2 px-5 bg-gray-200 rounded-md`}
                          onClick={() => onClickEdit(item)}
                        >
                          Detail
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border">{index + 1}</td>
                    <td className="text-left p-5 border">{item.nama}</td>
                    <td className="p-5 border">{item.kode}</td>

                    <td className="p-5 border">
                      {listUser[index] !== undefined
                        ? listUser[index].password
                        : ""}
                    </td>
                    <td className="p-5 border">{item.status}</td>
                    <td className="p-5 border">
                      {item.status === "APPROVED" ? "✓" : "✕"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-5 text-center">
                    Data Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* {listVendor.length > 0 && (
          <div className="mt-10">
            <Pagination
              count={100}
              page={page}
              onChange={onChangePagination}
              showFirstButton
              showLastButton
              size="small"
            />
          </div>
        )} */}

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
                  >
                    <div className="w-[100px]">Set status to</div>
                    <div className="max-[402px]:w-full">
                      <Select
                        value={status}
                        onChange={onChangeStatus}
                        className="whitespace-nowrap"
                        options={options}
                        noOptionsMessage={() => "Data not found"}
                        styles={customeStyles}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex max-[479px]:flex-col max-[479px]:items-start items-center gap-2 text-center justify-between">
                    <div
                      onClick={handleClose}
                      className="rounded-md py-2 px-5 shadow-sm border border-gray-400 cursor-pointer max-[479px]:w-full"
                    >
                      Back
                    </div>
                    <button
                      type="button"
                      disabled={
                        vendorDetail.status === "APPROVED" ? true : false
                      }
                      onClick={() => onSubmitVendor(vendorDetail)}
                      className={`rounded-md py-2 px-5 shadow-sm bg-[#0077b6] text-white max-[479px]:w-full ${
                        vendorDetail.status === "APPROVED"
                          ? "cursor-not-allowed hidden"
                          : "cursor-pointer block"
                      } `}
                    >
                      Submit
                    </button>
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
    </AdminWhSmith>
  );
};

export default VendorRegistrationList;
