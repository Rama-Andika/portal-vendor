import { BsBuildings } from "react-icons/bs";
import { useStateContext } from "../../../contexts/ContextProvider";
import { MdPayments } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Step,
  StepConnector,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { PiWarningCircleLight } from "react-icons/pi";
import isEmpty from "../../../components/functions/CheckEmptyObject";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import titleCase from "../../../components/functions/TitleCase";
import GetBase64 from "../../../components/functions/GetBase64";
import Cookies from "js-cookie";
import accountingNumber from "../../../components/functions/AccountingNumber";
import accountingNumberV2 from "../../../components/functions/AccountingNumberV2";

const optionsTipePenagihan = [
  { value: "beli putus", label: "Beli Putus", key: 0 },
  { value: "konsinyasi", label: "Konsinyasi", key: 1 },
];
const optionsDeliveryArea = [
  { value: "tangerang", label: "Tangerang" },
  { value: "jakarta", label: "Jakarta" },
  { value: "bali", label: "Bali" },
  { value: "makassar", label: "Makassar" },
  { value: "batam", label: "Batam" },
  { value: "medan", label: "Medan" },
];
const options = [
  { value: 0, label: "Tidak", key: 0 },
  { value: 1, label: "Ya", key: 1 },
];
const optionsTipePengiriman = [
  { value: 0, label: "Drop Box Gudang PT KPU", key: 0 },
  { value: 1, label: "Kurir", key: 1 },
  { value: 2, label: "Diantar langsung ke office PT KPU", key: 2 },
];

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;
const Penagihan = () => {
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];

  const inputNilaiInvoice = [
    {
      value: "",
    },
  ];

  const inputTanggalInvoice = [{}];

  const inputTanggalInvoice2 = [{}];

  const inputNoSeriFakturPajak = [
    {
      type: "text",
      value: "",
    },
    {
      type: "text",
      value: "",
    },
    {
      type: "text",
      value: "",
    },
    {
      type: "text",
      value: "",
    },
    {
      type: "text",
      value: "",
    },
  ];
  const { screenSize } = useStateContext();
  const [activeStep, setActiveStep] = useState(0);

  const [tipePenagihan, setTipePenagihan] = useState({
    value: "beli putus",
    label: "Beli Putus",
    key: 0,
  });
  const [nomerPo, setNomerPo] = useState("");
  const [tanggalPo, setTanggalPo] = useState();
  const [tanggalInvoice, setTanggalInvoice] = useState(inputTanggalInvoice);
  const [tanggalInvoice2, setTanggalInvoice2] = useState(inputTanggalInvoice2);
  const [startDatePeriode, setStartDatePeriode] = useState();
  const [endDatePeriode, setEndDatePeriode] = useState();
  const [nomerDo, setNomerDo] = useState("");
  const [deliveryArea, setDeliveryArea] = useState({
    value: "tangerang",
    label: "Tangerang",
    key: 0,
  });
  const [nomerInvoice, setNomerInvoice] = useState(inputArr);
  const [nilaiInvoice, setNilaiInvoice] = useState(inputNilaiInvoice);
  const [invoiceTambahan, setInvoiceTambahan] = useState([]);
  const [fakturPajakTambahan, setFakturPajakTambahan] = useState([]);
  const [tipePengiriman, setTipePengiriman] = useState({
    value: 0,
    label: "Drop Box Gudang PT KPU",
    key: 0,
  });

  const [isPajak, setIsPajak] = useState({ value: 0, label: "Tidak", key: 0 });
  const [nomerSeriFakturPajak, setNomerSeriFakturPajak] = useState(
    inputNoSeriFakturPajak
  );
  const [purchaseOrderFile, setPurchaseOrderFile] = useState(null);
  const [purchaseOrderFileUpload, setPurchaseOrderFileUpload] = useState(null);
  const [deliveryOrderFile, setDeliveryOrderFile] = useState(null);
  const [deliveryOrderFileUpload, setDeliveryOrderFileUpload] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [invoiceFileUpload, setInvoiceFileUpload] = useState([]);
  const [kwitansiFile, setKwitansiFile] = useState(null);
  const [kwitansiFileUpload, setKwitansiFileUpload] = useState(null);
  const [fakturPajakFile, setFakturPajakFile] = useState(null);
  const [fakturPajakFileUpload, setFakturPajakFileUpload] = useState(null);
  const [receivingNoteFile, setReceivingNoteFile] = useState(null);
  const [receivingNoteFileUpload, setReceivingNoteFileUpload] = useState(null);
  const [resiFile, setResiFile] = useState(null);
  const [resiFileUpload, setResiFileUpload] = useState(null);
  const [scanReportSalesFile, setScanReportSalesFile] = useState(null);
  const [scanReportSalesFileUpload, setScanReportSalesFileUpload] =
    useState(null);
  const [createdAt, setCreatedAt] = useState();
  // eslint-disable-next-line no-unused-vars
  const [updatedAt, setUpdatedAt] = useState();

  const [isError, setIsError] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(0);
  const [nomerRequest, setNomerRequest] = useState("");
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [vendorId, setVendorId] = useState();

  const param = useParams();
  const [vendors, setVendors] = useState({});
  const location = useLocation();
  const userId = Cookies.get("id");

  const fetchvendor = async () => {
    setOpenBackdrop(true);
    await fetch(`${api}api/portal-vendor/list/vendors`, {
      method: "POST",
      body: JSON.stringify({
        id: location.state.vendor_id,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setOpenBackdrop(false);
        setVendors(res.data[0]);
      })
      .then((err) => {
        setOpenBackdrop(false);
      });
  };

  const fetchData = async () => {
    setOpenBackdrop(true);
    await fetch(`${api}api/portal-vendor/list/penagihan`, {
      method: "POST",
      body: JSON.stringify({
        id: param.id,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data[0];

          setTipePenagihan({
            value: data.tipe_penagihan,
            label: titleCase(data.tipe_penagihan),
          });
          setNomerPo(data.nomer_po.split("PO")[1]);
          setTanggalPo(dayjs(data.tanggal_po));
          setNomerDo(data.nomer_do);
          setDeliveryArea({
            value: data.delivery_area,
            label: titleCase(data.delivery_area),
          });

          setTipePengiriman(optionsTipePengiriman[data.tipe_pengiriman]);
          const listInvoice = data.nomer_invoices.map((invoice) => {
            return { type: "text", value: invoice, id: 0 };
          });
          const listTanggalInvoice = data.tanggal_invoices.map((tanggal) => {
            return { value: dayjs(tanggal) };
          });
          const listNilaiInvoice = data.nilai_invoices.map((nilai) => {
            return { value: accountingNumberV2(nilai.toString()) };
          });

          let arrayInvoiceTambahan = [];
          let arrayFakturPajakTambahan = [];
          for (let index = 0; index < data.nomer_invoices.length - 1; index++) {
            arrayInvoiceTambahan[index] = {};
            arrayFakturPajakTambahan[index] = {};
          }

          // eslint-disable-next-line array-callback-return
          var listSeriPajak = data.nomer_seri_pajak.map((nomer) => {
            if (nomer !== null) {
              return { type: "text", value: nomer };
            } else {
              return { type: "text", value: "" };
            }
          });

          setNomerInvoice(listInvoice);
          setTanggalInvoice(listTanggalInvoice);
          setTanggalInvoice2(listTanggalInvoice);
          setNilaiInvoice(listNilaiInvoice);
          setNomerSeriFakturPajak(listSeriPajak);
          setIsPajak({
            value: data.is_pajak,
            label: data.is_pajak === 0 ? "Tidak" : "Ya",
          });
          if (data.start_date_periode !== null) {
            setStartDatePeriode(dayjs(data.start_date_periode));
          }
          if (data.end_date_periode !== null) {
            setEndDatePeriode(dayjs(data.end_date_periode));
          }
          setNomerRequest(data.no_request);
          setVendorId(data.vendor_id);
          setCreatedAt(data.created_at);
          setUpdatedAt(data.updated_at);
          setOpenBackdrop(false);
          setPurchaseOrderFileUpload(data.file_po ? data.file_po : "");
          setDeliveryOrderFileUpload(data.file_do ? data.file_do : "");
          setKwitansiFileUpload(data.file_kwitansi ? data.file_kwitansi : "");
          setReceivingNoteFileUpload(data.file_note ? data.file_note : "");
          setResiFileUpload(data.file_resi ? data.file_resi : "");
          setScanReportSalesFileUpload(data.file_scan ? data.file_scan : "");

          const _invoiceFiles = data.file_invoices?.map((file) => {
            return file;
          });
          setInvoiceFileUpload(_invoiceFiles);

          const _fakturPajakFiles = data.file_faktur_pajak?.map((file) => {
            return file;
          });
          setFakturPajakFileUpload(_fakturPajakFiles);
          setInvoiceTambahan(arrayInvoiceTambahan);
          setFakturPajakTambahan(arrayFakturPajakTambahan);
        }
      });
  };

  const handleNext = () => {
    let countNomerInvoice = 0;
    let countTanggalInvoice = 0;
    let countNilaiInvoice = 0;
    //let countInvoiceTambahan = 0;

    // eslint-disable-next-line array-callback-return
    nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        countNomerInvoice += 1;
      }
    });

    // eslint-disable-next-line array-callback-return
    tanggalInvoice.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        countTanggalInvoice += 1;
      }
    });

    // eslint-disable-next-line array-callback-return
    nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");
      if (nilai.value.trim().length > 0 && !isNaN(value)) {
        countNilaiInvoice += 1;
      }
    });

    // const invoiceTambahanArray = invoiceTambahan.filter((invoice) => {
    //   return !isEmpty(invoice);
    // });

    // const fakturPajakTambahanArray = fakturPajakTambahan.filter((invoice) => {
    //   return !isEmpty(invoice);
    // });

    // nomerInvoice.map((invoice) => {
    //   if (!isEmpty(invoice)) {
    //     countInvoiceTambahan += 1;
    //   }
    // });

    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      if (
        nomerPo.trim().length === 8 &&
        tanggalPo !== undefined &&
        nomerDo.trim().length > 0 &&
        countNomerInvoice === nomerInvoice.length &&
        countTanggalInvoice === nomerInvoice.length &&
        countNilaiInvoice === nomerInvoice.length
      ) {
        if (isPajak.value === 0) {
          setIsError(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          if (nomerSeriFakturPajak[0].value.trim().length === 20) {
            setIsError(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            return setIsError(true);
          }
        }
      } else {
        setIsError(true);
      }
    } else if (activeStep === 2) {
      onSubmitButton();
    }
  };

  const handleNext2 = () => {
    let countNomerInvoice = 0;
    let countTanggalInvoice = 0;
    let countNilaiInvoice = 0;
    //let countInvoiceTambahan = 0;

    // eslint-disable-next-line array-callback-return
    nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        countNomerInvoice += 1;
      }
    });

    // eslint-disable-next-line array-callback-return
    tanggalInvoice2.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        countTanggalInvoice += 1;
      }
    });

    // eslint-disable-next-line array-callback-return
    nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");
      if (nilai.value.trim().length > 0 && !isNaN(value)) {
        countNilaiInvoice += 1;
      }
    });

    // const invoiceTambahanArray = invoiceTambahan.filter((invoice) => {
    //   return !isEmpty(invoice);
    // });

    // const fakturPajakTambahanArray = fakturPajakTambahan.filter((invoice) => {
    //   return !isEmpty(invoice);
    // });

    // nomerInvoice.map((invoice) => {
    //   if (!isEmpty(invoice)) {
    //     countInvoiceTambahan += 1;
    //   }
    // });

    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      if (
        nomerPo.trim().length === 8 &&
        tanggalPo !== undefined &&
        countNomerInvoice === nomerInvoice.length &&
        countTanggalInvoice === nomerInvoice.length &&
        countNilaiInvoice === nomerInvoice.length &&
        startDatePeriode !== undefined &&
        endDatePeriode !== undefined
      ) {
        if (isPajak.value === 0) {
          setIsError(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          if (nomerSeriFakturPajak[0].value.trim().length === 20) {
            setIsError(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            return setIsError(true);
          }
        }
      } else {
        setIsError(true);
      }
    } else if (activeStep === 2) {
      onSubmitButton2();
    }
  };

  const handleBack = () => {
    setIsError(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      height: "40px",
      backgroundColor:
        tipePenagihan.label === "Beli Putus" ? "#ddebf7" : "#fff2cc",
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

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 136deg, #0077b6 100%, #0077b6 100%, #0077b6 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 136deg, #0077b6 100%, #0077b6 100%, #0077b6 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage:
        "linear-gradient( 136deg, #0077b6 100%, #0077b6 100%, #0077b6 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage:
        "linear-gradient( 136deg, #0077b6 100%, #0077b6 100%, #0077b6 100%)",
    }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <BsBuildings />,
      2: <MdPayments />,
      3: <HiOutlineDocumentText />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchvendor();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTipePenagihan = (item) => {
    setTipePenagihan(item);
  };

  const onChangeNomerPo = (e) => {
    if (e.target.validity.valid) {
      setNomerPo(e.target.value);
    } else {
      setNomerPo("");
    }
  };

  const onChangeTanggalPo = (value) => {
    setTanggalPo(value);
  };

  const onChangeTanggalInvoice = (item, i) => {
    setTanggalInvoice((s) => {
      const newArr = s.slice();
      newArr[i].value = item;

      return newArr;
    });
  };

  const onChangeDeliveryArea = (item) => {
    setDeliveryArea(item);
  };

  const onChangeInvoice = (e) => {
    e.preventDefault();

    const index = e.target.id;

    setNomerInvoice((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;

      return newArr;
    });
  };

  const onChangeNilaiInvoice = (e) => {
    e.preventDefault();

    const index = e.target.id;

    setNilaiInvoice((s) => {
      const newArr = s.slice();
      newArr[index].value = accountingNumberV2(
        e.target.value.split(".").join("")
      );

      return newArr;
    });
  };

  const onChangeTanggalInvoice2 = (item, i) => {
    setTanggalInvoice2((s) => {
      const newArr = s.slice();
      newArr[i].value = item;

      return newArr;
    });
  };

  const onChangeIsPajak = (item) => {
    if (item.label === "Tidak") {
      nomerSeriFakturPajak.map((faktur, i) => {
        const nomerSeriFakturPajakCopy = [...nomerSeriFakturPajak];
        nomerSeriFakturPajakCopy[i].value = "";
        return nomerSeriFakturPajakCopy[i];
      });
    }
    setIsPajak(item);
  };

  const onChangeInvoiceTambahan = (e, index) => {
    e.preventDefault();
    const invoiceTambahanCopy = [...invoiceTambahan];
    GetBase64(e.target.files[0])
      .then((result) => {
        invoiceTambahanCopy[index].file = result;
        setInvoiceTambahan(invoiceTambahanCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeFakturPajakTambahan = (e, index) => {
    e.preventDefault();

    const fakturPajakTambahanCopy = [...fakturPajakTambahan];
    GetBase64(e.target.files[0])
      .then((result) => {
        fakturPajakTambahanCopy[index].file = result;
        setFakturPajakTambahan(fakturPajakTambahanCopy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeTipePengiriman = (item) => {
    if (item.value !== 1) {
      setResiFile(null);
    }

    setTipePengiriman(item);
  };

  const addInput = () => {
    if (nomerInvoice.length < 4) {
      setNomerInvoice((s) => {
        return [
          ...s,
          {
            type: "text",
            value: "",
          },
        ];
      });

      setNilaiInvoice((s) => {
        return [
          ...s,
          {
            value: "",
          },
        ];
      });

      setTanggalInvoice((s) => {
        return [...s, {}];
      });

      setTanggalInvoice2((s) => {
        return [...s, {}];
      });

      setInvoiceTambahan((s) => {
        return [...s, {}];
      });

      setFakturPajakTambahan((s) => {
        return [...s, {}];
      });

      setNomerSeriFakturPajak((s) => {
        return [
          ...s,
          {
            type: "text",
            value: "",
          },
        ];
      });
    }
  };

  const deleteInput = () => {
    setNomerInvoice((array) => {
      return array.filter((_, i) => i !== nomerInvoice.length - 1);
    });

    setNilaiInvoice((array) => {
      return array.filter((_, i) => i !== nilaiInvoice.length - 1);
    });

    setTanggalInvoice((array) => {
      return array.filter((_, i) => i !== tanggalInvoice.length - 1);
    });

    setTanggalInvoice2((array) => {
      return array.filter((_, i) => i !== tanggalInvoice2.length - 1);
    });

    setInvoiceTambahan((array) => {
      return array.filter((_, i) => i !== invoiceTambahan.length - 1);
    });

    setFakturPajakTambahan((array) => {
      return array.filter((_, i) => i !== fakturPajakTambahan.length - 1);
    });

    setNomerSeriFakturPajak((array) => {
      return array.filter((_, i) => i !== nomerSeriFakturPajak.length - 1);
    });
  };

  // const addInvoiceTambahan = () => {
  //   if (invoiceTambahan.length < 5) {
  //     setInvoiceTambahan((s) => {
  //       return [...s, {}];
  //     });
  //   }
  // };

  // const addFakturPajakFile = () => {
  //   if (fakturPajakTambahan.length < 5) {
  //     setFakturPajakTambahan((s) => {
  //       return [...s, {}];
  //     });
  //   }
  // };

  const formatFakturPajak = (value, i) => {
    try {
      var cleaned = ("" + value).replace(/\D/g, "");
      var match = cleaned.match(/(\d{0,3})?(\d{0,3})?(\d{0,2})?(\d{0,9})$/);

      var nilai = [
        match[1],
        match[2] ? "." : "",
        match[2],
        match[3] ? "-" : "",
        match[3],
        match[4] ? "." : "",
        match[4],
      ].join("");

      const nomerSeriFakturPajakCopy = [...nomerSeriFakturPajak];
      nomerSeriFakturPajak[i].value = nilai;
      setNomerSeriFakturPajak(nomerSeriFakturPajakCopy);
    } catch (err) {
      return "";
    }
  };

  const onChangePurchaseOrderFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setPurchaseOrderFile(result);
          })
          .catch((err) => {
            setPurchaseOrderFile(null);
          });
      } else {
        setPurchaseOrderFile(null);
      }
    }
  };

  const onChangeDeliveryOrderFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setDeliveryOrderFile(result);
          })
          .catch((err) => {
            setDeliveryOrderFile(null);
          });
      } else {
        setDeliveryOrderFile(null);
      }
    }
  };

  const onChangeInvoiceFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setInvoiceFile(result);
          })
          .catch((err) => {
            setInvoiceFile(null);
          });
      } else {
        setInvoiceFile(null);
      }
    }
  };

  const onChangeKwitansiFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setKwitansiFile(result);
          })
          .catch((err) => {
            setKwitansiFile(null);
          });
      } else {
        setKwitansiFile(null);
      }
    }
  };

  const onChangeFakturPajakFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setFakturPajakFile(result);
          })
          .catch((err) => {
            setFakturPajakFile(null);
          });
      } else {
        setFakturPajakFile(null);
      }
    }
  };

  const onChangeScanReportSalesFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setScanReportSalesFile(result);
          })
          .catch((err) => {
            setScanReportSalesFile(null);
          });
      } else {
        setScanReportSalesFile(null);
      }
    }
  };

  const onChangeReceivingNoteFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setReceivingNoteFile(result);
          })
          .catch((err) => {
            setReceivingNoteFile(null);
          });
      } else {
        setReceivingNoteFile(null);
      }
    }
  };

  const onChangeResiBuktiPengirimanFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setResiFile(result);
          })
          .catch((err) => {
            setResiFile(null);
          });
      } else {
        setResiFile(null);
      }
    }
  };

  const saveDraft = async () => {
    setOpenBackdrop(true);
    let isSave = true;

    // eslint-disable-next-line array-callback-return
    const invoiceList = nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        return invoice.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const tanggalList = tanggalInvoice.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        return dayjs(tanggal.value).format("YYYY-MM-DD");
      }
    });

    // eslint-disable-next-line array-callback-return
    const nilaiInvoiceList = nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");

      return parseFloat(value);
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 20 && nomer.value.trim().length > 0) {
        return nomer.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const invoiceTambahanList = invoiceTambahan.map((invoice) => {
      if (!isEmpty(invoice)) {
        return invoice.file;
      }
    });

    // eslint-disable-next-line array-callback-return
    const fakturPajakTambahanList = fakturPajakTambahan.map((faktur) => {
      if (!isEmpty(faktur)) {
        return faktur.file;
      }
    });

    const validationFakturPajakTambahan = fakturPajakTambahan.filter(
      (faktur) => {
        return !isEmpty(faktur);
      }
    );

    if (Cookies.get("token") !== undefined) {
      if (isSave) {
        const initialValue = {
          id: param.id,
          vendor_id: vendorId,
          no_request: nomerRequest,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: "PO" + nomerPo,
          tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss"),
          nomer_do: "DO" + nomerDo,
          delivery_area: deliveryArea.value,
          nomer_invoices: invoiceList,
          tanggal_invoices: tanggalList,
          nilai_invoices: nilaiInvoiceList,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: null,
          end_date_periode: null,
          created_at: createdAt,
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          invoice_tambahan_file: invoiceTambahanList,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
          faktur_pajak_tambahan_file:
            validationFakturPajakTambahan.length > 0
              ? fakturPajakTambahanList
              : null,
          note_file: receivingNoteFile !== null ? receivingNoteFile : null,
          resi_file: resiFile !== null ? resiFile : null,
          scan_report_sales_file:
            scanReportSalesFile !== null ? scanReportSalesFile : null,
          status: "DRAFT",
          user_id: userId,
        };

        await fetch(`${api}api/portal-vendor/invoice`, {
          method: "POST",
          body: JSON.stringify(initialValue),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.data === 0) {
              setOpenBackdrop(false);
              toast.error("Penagihan update failed!", {
                position: "top-right",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            } else {
              setId(res.data);
              setCreatedAt(res.data.created_at);
              navigate("/vendor/monitoring");
              setOpenBackdrop(false);
              toast.success("Penagihan update success!", {
                position: "top-right",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan update failed!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          });
      } else {
        setOpenBackdrop(false);
      }
    } else {
      navigate("/");
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

  const saveDraft2 = async () => {
    setOpenBackdrop(true);
    let isSave = true;

    // eslint-disable-next-line array-callback-return
    const invoiceList = nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        return invoice.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const tanggalList = tanggalInvoice2.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        return dayjs(tanggal.value).format("YYYY-MM-DD");
      }
    });

    // eslint-disable-next-line array-callback-return
    const nilaiInvoiceList = nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");

      return parseFloat(value);
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 20 && nomer.value.trim().length > 0) {
        return nomer.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const invoiceTambahanList = invoiceTambahan.map((invoice) => {
      if (!isEmpty(invoice)) {
        return invoice.file;
      }
    });

    // eslint-disable-next-line array-callback-return
    const fakturPajakTambahanList = fakturPajakTambahan.map((faktur) => {
      if (!isEmpty(faktur)) {
        return faktur.file;
      }
    });

    const validationFakturPajakTambahan = fakturPajakTambahan.filter(
      (faktur) => {
        return !isEmpty(faktur);
      }
    );

    if (Cookies.get("token") !== undefined) {
      if (isSave) {
        const initialValue = {
          id: param.id,
          vendor_id: vendorId,
          no_request: nomerRequest,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: "PO" + nomerPo,
          tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss"),
          nomer_do: "DO" + nomerDo,
          delivery_area: deliveryArea.value,
          nomer_invoices: invoiceList,
          tanggal_invoices: tanggalList,
          nilai_invoices: nilaiInvoiceList,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: dayjs(startDatePeriode).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          end_date_periode: dayjs(endDatePeriode).format("YYYY-MM-DD HH:mm:ss"),
          created_at: createdAt,
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          invoice_tambahan_file: invoiceTambahanList,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
          faktur_pajak_tambahan_file:
            validationFakturPajakTambahan.length > 0
              ? fakturPajakTambahanList
              : null,
          note_file: receivingNoteFile !== null ? receivingNoteFile : null,
          resi_file: resiFile !== null ? resiFile : null,
          scan_report_sales_file:
            scanReportSalesFile !== null ? scanReportSalesFile : null,
          status: "DRAFT",
          user_id: userId,
        };

        await fetch(`${api}api/portal-vendor/invoice`, {
          method: "POST",
          body: JSON.stringify(initialValue),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.data === 0) {
              setOpenBackdrop(false);
              toast.error("Penagihan update failed!", {
                position: "top-right",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            } else {
              setId(res.data);
              navigate("/vendor/monitoring");
              setOpenBackdrop(false);
              toast.success("Penagihan update success!", {
                position: "top-right",
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan update failed!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          });
      } else {
        setOpenBackdrop(false);
      }
    } else {
      navigate("/");
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

  const onSubmitButton = async () => {
    setOpenBackdrop(true);

    // eslint-disable-next-line array-callback-return
    const invoiceList = nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        return invoice.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const tanggalList = tanggalInvoice.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        return dayjs(tanggal.value).format("YYYY-MM-DD");
      }
    });

    // eslint-disable-next-line array-callback-return
    const nilaiInvoiceList = nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");

      return parseFloat(value);
      // if (nilai.value.trim().length > 0) {
      //   return parseFloat(nilai.value);
      // }
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 20 && nomer.value.trim().length > 0) {
        return nomer.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const invoiceTambahanList = invoiceTambahan.map((invoice) => {
      if (!isEmpty(invoice)) {
        return invoice.file;
      }
    });

    // eslint-disable-next-line array-callback-return
    const fakturPajakTambahanList = fakturPajakTambahan.map((faktur) => {
      if (!isEmpty(faktur)) {
        return faktur.file;
      }
    });

    const validationFakturPajakTambahan = fakturPajakTambahan.filter(
      (faktur) => {
        return !isEmpty(faktur);
      }
    );

    if (Cookies.get("token") !== undefined) {
      const initialValue = {
        id: param.id,
        vendor_id: vendorId,
        no_request: nomerRequest,
        tipe_penagihan: tipePenagihan.value,
        tipe_pengiriman: tipePengiriman.value,
        nomer_po: "PO" + nomerPo,
        tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss"),
        nomer_do: "DO" + nomerDo,
        delivery_area: deliveryArea.value,
        nomer_invoices: invoiceList,
        tanggal_invoices: tanggalList,
        nilai_invoices: nilaiInvoiceList,
        is_pajak: isPajak.value,
        nomer_seri_pajak: nomerSeriFakturPajakList,
        start_date_periode: null,
        end_date_periode: null,
        created_at: createdAt,
        updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
        do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
        invoice_file: invoiceFile !== null ? invoiceFile : null,
        invoice_tambahan_file: invoiceTambahanList,
        kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
        faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
        faktur_pajak_tambahan_file:
          validationFakturPajakTambahan.length > 0
            ? fakturPajakTambahanList
            : null,
        note_file: receivingNoteFile !== null ? receivingNoteFile : null,
        resi_file: resiFile !== null ? resiFile : null,
        scan_report_sales_file:
          scanReportSalesFile !== null ? scanReportSalesFile : null,
        status: "Waiting_for_approval",
        user_id: userId,
      };

      await fetch(`${api}api/portal-vendor/invoice`, {
        method: "POST",
        body: JSON.stringify(initialValue),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.data === 0) {
            setOpenBackdrop(false);
            toast.error("Penagihan update failed!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          } else {
            setId(res.data);
            navigate("/vendor/monitoring");
            setOpenBackdrop(false);
            toast.success("Penagihan update success!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        })
        .catch((err) => {
          setOpenBackdrop(false);
          toast.error("Penagihan update failed!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        });
    } else {
      navigate("/");
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

  const onSubmitButton2 = async () => {
    setOpenBackdrop(true);

    // eslint-disable-next-line array-callback-return
    const invoiceList = nomerInvoice.map((invoice) => {
      if (invoice.value.trim().length > 0) {
        return invoice.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const tanggalList = tanggalInvoice2.map((tanggal) => {
      if (!isEmpty(tanggal)) {
        return dayjs(tanggal.value).format("YYYY-MM-DD");
      }
    });

    // eslint-disable-next-line array-callback-return
    const nilaiInvoiceList = nilaiInvoice.map((nilai) => {
      const value = nilai.value.replace(/\./g, "").split(",").join(".");

      return parseFloat(value);
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 20 && nomer.value.trim().length > 0) {
        return nomer.value;
      }
    });

    // eslint-disable-next-line array-callback-return
    const invoiceTambahanList = invoiceTambahan.map((invoice) => {
      if (!isEmpty(invoice)) {
        return invoice.file;
      }
    });

    // eslint-disable-next-line array-callback-return
    const fakturPajakTambahanList = fakturPajakTambahan.map((faktur) => {
      if (!isEmpty(faktur)) {
        return faktur.file;
      }
    });

    const validationFakturPajakTambahan = fakturPajakTambahan.filter(
      (faktur) => {
        return !isEmpty(faktur);
      }
    );

    if (Cookies.get("token") !== undefined) {
      const initialValue = {
        id: param.id,
        vendor_id: vendorId,
        no_request: nomerRequest,
        tipe_penagihan: tipePenagihan.value,
        tipe_pengiriman: tipePengiriman.value,
        nomer_po: "PO" + nomerPo,
        tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss"),
        nomer_do: "DO" + nomerDo,
        delivery_area: deliveryArea.value,
        nomer_invoices: invoiceList,
        tanggal_invoices: tanggalList,
        nilai_invoices: nilaiInvoiceList,
        is_pajak: isPajak.value,
        nomer_seri_pajak: nomerSeriFakturPajakList,
        start_date_periode: dayjs(startDatePeriode).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        end_date_periode: dayjs(endDatePeriode).format("YYYY-MM-DD HH:mm:ss"),
        created_at: createdAt,
        updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
        do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
        invoice_file: invoiceFile !== null ? invoiceFile : null,
        invoice_tambahan_file: invoiceTambahanList,
        kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
        faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
        faktur_pajak_tambahan_file:
          validationFakturPajakTambahan.length > 0
            ? fakturPajakTambahanList
            : null,
        note_file: receivingNoteFile !== null ? receivingNoteFile : null,
        resi_file: resiFile !== null ? resiFile : null,
        scan_report_sales_file:
          scanReportSalesFile !== null ? scanReportSalesFile : null,
        status: "Waiting_for_approval",
        user_id: userId,
      };

      await fetch(`${api}api/portal-vendor/invoice`, {
        method: "POST",
        body: JSON.stringify(initialValue),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.data === 0) {
            setOpenBackdrop(false);
            toast.error("Penagihan update failed!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          } else {
            setId(res.data);
            navigate("/vendor/monitoring");
            setOpenBackdrop(false);
            toast.success("Penagihan update success!", {
              position: "top-right",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
        })
        .catch((err) => {
          setOpenBackdrop(false);
          toast.error("Penagihan update failed!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        });
    } else {
      navigate("/");
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

  const steps = ["Tipe Penagihan", "Billing", "Dokumen"];
  return (
    <>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10"
        } pt-20 font-roboto `}
      >
        Penagihan
        {screenSize > 621 ? (
          <div className="w-full mt-20">
            <Stepper
              activeStep={activeStep}
              alternativeLabel={screenSize > 720 ? false : true}
              connector={<ColorlibConnector />}
            >
              {steps.map((item, index) => {
                return (
                  <Step key={index}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>
                      {item}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </>
            ) : (
              <>
                {activeStep === 0 ? (
                  <div className="mt-20 ps-3">
                    <form action="">
                      <div className="flex items-center gap-2">
                        <div className="w-[150px]">
                          <label htmlFor="">Tipe Penagihan</label>
                        </div>
                        <div>:</div>
                        <div className="w-[70%]">
                          <Select
                            isDisabled={true}
                            value={tipePenagihan}
                            onChange={onChangeTipePenagihan}
                            className="whitespace-nowrap"
                            options={optionsTipePenagihan}
                            noOptionsMessage={() => "Data not found"}
                            styles={customeStyles}
                            required
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                ) : activeStep === 1 ? (
                  <div className="mt-20 ps-3 max-[697px]:pe-3">
                    <form action="">
                      {tipePenagihan.label === "Beli Putus" ? (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className="w-[250px]">
                                No Purchase Order (PO)
                              </div>
                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Harus 8 digit</div>
                              </div>
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 ">
                              <div>PO</div>
                              <div>
                                <input
                                  maxLength={8}
                                  type="text"
                                  pattern="[0-9]*"
                                  name=""
                                  id=""
                                  value={nomerPo}
                                  onChange={(e) => onChangeNomerPo(e)}
                                  className={`last:max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] ${
                                    isError && nomerPo.trim().length === 0
                                      ? "border-red-400"
                                      : "border-slate-300"
                                  } `}
                                />
                              </div>
                              <div>
                                {isError && nomerPo.trim().length === 0 ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-[250px]">Tanggal PO</div>

                            <div>:</div>
                            <div className="flex items-center gap-1">
                              <div className="w-[21.1px]"></div>
                              <div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                      className="w-full bg-[#ddebf7]"
                                      value={tanggalPo}
                                      onChange={onChangeTanggalPo}
                                      slotProps={{
                                        textField: { size: "small" },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                              <div>
                                {isError && tanggalPo === undefined ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-[250px]">
                              No Delivery Order (DO)
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 ">
                              <div className="w-[21.1px]"></div>
                              <div>
                                <input
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerDo}
                                  onKeyDown={(evt) =>
                                    evt.key === " " && evt.preventDefault()
                                  }
                                  onChange={(e) => setNomerDo(e.target.value)}
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] ${
                                    isError && nomerDo.trim().length === 0
                                      ? "border-red-400"
                                      : "border-slate-300"
                                  } `}
                                />
                              </div>
                              <div>
                                {isError && nomerDo.trim().length === 0 ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-10">
                            <div className="w-[250px]">Delivery Area</div>
                            <div>:</div>
                            <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                              <div className="w-[24px]"></div>
                              <div className="w-full ">
                                <Select
                                  value={deliveryArea}
                                  onChange={onChangeDeliveryArea}
                                  className="whitespace-nowrap"
                                  options={optionsDeliveryArea}
                                  noOptionsMessage={() => "Data not found"}
                                  styles={customeStyles}
                                  required
                                />
                              </div>
                              <div>
                                {isError && isEmpty(deliveryArea) ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mb-10">
                            {nomerInvoice.map((item, i) => (
                              <div
                                className="flex items-center gap-2 mb-3"
                                key={i}
                              >
                                {i === 0 ? (
                                  <div className="w-[250px]">No Invoice</div>
                                ) : (
                                  <div className="w-[250px]">
                                    No Invoice {i + 1}
                                  </div>
                                )}
                                <div>:</div>
                                <div className="flex items-center gap-1 ">
                                  <div className="w-[21.1px]"></div>
                                  <div>
                                    <input
                                      type="text"
                                      name=""
                                      id={i}
                                      value={item.value}
                                      onChange={onChangeInvoice}
                                      onKeyDown={(evt) =>
                                        evt.key === " " && evt.preventDefault()
                                      }
                                      className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                    />
                                  </div>
                                  <div>{i === 0 && "*)"}</div>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center gap-5">
                              {nomerInvoice.length > 1 && (
                                <div
                                  onClick={deleteInput}
                                  className={`py-1 px-4 rounded-sm shadow-sm text-white bg-red-500  w-fit ${
                                    nomerInvoice.length === 4
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  } `}
                                >
                                  Delete row
                                </div>
                              )}

                              <div
                                onClick={addInput}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]  w-fit ${
                                  nomerInvoice.length === 4
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            {nomerInvoice.map((item, i) => (
                              <div key={i}>
                                <div className="flex items-center gap-2 mb-3">
                                  {i === 0 ? (
                                    <div className="w-[250px]">
                                      Tanggal Invoice
                                    </div>
                                  ) : (
                                    <div className="w-[250px]">
                                      Tanggal Invoice {i + 1}
                                    </div>
                                  )}
                                  <div>:</div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-[21.1px]"></div>
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#ddebf7]"
                                            value={tanggalInvoice[i].value}
                                            onChange={(item) =>
                                              onChangeTanggalInvoice(item, i)
                                            }
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                    <div>{i === 0 && "*)"}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  {i === 0 ? (
                                    <div className="w-[250px]">
                                      Nilai Invoice
                                    </div>
                                  ) : (
                                    <div className="w-[250px]">
                                      Nilai Invoice {i + 1}
                                    </div>
                                  )}
                                  <div>:</div>
                                  <div className="flex items-center gap-1 ">
                                    <div>Rp</div>
                                    <div>
                                      <input
                                        id={i}
                                        type="text"
                                        value={nilaiInvoice[i].value}
                                        onChange={onChangeNilaiInvoice}
                                        className="max-[821px]:w-[208px] w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                      />
                                    </div>
                                    <div>{i === 0 && "*)"}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mb-10 mt-10">
                            <div className="w-[250px]">
                              Apakah barang termasuk pajak?
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                              <div className="w-[24px]"></div>
                              <div className="w-full ">
                                <Select
                                  value={isPajak}
                                  onChange={onChangeIsPajak}
                                  className="whitespace-nowrap"
                                  options={options}
                                  noOptionsMessage={() => "Data not found"}
                                  styles={customeStyles}
                                  required
                                />
                              </div>
                              <div>*)</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className="w-[250px]">
                                No Seri Faktur Pajak
                              </div>
                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Harus 16 digit</div>
                              </div>
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 ">
                              <div className="w-[21.1px]"></div>
                              <div className="flex flex-col gap-1">
                                {nomerSeriFakturPajak.map((input, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1"
                                  >
                                    <input
                                      maxLength={20}
                                      disabled={
                                        isPajak.label === "Tidak" ? true : false
                                      }
                                      type={input.type}
                                      name=""
                                      id=""
                                      value={input.value}
                                      onChange={(e) =>
                                        formatFakturPajak(e.target.value, i)
                                      }
                                      className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                    />
                                    <div>{i === 0 ? "*)" : ""}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Data masih belum lengkap</div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className="w-[250px]">
                                No Purchase Order (PO)
                              </div>
                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Harus 8 digit</div>
                              </div>
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 ">
                              <div>PO</div>
                              <div>
                                <input
                                  maxLength={8}
                                  type="text"
                                  pattern="[0-9]*"
                                  name=""
                                  id=""
                                  value={nomerPo}
                                  onChange={(e) => onChangeNomerPo(e)}
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] ${
                                    isError && nomerPo.trim().length === 0
                                      ? "border-red-400"
                                      : "border-slate-300"
                                  } `}
                                />
                              </div>
                              <div>
                                {isError && nomerPo.trim().length === 0 ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-[250px]">Tanggal PO</div>
                            <div>:</div>
                            <div className="flex items-center gap-1">
                              <div className="w-[21.1px]"></div>
                              <div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                      className="w-full bg-[#fff2cc]"
                                      value={tanggalPo}
                                      onChange={onChangeTanggalPo}
                                      slotProps={{
                                        textField: { size: "small" },
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </div>
                              <div>
                                {isError && tanggalPo === undefined ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-10">
                            <div className="w-[250px]">Delivery Area</div>
                            <div>:</div>
                            <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                              <div className="w-[24px]"></div>
                              <div className="w-full ">
                                <Select
                                  value={deliveryArea}
                                  onChange={onChangeDeliveryArea}
                                  className="whitespace-nowrap"
                                  options={optionsDeliveryArea}
                                  noOptionsMessage={() => "Data not found"}
                                  styles={customeStyles}
                                  required
                                />
                              </div>
                              <div>
                                {isError && isEmpty(deliveryArea) ? (
                                  <div className="text-red-500">
                                    <PiWarningCircleLight />
                                  </div>
                                ) : (
                                  "*)"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mb-10">
                            {nomerInvoice.map((item, i) => (
                              <div key={i}>
                                <div className="flex items-center gap-2 mb-3">
                                  {i === 0 ? (
                                    <div className="w-[250px]">No Invoice</div>
                                  ) : (
                                    <div className="w-[250px]">
                                      No Invoice {i + 1}
                                    </div>
                                  )}

                                  <div>:</div>
                                  <div className="flex items-center gap-1 ">
                                    <div className="w-[21.1px]"></div>
                                    <div>
                                      <input
                                        type="text"
                                        name=""
                                        id={i}
                                        value={item.value}
                                        onChange={onChangeInvoice}
                                        onKeyDown={(evt) =>
                                          evt.key === " " &&
                                          evt.preventDefault()
                                        }
                                        className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                      />
                                    </div>
                                    <div>{i === 0 && "*)"}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                  {i === 0 ? (
                                    <div className="w-[250px]">
                                      Tanggal Invoice
                                    </div>
                                  ) : (
                                    <div className="w-[250px]">
                                      Tanggal Invoice {i + 1}
                                    </div>
                                  )}
                                  <div>:</div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-[21.1px]"></div>
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#fff2cc]"
                                            id={i}
                                            value={tanggalInvoice2[i].value}
                                            onChange={(item) =>
                                              onChangeTanggalInvoice2(item, i)
                                            }
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                    <div>{i === 0 && "*)"}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center gap-5">
                              {nomerInvoice.length > 1 && (
                                <div
                                  onClick={deleteInput}
                                  className={`py-1 px-4 rounded-sm shadow-sm text-white bg-red-500  w-fit ${
                                    nomerInvoice.length === 4
                                      ? "cursor-not-allowed"
                                      : "cursor-pointer"
                                  } `}
                                >
                                  Delete row
                                </div>
                              )}

                              <div
                                onClick={addInput}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]  w-fit ${
                                  nomerInvoice.length === 4
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                          </div>

                          <div className="mb-10">
                            {nomerInvoice.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 mb-3"
                              >
                                {i === 0 ? (
                                  <div className="w-[250px]">Nilai Invoice</div>
                                ) : (
                                  <div className="w-[250px]">
                                    Nilai Invoice {i + 1}
                                  </div>
                                )}
                                <div>:</div>
                                <div className="flex items-center gap-1 ">
                                  <div>Rp</div>
                                  <div>
                                    <input
                                      id={i}
                                      type="text"
                                      value={nilaiInvoice[i].value}
                                      onChange={onChangeNilaiInvoice}
                                      className="max-[821px]:w-[208px] w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                    />
                                  </div>
                                  <div>{i === 0 && "*)"}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mb-3">
                            <div className="w-[250px]">
                              Periode Acuan Penagihan :
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="ps-10 flex items-center gap-2">
                                <div className="w-[210px]">Dari Tanggal</div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-[24px]"></div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="w-full bg-[#fff2cc]"
                                        value={startDatePeriode}
                                        onChange={(item) =>
                                          setStartDatePeriode(item)
                                        }
                                        slotProps={{
                                          textField: { size: "small" },
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                  <div>*)</div>
                                </div>
                              </div>
                              <div className="ps-10 flex items-center gap-2">
                                <div className="w-[210px]">Sampai Tanggal</div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div className="w-[24px]"></div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="w-full bg-[#fff2cc]"
                                        value={endDatePeriode}
                                        onChange={(item) =>
                                          setEndDatePeriode(item)
                                        }
                                        slotProps={{
                                          textField: { size: "small" },
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                  <div>*)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-10">
                            <div className="w-[250px]">
                              Apakah barang termasuk pajak?
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                              <div className="w-[24px]"></div>
                              <div className="w-full ">
                                <Select
                                  value={isPajak}
                                  onChange={onChangeIsPajak}
                                  className="whitespace-nowrap"
                                  options={options}
                                  noOptionsMessage={() => "Data not found"}
                                  styles={customeStyles}
                                  required
                                />
                              </div>
                              <div>*)</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className="w-[250px]">
                                No Seri Faktur Pajak
                              </div>
                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Harus 16 digit</div>
                              </div>
                            </div>
                            <div>:</div>
                            <div className="flex items-center gap-1 ">
                              <div className="w-[21.1px]"></div>
                              <div className="flex flex-col gap-1">
                                {nomerSeriFakturPajak.map((input, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-1"
                                  >
                                    <input
                                      maxLength={20}
                                      disabled={
                                        isPajak.label === "Tidak" ? true : false
                                      }
                                      type={input.type}
                                      name=""
                                      id=""
                                      value={input.value}
                                      onChange={(e) =>
                                        formatFakturPajak(e.target.value, i)
                                      }
                                      className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                    />
                                    <div>{i === 0 ? "*)" : ""}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Data masih belum lengkap</div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </form>
                  </div>
                ) : (
                  activeStep === 2 && (
                    <div className="mt-20 ps-3">
                      <form action="">
                        {tipePenagihan.label === "Beli Putus" ? (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">Purchase Order</div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-purchaseorder"
                                    className="w-fit"
                                  >
                                    {purchaseOrderFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    onChange={onChangePurchaseOrderFile}
                                    type="file"
                                    id="upload-purchaseorder"
                                    accept=".jpg,.pdf"
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>

                              {purchaseOrderFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${purchaseOrderFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">
                                  Delivery Order (DO) / Packing List (Surat
                                  Jalan)
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>

                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-deliveryorder"
                                    className="w-fit"
                                  >
                                    {deliveryOrderFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    onChange={onChangeDeliveryOrderFile}
                                    type="file"
                                    id="upload-deliveryorder"
                                    accept=".jpg,.pdf"
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {deliveryOrderFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${deliveryOrderFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">
                                  Invoice (Faktur Penagihan)
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-invoice"
                                    className="w-fit"
                                  >
                                    {invoiceFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    onChange={onChangeInvoiceFile}
                                    type="file"
                                    id="upload-invoice"
                                    accept=".jpg,.pdf"
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {invoiceFileUpload[0].trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${invoiceFileUpload[0]}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="mb-10">
                              {invoiceTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      {i === 0 ? (
                                        <div className="w-[350px]">
                                          Invoice Tambahan{" "}
                                        </div>
                                      ) : (
                                        <div className="w-[350px]">
                                          Invoice Tambahan {i + 1}{" "}
                                        </div>
                                      )}
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                        <label
                                          htmlFor={`invoice_${i}`}
                                          className="w-fit"
                                        >
                                          {isEmpty(item) ? (
                                            <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>Upload</div>
                                            </div>
                                          ) : (
                                            <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>1 File</div>
                                            </div>
                                          )}
                                        </label>
                                        <input
                                          type="file"
                                          id={`invoice_${i}`}
                                          onChange={(e) =>
                                            onChangeInvoiceTambahan(e, i)
                                          }
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    {invoiceFileUpload[i + 1]?.length > 0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                          invoiceFileUpload[i + 1]
                                        }`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="flex flex-col gap-1 w-[350px]">
                                <div className="">Kwitansi</div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  total penagihan diatas 5 juta diwajibkan
                                  bermaterai
                                </div>
                              </div>

                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-kwitansi"
                                    className="w-fit"
                                  >
                                    {kwitansiFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    onChange={onChangeKwitansiFile}
                                    type="file"
                                    id="upload-kwitansi"
                                    accept=".jpg,.pdf"
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {kwitansiFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${kwitansiFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            {isPajak.value === 1 && (
                              <>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="w-[350px]">
                                      Faktur Pajak
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                      Max size 2 mb
                                    </div>
                                  </div>
                                  <div>:</div>
                                  <div className="flex items-center gap-1">
                                    <div>
                                      <label
                                        htmlFor="upload-fakturpajak"
                                        className="w-fit"
                                      >
                                        {fakturPajakFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        onChange={onChangeFakturPajakFile}
                                        type="file"
                                        id="upload-fakturpajak"
                                        accept=".jpg,.pdf"
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    <div>*)</div>
                                  </div>
                                  {fakturPajakFileUpload[0]?.trim().length >
                                    0 && (
                                    <a
                                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${fakturPajakFileUpload[0]}`}
                                      target="_blank"
                                      className="underline cursor-pointer text-blue-500"
                                      rel="noreferrer"
                                    >
                                      File terupload
                                    </a>
                                  )}
                                </div>
                                <div className="mb-10">
                                  {fakturPajakTambahan.map((item, i) => (
                                    <div key={i}>
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="flex flex-col gap-1">
                                          {i === 0 ? (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan
                                            </div>
                                          ) : (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan {i + 1}
                                            </div>
                                          )}
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>

                                        <div>:</div>
                                        <div className="flex items-center gap-1">
                                          <div>
                                            <label
                                              htmlFor={`pajak_${i}`}
                                              className="w-fit"
                                            >
                                              {isEmpty(
                                                fakturPajakTambahan[i]
                                              ) ? (
                                                <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>Upload</div>
                                                </div>
                                              ) : (
                                                <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>1 File</div>
                                                </div>
                                              )}
                                            </label>
                                            <input
                                              type="file"
                                              id={`pajak_${i}`}
                                              onChange={(e) =>
                                                onChangeFakturPajakTambahan(
                                                  e,
                                                  i
                                                )
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                        {fakturPajakFileUpload[i + 1]?.trim()
                                          .length > 0 && (
                                          <a
                                            href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                              fakturPajakFileUpload[i + 1]
                                            }`}
                                            target="_blank"
                                            className="underline cursor-pointer text-blue-500"
                                            rel="noreferrer"
                                          >
                                            File terupload
                                          </a>
                                        )}
                                        <div></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            <div className="flex items-center gap-3 mb-20">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">Receiving Note</div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-receivingnote"
                                    className="w-fit"
                                  >
                                    {receivingNoteFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    onChange={onChangeReceivingNoteFile}
                                    type="file"
                                    id="upload-receivingnote"
                                    accept=".jpg,.pdf"
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {receivingNoteFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${receivingNoteFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div>
                              <div className="italic">
                                Dokumen asli (hardcopy) sudah di kirimkan ke PT
                                Karya Prima Unggulan :
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-[350px]">Tipe Pengiriman</div>
                                <div>:</div>
                                <div className="w-1/4 relative">
                                  <Select
                                    value={tipePengiriman}
                                    onChange={onChangeTipePengiriman}
                                    className="whitespace-nowrap"
                                    options={optionsTipePengiriman}
                                    noOptionsMessage={() => "Data not found"}
                                    styles={customeStyles}
                                    required
                                  />
                                  <div className="absolute right-[-20px] top-0">
                                    {isError && isEmpty(tipePengiriman) ? (
                                      <div className="text-red-500">
                                        <PiWarningCircleLight />
                                      </div>
                                    ) : (
                                      "*)"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex flex-col gap-1">
                                  <div className="w-[350px]">
                                    Resi Bukti Pengiriman
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    Max size 2 mb
                                  </div>
                                </div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div>
                                    <label
                                      htmlFor="upload-resi"
                                      className="w-fit"
                                    >
                                      {resiFile === null ? (
                                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                          <span>
                                            <FaCloudUploadAlt />
                                          </span>
                                          <div>Upload</div>
                                        </div>
                                      ) : (
                                        <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                          <span>
                                            <FaCloudUploadAlt />
                                          </span>
                                          <div>1 File</div>
                                        </div>
                                      )}
                                    </label>
                                    <input
                                      disabled={
                                        tipePengiriman.value === 1
                                          ? false
                                          : true
                                      }
                                      type="file"
                                      onChange={onChangeResiBuktiPengirimanFile}
                                      id="upload-resi"
                                      accept=".jpg,.pdf"
                                      className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  {tipePengiriman.value === 1 && <div>*)</div>}
                                </div>
                                {resiFileUpload.trim().length > 0 && (
                                  <a
                                    href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${resiFileUpload}`}
                                    target="_blank"
                                    className="underline cursor-pointer text-blue-500"
                                    rel="noreferrer"
                                  >
                                    File terupload
                                  </a>
                                )}
                              </div>
                              {isError && (
                                <div className="mt-10 mb-3">
                                  <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                    <div>
                                      <PiWarningCircleLight />
                                    </div>
                                    <div>Data masih belum lengkap</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">Purchase Order</div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-purchaseorder"
                                    className="w-fit"
                                  >
                                    {purchaseOrderFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-purchaseorder"
                                    accept=".jpg,.pdf"
                                    onChange={onChangePurchaseOrderFile}
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {purchaseOrderFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${purchaseOrderFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">
                                  Delivery Order (DO) / Packing List (Surat
                                  Jalan)
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>

                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-deliveryorder"
                                    className="w-fit"
                                  >
                                    {deliveryOrderFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-deliveryorder"
                                    accept=".jpg,.pdf"
                                    onChange={onChangeDeliveryOrderFile}
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {deliveryOrderFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${deliveryOrderFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">
                                  Invoice (Faktur Penagihan)
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-invoice"
                                    className="w-fit"
                                  >
                                    {invoiceFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-invoice"
                                    accept=".jpg,.pdf"
                                    onChange={onChangeInvoiceFile}
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {invoiceFileUpload[0].trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${invoiceFileUpload[0]}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div className="mb-10">
                              {invoiceTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      {i === 0 ? (
                                        <div className="w-[350px]">
                                          Invoice Tambahan
                                        </div>
                                      ) : (
                                        <div className="w-[350px]">
                                          Invoice Tambahan {i + 1}
                                        </div>
                                      )}
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                        <label
                                          htmlFor={`invoice_${i}`}
                                          className="w-fit"
                                        >
                                          {isEmpty(invoiceTambahan[i]) ? (
                                            <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>Upload</div>
                                            </div>
                                          ) : (
                                            <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>1 File</div>
                                            </div>
                                          )}
                                        </label>
                                        <input
                                          type="file"
                                          id={`invoice_${i}`}
                                          onChange={(e) =>
                                            onChangeInvoiceTambahan(e, i)
                                          }
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    {invoiceFileUpload[i + 1]?.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                          invoiceFileUpload[i + 1]
                                        }`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="flex flex-col gap-1 w-[350px] ">
                                <div>Kwitansi</div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  total penagihan diatas 5 juta diwajibkan
                                  bermaterai
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-kwitansi"
                                    className="w-fit"
                                  >
                                    {kwitansiFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-kwitansi"
                                    accept=".jpg,.pdf"
                                    onChange={onChangeKwitansiFile}
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {kwitansiFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${kwitansiFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            {isPajak.value === 1 && (
                              <>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="w-[350px]">
                                      Faktur Pajak
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                      Max size 2 mb
                                    </div>
                                  </div>
                                  <div>:</div>
                                  <div className="flex items-center gap-1">
                                    <div>
                                      <label
                                        htmlFor="upload-fakturpajak"
                                        className="w-fit"
                                      >
                                        {fakturPajakFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-fakturpajak"
                                        onChange={onChangeFakturPajakFile}
                                        accept=".jpg,.pdf"
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    <div>*)</div>
                                  </div>
                                  {fakturPajakFileUpload[0]?.trim().length >
                                    0 && (
                                    <a
                                      href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${fakturPajakFileUpload[0]}`}
                                      target="_blank"
                                      className="underline cursor-pointer text-blue-500"
                                      rel="noreferrer"
                                    >
                                      File terupload
                                    </a>
                                  )}
                                </div>
                                <div className="mb-10">
                                  {fakturPajakTambahan.map((item, i) => (
                                    <div key={i}>
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="flex flex-col gap-1">
                                          {i === 0 ? (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan
                                            </div>
                                          ) : (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan {i + 1}
                                            </div>
                                          )}
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>

                                        <div>:</div>
                                        <div className="flex items-center gap-1">
                                          <div>
                                            <label
                                              htmlFor={`pajak_${i}`}
                                              className="w-fit"
                                            >
                                              {isEmpty(
                                                fakturPajakTambahan[i]
                                              ) ? (
                                                <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>Upload</div>
                                                </div>
                                              ) : (
                                                <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>1 File</div>
                                                </div>
                                              )}
                                            </label>
                                            <input
                                              type="file"
                                              id={`pajak_${i}`}
                                              onChange={(e) =>
                                                onChangeFakturPajakTambahan(
                                                  e,
                                                  i
                                                )
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                        {fakturPajakFileUpload[i + 1]?.trim()
                                          .length > 0 && (
                                          <a
                                            href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                              fakturPajakFileUpload[i + 1]
                                            }`}
                                            target="_blank"
                                            className="underline cursor-pointer text-blue-500"
                                            rel="noreferrer"
                                          >
                                            File terupload
                                          </a>
                                        )}
                                        <div></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            <div className="flex items-center gap-3 mb-20">
                              <div className="flex flex-col gap-1">
                                <div className="w-[350px]">
                                  Scan Report Sales
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Max size 2 mb
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <label
                                    htmlFor="upload-scanreportsales"
                                    className="w-fit"
                                  >
                                    {scanReportSalesFile === null ? (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>Upload</div>
                                      </div>
                                    ) : (
                                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                        <span>
                                          <FaCloudUploadAlt />
                                        </span>
                                        <div>1 File</div>
                                      </div>
                                    )}
                                  </label>
                                  <input
                                    type="file"
                                    id="upload-scanreportsales"
                                    accept=".jpg,.pdf"
                                    onChange={onChangeScanReportSalesFile}
                                    className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                              {scanReportSalesFileUpload.trim().length > 0 && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${scanReportSalesFileUpload}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )}
                            </div>
                            <div>
                              <div className="italic">
                                Dokumen asli (hardcopy) sudah di kirimkan ke PT
                                Karya Prima Unggulan :
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-[350px]">Tipe Pengiriman</div>
                                <div>:</div>
                                <div className="w-1/4 relative">
                                  <Select
                                    value={tipePengiriman}
                                    onChange={onChangeTipePengiriman}
                                    className="whitespace-nowrap"
                                    options={optionsTipePengiriman}
                                    noOptionsMessage={() => "Data not found"}
                                    styles={customeStyles}
                                    required
                                  />
                                  <div className="absolute right-[-20px] top-0">
                                    {isError && isEmpty(tipePengiriman) ? (
                                      <div className="text-red-500">
                                        <PiWarningCircleLight />
                                      </div>
                                    ) : (
                                      "*)"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-[350px]">
                                  Resi Bukti Pengiriman
                                </div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div>
                                    <label
                                      htmlFor="upload-resi"
                                      className="w-fit"
                                    >
                                      {resiFile === null ? (
                                        <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                          <span>
                                            <FaCloudUploadAlt />
                                          </span>
                                          <div>Upload</div>
                                        </div>
                                      ) : (
                                        <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                          <span>
                                            <FaCloudUploadAlt />
                                          </span>
                                          <div>1 File</div>
                                        </div>
                                      )}
                                    </label>
                                    <input
                                      disabled={
                                        tipePengiriman.value === 1
                                          ? false
                                          : true
                                      }
                                      type="file"
                                      id="upload-resi"
                                      accept=".jpg,.pdf"
                                      className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  {tipePengiriman.value === 1 && <div>*)</div>}
                                </div>
                                {resiFileUpload.trim().length > 0 && (
                                  <a
                                    href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${resiFileUpload}`}
                                    target="_blank"
                                    className="underline cursor-pointer text-blue-500"
                                    rel="noreferrer"
                                  >
                                    File terupload
                                  </a>
                                )}
                              </div>
                              {isError && (
                                <div className="mt-10 mb-3">
                                  <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                    <div>
                                      <PiWarningCircleLight />
                                    </div>
                                    <div>Data masih belum lengkap</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  )
                )}

                <div
                  className={`flex mt-24  mb-5 ${
                    activeStep !== 0 ? "justify-between" : "justify-end"
                  } `}
                >
                  {activeStep === steps.length - 1 ? (
                    <button
                      onClick={
                        tipePenagihan.value === "beli putus"
                          ? saveDraft
                          : saveDraft2
                      }
                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                        activeStep === 0 ? "hidden" : "block"
                      } `}
                    >
                      Save As Draft
                    </button>
                  ) : (
                    <button
                      onClick={handleBack}
                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                        activeStep === 0 ? "hidden" : "block"
                      } `}
                    >
                      Back
                    </button>
                  )}

                  {activeStep === steps.length - 1 ? (
                    <button
                      onClick={
                        tipePenagihan.value === "beli putus"
                          ? handleNext
                          : handleNext2
                      }
                      className={`bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]`}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={
                        tipePenagihan.value === "beli putus"
                          ? handleNext
                          : handleNext2
                      }
                      className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((item, index) => {
                return (
                  <Step key={index}>
                    <StepLabel>{item}</StepLabel>
                    <StepContent>
                      {activeStep === 0 ? (
                        <div className="mt-5">
                          <form action="">
                            <div className="flex flex-col gap-2">
                              <div>
                                <label htmlFor="">Tipe Penagihan</label>
                              </div>
                              <div>
                                <Select
                                  isDisabled={true}
                                  value={tipePenagihan}
                                  onChange={onChangeTipePenagihan}
                                  className="whitespace-nowrap"
                                  options={optionsTipePenagihan}
                                  noOptionsMessage={() => "Data not found"}
                                  styles={customeStyles}
                                  required
                                />
                              </div>
                            </div>
                          </form>

                          <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-end">
                            {screenSize > 348 ? (
                              <>
                                <button
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : activeStep === 1 ? (
                        <div className="mt-5">
                          <form action="">
                            {tipePenagihan.label === "Beli Putus" ? (
                              <>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex flex-col gap-1">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      No Purchase Order{" "}
                                      {isError &&
                                      nomerPo.trim().length === 0 ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                    <div className="flex gap-1 items-center text-[12px]">
                                      <div>
                                        <PiWarningCircleLight />
                                      </div>
                                      <div>Harus 8 digit</div>
                                    </div>
                                  </div>
                                  <div className="w-full">
                                    <div className="flex items-center gap-1">
                                      <div>PO</div>
                                      <input
                                        maxLength={8}
                                        type="text"
                                        pattern="[0-9]*"
                                        name=""
                                        id=""
                                        value={nomerPo}
                                        onChange={(e) => onChangeNomerPo(e)}
                                        className={`w-full h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] ${
                                          isError && nomerPo.trim().length === 0
                                            ? "border-red-400"
                                            : "border-slate-300"
                                        } `}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      Tanggal PO{" "}
                                      {isError && tanggalPo === undefined ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#ddebf7]"
                                            value={tanggalPo}
                                            onChange={onChangeTanggalPo}
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      No Delivery Order{" "}
                                      {isError &&
                                      nomerDo.trim().length === 0 ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <div>
                                      <input
                                        type="text"
                                        name=""
                                        id=""
                                        value={nomerDo}
                                        onKeyDown={(evt) =>
                                          evt.key === " " &&
                                          evt.preventDefault()
                                        }
                                        onChange={(e) =>
                                          setNomerDo(e.target.value)
                                        }
                                        className={`max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] ${
                                          isError && nomerDo.trim().length === 0
                                            ? "border-red-400"
                                            : "border-slate-300"
                                        } `}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-10">
                                  <div className="flex">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      Delivery Area{" "}
                                      {isError && isEmpty(deliveryArea) ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <div>
                                      <Select
                                        value={deliveryArea}
                                        onChange={onChangeDeliveryArea}
                                        className="whitespace-nowrap"
                                        options={optionsDeliveryArea}
                                        noOptionsMessage={() =>
                                          "Data not found"
                                        }
                                        styles={customeStyles}
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-10">
                                  {nomerInvoice.map((item, i) => (
                                    <div
                                      className="flex flex-col gap-2 mb-3"
                                      key={i}
                                    >
                                      {i === 0 ? (
                                        <div className="w-[250px]">
                                          No Invoice *) :
                                        </div>
                                      ) : (
                                        <div className="w-[250px]">
                                          No Invoice {i + 1}
                                        </div>
                                      )}
                                      <div className="fw-full">
                                        <div>
                                          <input
                                            type="text"
                                            name=""
                                            id={i}
                                            value={item.value}
                                            onChange={onChangeInvoice}
                                            onKeyDown={(evt) =>
                                              evt.key === " " &&
                                              evt.preventDefault()
                                            }
                                            className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between max-[357px]:flex-col max-[357px]:items-start max-[357px]:gap-2">
                                    {nomerInvoice.length > 1 && (
                                      <div
                                        onClick={deleteInput}
                                        className={`py-1 px-4 text-center rounded-sm shadow-sm text-white bg-red-500 w-fit max-[357px]:w-full ${
                                          nomerInvoice.length === 4
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        } `}
                                      >
                                        Delete row
                                      </div>
                                    )}

                                    <div
                                      onClick={addInput}
                                      className={`py-1 px-4 text-center rounded-sm shadow-sm text-white bg-[#305496]  w-fit max-[357px]:w-full ${
                                        nomerInvoice.length === 4
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      Add row
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-10">
                                  {nomerInvoice.map((item, i) => (
                                    <div key={i}>
                                      <div className="flex flex-col gap-2 mb-3">
                                        {i === 0 ? (
                                          <div className="w-[250px]">
                                            Tanggal Invoice *) :
                                          </div>
                                        ) : (
                                          <div className="w-[250px]">
                                            Tanggal Invoice {i + 1}
                                          </div>
                                        )}

                                        <div className="w-full">
                                          <div>
                                            <LocalizationProvider
                                              dateAdapter={AdapterDayjs}
                                            >
                                              <DemoContainer
                                                components={["DatePicker"]}
                                              >
                                                <DatePicker
                                                  className="w-full bg-[#ddebf7]"
                                                  value={
                                                    tanggalInvoice[i].value
                                                  }
                                                  onChange={(item) =>
                                                    onChangeTanggalInvoice(
                                                      item,
                                                      i
                                                    )
                                                  }
                                                  slotProps={{
                                                    textField: {
                                                      size: "small",
                                                    },
                                                  }}
                                                />
                                              </DemoContainer>
                                            </LocalizationProvider>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-2 mb-3">
                                        {i === 0 ? (
                                          <div className="w-[250px]">
                                            Nilai Invoice *) :
                                          </div>
                                        ) : (
                                          <div className="w-[250px]">
                                            Nilai Invoice {i + 1}
                                          </div>
                                        )}
                                        <div className="fw-full">
                                          <div>
                                            <input
                                              id={i}
                                              type="text"
                                              value={nilaiInvoice[i].value}
                                              onChange={onChangeNilaiInvoice}
                                              className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>Apakah barang termasuk pajak? *) : </div>

                                  <div className="w-full">
                                    <div>
                                      <Select
                                        value={isPajak}
                                        onChange={onChangeIsPajak}
                                        className="whitespace-nowrap"
                                        options={options}
                                        noOptionsMessage={() =>
                                          "Data not found"
                                        }
                                        styles={customeStyles}
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <div className="flex flex-col gap-2 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[250px]">
                                        No Seri Faktur Pajak
                                      </div>
                                      <div className="flex gap-1 items-center text-[12px]">
                                        <div>
                                          <PiWarningCircleLight />
                                        </div>
                                        <div>Harus 16 digit</div>
                                      </div>
                                    </div>

                                    <div className="fw-full">
                                      <div className="flex flex-col gap-2">
                                        {nomerSeriFakturPajak.map(
                                          (input, i) => (
                                            <div
                                              key={i}
                                              className="flex items-center gap-1"
                                            >
                                              <input
                                                maxLength={20}
                                                disabled={
                                                  isPajak.label === "Tidak"
                                                    ? true
                                                    : false
                                                }
                                                type={input.type}
                                                name=""
                                                id=""
                                                value={input.value}
                                                onChange={(e) =>
                                                  formatFakturPajak(
                                                    e.target.value,
                                                    i
                                                  )
                                                }
                                                className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                              />
                                              <div>{i === 0 ? "*)" : ""}</div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {isError && (
                                  <div className="mt-10 mb-3">
                                    <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                      <div>
                                        <PiWarningCircleLight />
                                      </div>
                                      <div>Data masih belum lengkap</div>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex flex-col gap-1">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      No Purchase Order{" "}
                                      {isError &&
                                      nomerPo.trim().length === 0 ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                    <div className="flex gap-1 items-center text-[12px]">
                                      <div>
                                        <PiWarningCircleLight />
                                      </div>
                                      <div>Harus 8 digit</div>
                                    </div>
                                  </div>
                                  <div className="w-full">
                                    <div className="flex items-center gap-1">
                                      <div>PO</div>
                                      <input
                                        maxLength={8}
                                        type="text"
                                        pattern="[0-9]*"
                                        name=""
                                        id=""
                                        value={nomerPo}
                                        onChange={(e) => onChangeNomerPo(e)}
                                        className={`w-full h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] ${
                                          isError && nomerPo.trim().length === 0
                                            ? "border-red-400"
                                            : "border-slate-400"
                                        } `}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div className="flex">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      Tanggal PO{" "}
                                      {isError && tanggalPo === undefined ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#fff2cc]"
                                            value={tanggalPo}
                                            onChange={onChangeTanggalPo}
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-10">
                                  <div className="flex">
                                    <label
                                      htmlFor=""
                                      className="flex gap-1 items-center"
                                    >
                                      Delivery Area{" "}
                                      {isError && isEmpty(deliveryArea) ? (
                                        <span className="text-red-400">
                                          <PiWarningCircleLight />
                                        </span>
                                      ) : (
                                        "*"
                                      )}
                                    </label>
                                  </div>

                                  <div className="w-full">
                                    <div>
                                      <Select
                                        value={deliveryArea}
                                        onChange={onChangeDeliveryArea}
                                        className="whitespace-nowrap"
                                        options={optionsDeliveryArea}
                                        noOptionsMessage={() =>
                                          "Data not found"
                                        }
                                        styles={customeStyles}
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  {nomerInvoice.map((item, i) => (
                                    <div key={i}>
                                      <div
                                        className="flex flex-col gap-2 mb-3"
                                        key={i}
                                      >
                                        {i === 0 ? (
                                          <div className="">
                                            No Invoice *) :
                                          </div>
                                        ) : (
                                          <div className="">
                                            No Invoice {i + 1}
                                          </div>
                                        )}
                                        <div className="fw-full">
                                          <div>
                                            <input
                                              type="text"
                                              name=""
                                              id={i}
                                              value={item.value}
                                              onChange={onChangeInvoice}
                                              onKeyDown={(evt) =>
                                                evt.key === " " &&
                                                evt.preventDefault()
                                              }
                                              className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 mb-3">
                                        {i === 0 ? (
                                          <div className="">
                                            Tanggal Invoice *) :
                                          </div>
                                        ) : (
                                          <div className="">
                                            Tanggal Invoice {i + 1}
                                          </div>
                                        )}

                                        <div className="w-full">
                                          <div>
                                            <LocalizationProvider
                                              dateAdapter={AdapterDayjs}
                                            >
                                              <DemoContainer
                                                components={["DatePicker"]}
                                              >
                                                <DatePicker
                                                  className="w-full bg-[#fff2cc]"
                                                  value={
                                                    tanggalInvoice2[i].value
                                                  }
                                                  onChange={(item) =>
                                                    onChangeTanggalInvoice2(
                                                      item,
                                                      i
                                                    )
                                                  }
                                                  slotProps={{
                                                    textField: {
                                                      size: "small",
                                                    },
                                                  }}
                                                />
                                              </DemoContainer>
                                            </LocalizationProvider>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between max-[357px]:flex-col max-[357px]:items-start max-[357px]:gap-2">
                                    {nomerInvoice.length > 1 && (
                                      <div
                                        onClick={deleteInput}
                                        className={`py-1 px-4 text-center rounded-sm shadow-sm text-white bg-red-500 w-fit max-[357px]:w-full ${
                                          nomerInvoice.length === 4
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        } `}
                                      >
                                        Delete row
                                      </div>
                                    )}

                                    <div
                                      onClick={addInput}
                                      className={`py-1 px-4 text-center rounded-sm shadow-sm text-white bg-[#305496]  w-fit max-[357px]:w-full ${
                                        nomerInvoice.length === 4
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      Add row
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-10 mt-10">
                                  {nomerInvoice.map((item, i) => (
                                    <div
                                      className="flex flex-col gap-2 mb-3"
                                      key={i}
                                    >
                                      {i === 0 ? (
                                        <div className="w-[250px]">
                                          Nilai Invoice *) :
                                        </div>
                                      ) : (
                                        <div className="w-[250px]">
                                          Nilai Invoice {i + 1}
                                        </div>
                                      )}
                                      <div className="fw-full">
                                        <div>
                                          <input
                                            id={i}
                                            type="text"
                                            value={nilaiInvoice[i].value}
                                            onChange={onChangeNilaiInvoice}
                                            className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mb-3">
                                  <div className="w-[250px]">
                                    Periode Acuan Penagihan :
                                  </div>
                                  <div className="ps-5 flex flex-col gap-1 mt-2">
                                    <div>Dari tanggal *)</div>
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#fff2cc]"
                                            value={startDatePeriode}
                                            onChange={(item) =>
                                              setStartDatePeriode(item)
                                            }
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                  <div className="ps-5 flex flex-col gap-1 mt-2">
                                    <div>Sampai tanggal *)</div>
                                    <div>
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="w-full bg-[#fff2cc]"
                                            value={endDatePeriode}
                                            onChange={(item) =>
                                              setEndDatePeriode(item)
                                            }
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>Apakah barang termasuk pajak? *) : </div>

                                  <div className="w-full">
                                    <div>
                                      <Select
                                        value={isPajak}
                                        onChange={onChangeIsPajak}
                                        className="whitespace-nowrap"
                                        options={options}
                                        noOptionsMessage={() =>
                                          "Data not found"
                                        }
                                        styles={customeStyles}
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <div className="flex flex-col gap-2 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[250px]">
                                        No Seri Faktur Pajak
                                      </div>
                                      <div className="flex gap-1 items-center text-[12px]">
                                        <div>
                                          <PiWarningCircleLight />
                                        </div>
                                        <div>Harus 16 digit</div>
                                      </div>
                                    </div>

                                    <div className="fw-full">
                                      <div className="flex flex-col gap-2">
                                        {nomerSeriFakturPajak.map(
                                          (input, i) => (
                                            <div
                                              key={i}
                                              className="flex items-center gap-1"
                                            >
                                              <input
                                                maxLength={20}
                                                disabled={
                                                  isPajak.label === "Tidak"
                                                    ? true
                                                    : false
                                                }
                                                type={input.type}
                                                name=""
                                                id=""
                                                value={input.value}
                                                onChange={(e) =>
                                                  formatFakturPajak(
                                                    e.target.value,
                                                    i
                                                  )
                                                }
                                                className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                              />
                                              <div>{i === 0 ? "*)" : ""}</div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {isError && (
                                  <div className="mt-10 mb-3">
                                    <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                      <div>
                                        <PiWarningCircleLight />
                                      </div>
                                      <div>Data masih belum lengkap</div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </form>
                          <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between">
                            {screenSize > 348 ? (
                              <>
                                {activeStep === steps.length - 1 ? (
                                  <button
                                    disabled={activeStep === 0}
                                    onClick={
                                      tipePenagihan.value === "beli putus"
                                        ? saveDraft
                                        : saveDraft2
                                    }
                                    className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                      activeStep === 0 && "cursor-not-allowed"
                                    } `}
                                  >
                                    Save as draft
                                  </button>
                                ) : (
                                  <button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                      activeStep === 0 && "cursor-not-allowed"
                                    } `}
                                  >
                                    Back
                                  </button>
                                )}

                                <button
                                  onClick={
                                    tipePenagihan.value === "beli putus"
                                      ? handleNext
                                      : handleNext2
                                  }
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {activeStep === steps.length - 1
                                    ? "Submit"
                                    : "Next"}
                                </button>
                              </>
                            ) : (
                              <>
                                {activeStep === steps.length - 1 ? (
                                  <button
                                    disabled={activeStep === 0}
                                    onClick={
                                      tipePenagihan.value === "beli putus"
                                        ? saveDraft
                                        : saveDraft2
                                    }
                                    className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                      activeStep === 0 && "cursor-not-allowed"
                                    } `}
                                  >
                                    Save as draft
                                  </button>
                                ) : (
                                  <button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                      activeStep === 0 && "cursor-not-allowed"
                                    } `}
                                  >
                                    Back
                                  </button>
                                )}

                                <button
                                  onClick={
                                    tipePenagihan.value === "beli putus"
                                      ? handleNext
                                      : handleNext2
                                  }
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        activeStep === 2 && (
                          <div className="mt-5">
                            <form action="">
                              {tipePenagihan.label === "Beli Putus" ? (
                                <>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[350px]">
                                        Purchase Order *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-purchaseorder"
                                        className="w-fit"
                                      >
                                        {purchaseOrderFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-purchaseorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangePurchaseOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {purchaseOrderFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${purchaseOrderFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Delivery Order (DO) / Packing List
                                        (Surat Jalan) *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-deliveryorder"
                                        className="w-fit"
                                      >
                                        {deliveryOrderFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-deliveryorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeDeliveryOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {deliveryOrderFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${deliveryOrderFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Invoice (Faktur Penagihan) *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-invoice"
                                        className="w-fit"
                                      >
                                        {invoiceFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-invoice"
                                        onChange={onChangeInvoiceFile}
                                        accept=".jpg,.pdf"
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {invoiceFileUpload[0].length > 0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${invoiceFileUpload[0]}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="mb-10">
                                    {invoiceTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          <div className="flex flex-col gap-1">
                                            {i === 0 ? (
                                              <div>Invoice Tambahan :</div>
                                            ) : (
                                              <div>
                                                Invoice Tambahan : {i + 1}
                                              </div>
                                            )}
                                            <div className="text-[10px] text-gray-500">
                                              Max size 2 mb
                                            </div>
                                          </div>

                                          <div>
                                            <label
                                              htmlFor={`invoice_${i}`}
                                              className="w-fit"
                                            >
                                              {isEmpty(invoiceTambahan[i]) ? (
                                                <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>Upload</div>
                                                </div>
                                              ) : (
                                                <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>1 File</div>
                                                </div>
                                              )}
                                            </label>
                                            <input
                                              type="file"
                                              id={`invoice_${i}`}
                                              onChange={(e) =>
                                                onChangeInvoiceTambahan(e, i)
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] "
                                            />
                                          </div>
                                          {invoiceFileUpload[i + 1]?.length >
                                            0 && (
                                            <a
                                              href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                                invoiceFileUpload[i + 1]
                                              }`}
                                              target="_blank"
                                              className="underline cursor-pointer text-blue-500"
                                              rel="noreferrer"
                                            >
                                              File terupload
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-10">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[350px]">
                                        Kwitansi *)
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        total penagihan diatas 5 juta diwajibkan
                                        bermaterai
                                      </div>
                                    </div>

                                    <div className="w-full">
                                      <label
                                        htmlFor="upload-kwitansi"
                                        className="w-fit"
                                      >
                                        {kwitansiFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-kwitansi"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeKwitansiFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {kwitansiFileUpload.trim().length > 0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${kwitansiFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  {isPajak.value === 1 && (
                                    <>
                                      <div className="flex flex-col gap-3 mb-3">
                                        <div className="flex flex-col gap-1">
                                          <div className="">
                                            Faktur Pajak *) :
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>

                                        <div>
                                          <label
                                            htmlFor="upload-fakturpajak"
                                            className="w-fit"
                                          >
                                            {fakturPajakFile === null ? (
                                              <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                <span>
                                                  <FaCloudUploadAlt />
                                                </span>
                                                <div>Upload</div>
                                              </div>
                                            ) : (
                                              <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                <span>
                                                  <FaCloudUploadAlt />
                                                </span>
                                                <div>1 File</div>
                                              </div>
                                            )}
                                          </label>
                                          <input
                                            type="file"
                                            id="upload-fakturpajak"
                                            accept=".jpg,.pdf"
                                            onChange={onChangeFakturPajakFile}
                                            className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                          />
                                        </div>
                                        {fakturPajakFileUpload[0]?.length >
                                          0 && (
                                          <a
                                            href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${fakturPajakFileUpload[0]}`}
                                            target="_blank"
                                            className="underline cursor-pointer text-blue-500"
                                            rel="noreferrer"
                                          >
                                            File terupload
                                          </a>
                                        )}
                                      </div>
                                      <div className="mb-10">
                                        {fakturPajakTambahan.map((item, i) => (
                                          <div key={i}>
                                            <div className="flex flex-col gap-3 mb-3">
                                              <div className="flex flex-col gap-1">
                                                {i === 0 ? (
                                                  <div>
                                                    Faktur Pajak Tambahan
                                                  </div>
                                                ) : (
                                                  <div>
                                                    Faktur Pajak Tambahan{" "}
                                                    {i + 1}
                                                  </div>
                                                )}
                                                <div className="text-[10px] text-gray-500">
                                                  Max size 2 mb
                                                </div>
                                              </div>

                                              <div>
                                                <label
                                                  htmlFor={`pajak_${i}`}
                                                  className="w-fit"
                                                >
                                                  {isEmpty(
                                                    fakturPajakTambahan[i]
                                                  ) ? (
                                                    <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                      <span>
                                                        <FaCloudUploadAlt />
                                                      </span>
                                                      <div>Upload</div>
                                                    </div>
                                                  ) : (
                                                    <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                                      <span>
                                                        <FaCloudUploadAlt />
                                                      </span>
                                                      <div>1 File</div>
                                                    </div>
                                                  )}
                                                </label>
                                                <input
                                                  type="file"
                                                  id={`pajak_${i}`}
                                                  onChange={(e) =>
                                                    onChangeFakturPajakTambahan(
                                                      e,
                                                      i
                                                    )
                                                  }
                                                  accept=".jpg,.pdf"
                                                  className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                                />
                                              </div>
                                              {fakturPajakFileUpload[i + 1]
                                                ?.length > 0 && (
                                                <a
                                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                                    fakturPajakFileUpload[i + 1]
                                                  }`}
                                                  target="_blank"
                                                  className="underline cursor-pointer text-blue-500"
                                                  rel="noreferrer"
                                                >
                                                  File terupload
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}

                                  <div className="flex flex-col gap-3 mb-20">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Receiving Note *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-receivingnote"
                                        className="w-fit"
                                      >
                                        {receivingNoteFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-receivingnote"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeReceivingNoteFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {receivingNoteFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${receivingNoteFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <div className="italic">
                                      Dokumen asli (hardcopy) sudah di kirimkan
                                      ke PT Karya Prima Unggulan :
                                    </div>
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div>Tipe Pengiriman *) :</div>

                                      <div className="w-full">
                                        <Select
                                          value={tipePengiriman}
                                          onChange={onChangeTipePengiriman}
                                          className="whitespace-nowrap"
                                          options={optionsTipePengiriman}
                                          noOptionsMessage={() =>
                                            "Data not found"
                                          }
                                          styles={customeStyles}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          Resi Bukti Pengiriman{" "}
                                          {tipePengiriman.value === 1
                                            ? "*)"
                                            : ""}{" "}
                                          :
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                          Max size 2 mb
                                        </div>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor="upload-resi"
                                          className="w-fit"
                                        >
                                          {resiFile === null ? (
                                            <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>Upload</div>
                                            </div>
                                          ) : (
                                            <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>1 File</div>
                                            </div>
                                          )}
                                        </label>
                                        <input
                                          disabled={
                                            tipePengiriman.value === 1
                                              ? false
                                              : true
                                          }
                                          type="file"
                                          id="upload-resi"
                                          accept=".jpg,.pdf"
                                          onChange={
                                            onChangeResiBuktiPengirimanFile
                                          }
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        />
                                      </div>
                                      {resiFileUpload.trim().length > 0 && (
                                        <a
                                          href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${resiFileUpload}`}
                                          target="_blank"
                                          className="underline cursor-pointer text-blue-500"
                                          rel="noreferrer"
                                        >
                                          File terupload
                                        </a>
                                      )}
                                    </div>
                                    {isError && (
                                      <div className="mt-10 mb-3">
                                        <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                          <div>
                                            <PiWarningCircleLight />
                                          </div>
                                          <div>Data masih belum lengkap</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Purchase Order *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-purchaseorder"
                                        className="w-fit"
                                      >
                                        {purchaseOrderFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-purchaseorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangePurchaseOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {purchaseOrderFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${purchaseOrderFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Delivery Order (DO) / Packing List
                                        (Surat Jalan) *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-deliveryorder"
                                        className="w-fit"
                                      >
                                        {deliveryOrderFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-deliveryorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeDeliveryOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {deliveryOrderFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${deliveryOrderFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Invoice (Faktur Penagihan) *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-invoice"
                                        className="w-fit"
                                      >
                                        {invoiceFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-invoice"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeInvoiceFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {invoiceFileUpload[0].length > 0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${invoiceFileUpload[0]}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div className="mb-10">
                                    {invoiceTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          <div className="flex flex-col gap-1">
                                            {i === 0 ? (
                                              <div>Invoice Tambahan</div>
                                            ) : (
                                              <div>
                                                Invoice Tambahan {i + 1}
                                              </div>
                                            )}
                                            <div className="text-[10px] text-gray-500">
                                              Max size 2 mb
                                            </div>
                                          </div>

                                          <div>
                                            <label
                                              htmlFor={`invoice_${i}`}
                                              className="w-fit"
                                            >
                                              {isEmpty(invoiceTambahan[i]) ? (
                                                <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>Upload</div>
                                                </div>
                                              ) : (
                                                <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                  <span>
                                                    <FaCloudUploadAlt />
                                                  </span>
                                                  <div>1 File</div>
                                                </div>
                                              )}
                                            </label>
                                            <input
                                              type="file"
                                              id={`invoice_${i}`}
                                              onChange={(e) =>
                                                onChangeInvoiceTambahan(e, i)
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                          {invoiceFileUpload[i + 1]?.length >
                                            0 && (
                                            <a
                                              href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                                invoiceFileUpload[i + 1]
                                              }`}
                                              target="_blank"
                                              className="underline cursor-pointer text-blue-500"
                                              rel="noreferrer"
                                            >
                                              File terupload
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex flex-col gap-3 mb-10">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex flex-col gap-1">
                                        <div className="">Kwitansi *) :</div>
                                        <div className="text-[10px] text-gray-500">
                                          Max size 2 mb
                                        </div>
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        total penagihan diatas 5 juta diwajibkan
                                        bermaterai
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-kwitansi"
                                        className="w-fit"
                                      >
                                        {kwitansiFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-kwitansi"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeKwitansiFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {kwitansiFileUpload.trim().length > 0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${kwitansiFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  {isPajak.value === 1 && (
                                    <>
                                      <div className="flex flex-col gap-3 mb-3">
                                        <div className="flex flex-col gap-1">
                                          <div className="">
                                            Faktur Pajak *) :
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>

                                        <div>
                                          <label
                                            htmlFor="upload-fakturpajak"
                                            className="w-fit"
                                          >
                                            {fakturPajakFile === null ? (
                                              <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                <span>
                                                  <FaCloudUploadAlt />
                                                </span>
                                                <div>Upload</div>
                                              </div>
                                            ) : (
                                              <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                <span>
                                                  <FaCloudUploadAlt />
                                                </span>
                                                <div>1 File</div>
                                              </div>
                                            )}
                                          </label>
                                          <input
                                            type="file"
                                            id="upload-fakturpajak"
                                            accept=".jpg,.pdf"
                                            onChange={onChangeFakturPajakFile}
                                            className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                          />
                                        </div>
                                        {fakturPajakFileUpload[0]?.length >
                                          0 && (
                                          <a
                                            href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${fakturPajakFileUpload[0]}`}
                                            target="_blank"
                                            className="underline cursor-pointer text-blue-500"
                                            rel="noreferrer"
                                          >
                                            File terupload
                                          </a>
                                        )}
                                      </div>
                                      <div className="mb-10">
                                        {fakturPajakTambahan.map((item, i) => (
                                          <div key={i}>
                                            <div className="flex flex-col gap-3 mb-3">
                                              <div className="flex flex-col gap-1">
                                                {i === 0 ? (
                                                  <div className="w-[350px]">
                                                    Faktur Pajak Tambahan
                                                  </div>
                                                ) : (
                                                  <div className="w-[350px]">
                                                    Faktur Pajak Tambahan{" "}
                                                    {i + 1}
                                                  </div>
                                                )}
                                                <div className="text-[10px] text-gray-500">
                                                  Max size 2 mb
                                                </div>
                                              </div>

                                              <div>
                                                <label
                                                  htmlFor={`pajak_${i}`}
                                                  className="w-fit"
                                                >
                                                  {isEmpty(
                                                    fakturPajakTambahan[i]
                                                  ) ? (
                                                    <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                      <span>
                                                        <FaCloudUploadAlt />
                                                      </span>
                                                      <div>Upload</div>
                                                    </div>
                                                  ) : (
                                                    <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                                      <span>
                                                        <FaCloudUploadAlt />
                                                      </span>
                                                      <div>1 File</div>
                                                    </div>
                                                  )}
                                                </label>
                                                <input
                                                  type="file"
                                                  id={`pajak_${i}`}
                                                  onChange={(e) =>
                                                    onChangeFakturPajakTambahan(
                                                      e,
                                                      i
                                                    )
                                                  }
                                                  accept=".jpg,.pdf"
                                                  className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                                />
                                              </div>
                                              {fakturPajakFileUpload[i + 1]
                                                ?.length > 0 && (
                                                <a
                                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${
                                                    fakturPajakFileUpload[i + 1]
                                                  }`}
                                                  target="_blank"
                                                  className="underline cursor-pointer text-blue-500"
                                                  rel="noreferrer"
                                                >
                                                  File terupload
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}

                                  <div className="flex flex-col gap-3 mb-20">
                                    <div className="flex flex-col gap-1">
                                      <div className="">
                                        Scan Report Sales *) :
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        Max size 2 mb
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="upload-scanreportsales"
                                        className="w-fit"
                                      >
                                        {scanReportSalesFile === null ? (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>Upload</div>
                                          </div>
                                        ) : (
                                          <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                            <span>
                                              <FaCloudUploadAlt />
                                            </span>
                                            <div>1 File</div>
                                          </div>
                                        )}
                                      </label>
                                      <input
                                        type="file"
                                        id="upload-scanreportsales"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeScanReportSalesFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                    {scanReportSalesFileUpload.trim().length >
                                      0 && (
                                      <a
                                        href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${scanReportSalesFileUpload}`}
                                        target="_blank"
                                        className="underline cursor-pointer text-blue-500"
                                        rel="noreferrer"
                                      >
                                        File terupload
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <div className="italic">
                                      Dokumen asli (hardcopy) sudah di kirimkan
                                      ke PT Karya Prima Unggulan :
                                    </div>
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div className="w-[350px]">
                                        Tipe Pengiriman *) :
                                      </div>

                                      <div className="w-full">
                                        <Select
                                          value={tipePengiriman}
                                          onChange={onChangeTipePengiriman}
                                          className="whitespace-nowrap"
                                          options={optionsTipePengiriman}
                                          noOptionsMessage={() =>
                                            "Data not found"
                                          }
                                          styles={customeStyles}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          Resi Bukti Pengiriman{" "}
                                          {tipePengiriman.value === 1
                                            ? "*)"
                                            : ""}{" "}
                                          :
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                          Max size 2 mb
                                        </div>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor="upload-resi"
                                          className="w-fit"
                                        >
                                          {resiFile === null ? (
                                            <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>Upload</div>
                                            </div>
                                          ) : (
                                            <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                                              <span>
                                                <FaCloudUploadAlt />
                                              </span>
                                              <div>1 File</div>
                                            </div>
                                          )}
                                        </label>
                                        <input
                                          disabled={
                                            tipePengiriman.value === 1
                                              ? false
                                              : true
                                          }
                                          type="file"
                                          id="upload-resi"
                                          onChange={
                                            onChangeResiBuktiPengirimanFile
                                          }
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        />
                                      </div>
                                      {resiFileUpload.length > 0 && (
                                        <a
                                          href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${resiFileUpload}`}
                                          target="_blank"
                                          className="underline cursor-pointer text-blue-500"
                                          rel="noreferrer"
                                        >
                                          File terupload
                                        </a>
                                      )}
                                    </div>
                                    {isError && (
                                      <div className="mt-10 mb-3">
                                        <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                          <div>
                                            <PiWarningCircleLight />
                                          </div>
                                          <div>Data masih belum lengkap</div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </form>
                            <div className="flex max-[432px]:flex-col max-[432px]:gap-2 mt-24 mb-5 justify-between">
                              {screenSize > 431 ? (
                                <>
                                  {activeStep === steps.length - 1 ? (
                                    <button
                                      disabled={activeStep === 0}
                                      onClick={
                                        tipePenagihan.value === "beli putus"
                                          ? saveDraft
                                          : saveDraft2
                                      }
                                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                        activeStep === 0 && "cursor-not-allowed"
                                      } `}
                                    >
                                      Save as draft
                                    </button>
                                  ) : (
                                    <button
                                      disabled={activeStep === 0}
                                      onClick={handleBack}
                                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                        activeStep === 0 && "cursor-not-allowed"
                                      } `}
                                    >
                                      Back
                                    </button>
                                  )}

                                  <button
                                    onClick={
                                      tipePenagihan.value === "beli putus"
                                        ? handleNext
                                        : handleNext2
                                    }
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                  >
                                    {activeStep === steps.length - 1
                                      ? "Submit"
                                      : "Next"}
                                  </button>
                                </>
                              ) : (
                                <>
                                  {activeStep === steps.length - 1 ? (
                                    <button
                                      disabled={activeStep === 0}
                                      onClick={
                                        tipePenagihan.value === "beli putus"
                                          ? saveDraft
                                          : saveDraft2
                                      }
                                      className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                        activeStep === 0 && "cursor-not-allowed"
                                      } `}
                                    >
                                      Save as draft
                                    </button>
                                  ) : (
                                    <button
                                      disabled={activeStep === 0}
                                      onClick={handleBack}
                                      className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                        activeStep === 0 && "cursor-not-allowed"
                                      } `}
                                    >
                                      Back
                                    </button>
                                  )}

                                  <button
                                    onClick={
                                      tipePenagihan.value === "beli putus"
                                        ? handleNext
                                        : handleNext2
                                    }
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                  >
                                    {activeStep === steps.length - 1
                                      ? "Finish"
                                      : "Next"}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length && (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </>
            )}
          </div>
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
    </>
  );
};

export default Penagihan;
