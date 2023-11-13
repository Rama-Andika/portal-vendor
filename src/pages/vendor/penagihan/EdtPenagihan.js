import { BsBuildings } from "react-icons/bs";
import { useStateContext } from "../../../contexts/ContextProvider";
import Admin from "../../../layouts/Admin";
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
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { PiWarningCircleLight } from "react-icons/pi";
import isEmpty from "../../../components/functions/CheckEmptyObject";
import Api from "../../../api";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import titleCase from "../../../components/functions/TitleCase";

const optionsTipePenagihan = [
  { value: "beli_putus", label: "Beli Putus", key: 0 },
  { value: "konsinyasi", label: "Konsinyasi", key: 1 },
];
const optionsDeliveryArea = [
  { value: "tangerang", label: "Tangerang", key: 0 },
  { value: "jakarta", label: "Jakarta", key: 1 },
  { value: "bali", label: "Bali", key: 2 },
  { value: "makassar", label: "Makassar", key: 3 },
];
const options = [
  { value: 0, label: "Ya", key: 0 },
  { value: 1, label: "Tidak", key: 1 },
];
const optionsTipePengiriman = [
  { value: 0, label: "Drop Box Gudang PT KPU", key: 0 },
  { value: 1, label: "Kurir", key: 1 },
  { value: 2, label: "Diantar langsung ke office PT KPU", key: 2 },
];
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
  const [invoiceTambahan, setInvoiceTambahan] = useState([{ type: "file" }]);
  const [fakturPajakTambahan, setFakturPajakTambahan] = useState([
    { type: "file" },
  ]);
  const [tipePengiriman, setTipePengiriman] = useState({
    value: 0,
    label: "Drop Box Gudang PT KPU",
    key: 0,
  });

  const [isPajak, setIsPajak] = useState({ value: 0, label: "Ya", key: 0 });
  const [nomerSeriFakturPajak, setNomerSeriFakturPajak] = useState(
    inputNoSeriFakturPajak
  );
  const [purchaseOrderFile, setPurchaseOrderFile] = useState(null);
  const [deliveryOrderFile, setDeliveryOrderFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [kwitansiFile, setKwitansiFile] = useState(null);
  const [fakturPajakFile, setFakturPajakFile] = useState(null);
  const [receivingNoteFile, setReceivingNoteFile] = useState(null);
  const [resiFile, setResiFile] = useState(null);
  const [scanReportSalesFile, setScanReportSalesFile] = useState(null);
  const [createdAt,setCreatedAt] = useState()
  // eslint-disable-next-line no-unused-vars
  const [updatedAt,setUpdatedAt] = useState()

  const [isError, setIsError] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(0);
  const [nomerRequest, setNomerRequest] = useState("");
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [vendorId, setVendorId] = useState()

  const param = useParams();
  const [vendors, setVendors] = useState({})
  const location = useLocation();
  

  const fetchvendor = async () =>{
    await Api.get(`/vendors/${location.state.vendor_id}`).then((response)=>{
      setVendors(response.data)
    })
  }

  const fetchData = async () =>{
    setOpenBackdrop(true)
    await Api.get( `/penagihan/${param.id}`).then((response) => {
      setTipePenagihan({value: response.data.tipe_penagihan, label: titleCase(response.data.tipe_penagihan)})
      setNomerPo(response.data.nomer_po.split("PO")[1])
      setTanggalPo(dayjs(tanggalPo))
      setNomerDo(response.data.nomer_do)
      setDeliveryArea({value: response.data.delivery_area, label: titleCase(response.data.delivery_area)})
      const listInvoice = response.data.nomer_invoices.map((invoice)=>{
        return {type: "text", value: invoice, id: 0}
      })
      const listTanggalInvoice = response.data.tanggal_invoices.map((tanggal)=>{
        return {value: dayjs(tanggal)}
      })
      const listNilaiInvoice = response.data.nilai_invoices.map((nilai)=>{
        return {value: nilai.toString()}
      })
        // eslint-disable-next-line array-callback-return
        var listSeriPajak = response.data.nomer_seri_pajak.map((nomer)=>{
          if(nomer !== null){
            return {type: "text", value: nomer}
          }else{
            return {type: "text", value: ""}
          }
          
        })
      

      console.log(listSeriPajak)

      setNomerInvoice(listInvoice)
      setTanggalInvoice(listTanggalInvoice)
      setTanggalInvoice2(listTanggalInvoice)
      setNilaiInvoice(listNilaiInvoice)
      setNomerSeriFakturPajak(listSeriPajak)
      setIsPajak({value: response.data.is_pajak, label: response.data.is_pajak === 0 ? "Ya" : "Tidak"})
      if(response.data.start_date_periode !== null){
        setStartDatePeriode(dayjs(response.data.start_date_periode))
      }
      if(response.data.end_date_periode !== null){
        setEndDatePeriode(dayjs(response.data.end_date_periode))
      }
      setNomerRequest(response.data.no_request)
      setVendorId(response.data.vendor_id)
      setCreatedAt(response.data.created_at)
      setUpdatedAt(response.data.updated_at)
      setOpenBackdrop(false)
    })
  }

  const handleNext = () => {
    let countNomerInvoice = 0;
    let countTanggalInvoice = 0;
    let countNilaiInvoice = 0;

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
      if (nilai.value.trim().length > 0) {
        countNilaiInvoice += 1;
      }
    });

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
        if (isPajak.value === 1) {
          setIsError(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          if (nomerSeriFakturPajak[0].value.trim().length === 19) {
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
      if (
        purchaseOrderFile !== null &&
        deliveryOrderFile !== null &&
        invoiceFile !== null &&
        kwitansiFile !== null &&
        fakturPajakFile !== null &&
        receivingNoteFile !== null
      ) {
        if (tipePengiriman.value === 1) {
          if (resiFile !== null) {
            setIsError(false);
            onSubmitButton();
          } else {
            return setIsError(true);
          }
        } else {
          setIsError(false);
          onSubmitButton();
        }
      } else {
        setIsError(true);
      }
    }
  };

  const handleNext2 = () => {
    console.log("2")
    let countNomerInvoice = 0;
    let countTanggalInvoice = 0;
    let countNilaiInvoice = 0;

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
      if (nilai.value.trim().length > 0) {
        countNilaiInvoice += 1;
      }
    });

    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      console.log(nomerPo.trim().length === 8)
      if (
        
        nomerPo.trim().length === 8 &&
        tanggalPo !== undefined &&
        countNomerInvoice === nomerInvoice.length &&
        countTanggalInvoice === nomerInvoice.length &&
        countNilaiInvoice === nomerInvoice.length &&
        startDatePeriode !== undefined &&
        endDatePeriode !== undefined
      ) {
        console.log("correct")
        if (isPajak.value === 1) {
          setIsError(false);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          if (nomerSeriFakturPajak[0].value.trim().length === 19) {
            setIsError(false);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            return setIsError(true);
          }
        }
      } else {
        console.log("incorrect")
        setIsError(true);
      }
    } else if (activeStep === 2) {
      if (
        purchaseOrderFile !== null &&
        deliveryOrderFile !== null &&
        invoiceFile !== null &&
        kwitansiFile !== null &&
        fakturPajakFile !== null &&
        scanReportSalesFile !== null
      ) {

        if (tipePengiriman.value === 1) {
          if (resiFile !== null) {
            setIsError(false);
            onSubmitButton2();
          } else {
            return setIsError(true);
          }
        } else {
          setIsError(false);
          onSubmitButton2();
        }
      } else {
  
        setIsError(true);
      }
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
    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchvendor()

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
      newArr[index].value = e.target.validity.valid ? e.target.value : "";

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

  const onChangeInvoiceTambahan = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setInvoiceTambahan((s) => {
      const newArr = s.slice();
      newArr[index] = e.target.files[0];

      return newArr;
    });
  };

  const onChangeFakturPajakTambahan = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setFakturPajakTambahan((s) => {
      const newArr = s.slice();
      newArr[index] = e.target.files[0];

      return newArr;
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
    }
  };

  const addInvoiceTambahan = () => {
    if (invoiceTambahan.length < 5) {
      setInvoiceTambahan((s) => {
        return [...s, { type: "file" }];
      });
    }
  };

  const addFakturPajakFile = () => {
    if (fakturPajakTambahan.length < 5) {
      setFakturPajakTambahan((s) => {
        return [...s, { type: "file" }];
      });
    }
  };

  const formatFakturPajak = (value, i) => {
    try {
      var cleaned = ("" + value).replace(/\D/g, "");
      var match = cleaned.match(/(\d{0,3})?(\d{0,3})?(\d{0,2})?(\d{0,8})$/);

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
        setPurchaseOrderFile(e.target.files[0]);
      } else {
        setPurchaseOrderFile(null);
      }
    }
  };

  const onChangeDeliveryOrderFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setDeliveryOrderFile(e.target.files[0]);
      } else {
        setDeliveryOrderFile(null);
      }
    }
  };

  const onChangeInvoiceFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setInvoiceFile(e.target.files[0]);
      } else {
        setInvoiceFile(null);
      }
    }
  };

  const onChangeKwitansiFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setKwitansiFile(e.target.files[0]);
      } else {
        setKwitansiFile(null);
      }
    }
  };

  const onChangeFakturPajakFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setFakturPajakFile(e.target.files[0]);
      } else {
        setFakturPajakFile(null);
      }
    }
  };

  const onChangeScanReportSalesFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setScanReportSalesFile(e.target.files[0]);
      } else {
        setScanReportSalesFile(null);
      }
    }
  };

  const onChangeReceivingNoteFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setReceivingNoteFile(e.target.files[0]);
      } else {
        setReceivingNoteFile(null);
      }
    }
  };

  const onChangeResiBuktiPengirimanFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setResiFile(e.target.files[0]);
      } else {
        setResiFile(null);
      }
    }
  };

  const saveDraft = async () => {
    setOpenBackdrop(true);
    let isSave = false;
    if (
      purchaseOrderFile !== null &&
      deliveryOrderFile !== null &&
      invoiceFile !== null &&
      kwitansiFile !== null &&
      fakturPajakFile !== null &&
      receivingNoteFile !== null
    ) {
      if (tipePengiriman.value === 1) {
        if (resiFile !== null) {
          setIsError(false);
          isSave = true;
        } else {
          setIsError(true);
          isSave = false;
        }
      } else {
        setIsError(false);
        isSave = true;
      }
    } else {
      setIsError(true);
      isSave = false;
    }

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
      if (nilai.value.trim().length > 0) {
        return parseFloat(nilai.value);
      }
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer)=>{
      if(nomer.value.trim().length === 19 && nomer.value.trim().length > 0){
        return nomer.value
      }
    })

    if (isSave) {
      

      const inititalValue = {
        vendor: vendors,
        no_request: nomerRequest,
        tipe_penagihan: tipePenagihan.value,
        tipe_pengiriman: tipePengiriman.value,
        nomer_po: "PO" + nomerPo,
        tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD"),
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
        updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        status: "DRAFT",
      };

      await Api.put(`/penagihan/${param.id}`, inititalValue, {
        Headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          setId(response.data.id);
          setOpenBackdrop(false);
          toast.success("Penagihan update success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        })
        .catch(() => {
          setId(0);
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
  };

  const saveDraft2 = async () => {
    setOpenBackdrop(true);
    let isSave = false;
    if (
      purchaseOrderFile !== null &&
      deliveryOrderFile !== null &&
      invoiceFile !== null &&
      kwitansiFile !== null &&
      fakturPajakFile !== null &&
      scanReportSalesFile !== null
    ) {
      if (tipePengiriman.value === 1) {
        if (resiFile !== null) {
          setIsError(false);
          isSave = true;
        } else {
          setIsError(true);
          isSave = false;
        }
      } else {
        setIsError(false);
        isSave = true;
      }
    } else {
      setIsError(true);
      isSave = false;
    }

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
      if (nilai.value.trim().length > 0) {
        return parseFloat(nilai.value);
      }
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer)=>{
      if(nomer.value.trim().length === 19 && nomer.value.trim().length > 0){
        return nomer.value
      }
    })

    if (isSave) {

      const inititalValue = {
        vendor: vendors,
        no_request: nomerRequest,
        tipe_penagihan: tipePenagihan.value,
        tipe_pengiriman: tipePengiriman.value,
        nomer_po: "PO" + nomerPo,
        tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD"),
        nomer_do: "",
        delivery_area: deliveryArea.value,
        nomer_invoices: invoiceList,
        tanggal_invoices: tanggalList,
        nilai_invoices: nilaiInvoiceList,
        start_date_periode: dayjs(startDatePeriode).format("YYYY-MM-DD"),
        end_date_periode: dayjs(endDatePeriode).format("YYYY-MM-DD"),
        is_pajak: isPajak.value,
        nomer_seri_pajak: nomerSeriFakturPajakList,
        created_at: createdAt,
        updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        status: "DRAFT",
      };

      await Api.put(`/penagihan/${param.id}`, inititalValue, {
        Headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          setId(response.data.id);
          setOpenBackdrop(false);
          toast.success("Penagihan update success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        })
        .catch(() => {
          setId(0);
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
      if (nilai.value.trim().length > 0) {
        return parseFloat(nilai.value);
      }
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer)=>{
      if(nomer.value.trim().length === 19 && nomer.value.trim().length > 0){
        return nomer.value
      }
    })

      const inititalValue = {
        vendor: vendors,
        no_request: nomerRequest,
        tipe_penagihan: tipePenagihan.value,
        tipe_pengiriman: tipePengiriman.value,
        nomer_po: "PO" + nomerPo,
        tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD"),
        nomer_do: "DO" + nomerDo,
        delivery_area: deliveryArea.value,
        nomer_invoices: invoiceList,
        tanggal_invoices: tanggalList,
        nilai_invoices: nilaiInvoiceList,
        start_date_periode: null,
        end_date_periode: null,
        is_pajak: isPajak.value,
        nomer_seri_pajak: nomerSeriFakturPajakList,
        created_at: createdAt,
        updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        status: "waiting_for_approval",
      };

      await Api.put(`/penagihan/${param.id}`, inititalValue, {
        Headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          setId(response.data.id);
          setOpenBackdrop(false);
          toast.success("Penagihan update success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          navigate("/vendor/monitoring");
        })
        .catch(() => {
          setId(0);
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
      if (nilai.value.trim().length > 0) {
        return parseFloat(nilai.value);
      }
    });

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer)=>{
      if(nomer.value.trim().length === 19 && nomer.value.trim().length > 0){
        return nomer.value
      }
    })

    const inititalValue = {
      vendor: vendors,
      no_request: nomerRequest,
      tipe_penagihan: tipePenagihan.value,
      tipe_pengiriman: tipePengiriman.value,
      nomer_po: "PO" + nomerPo,
      tanggal_po: dayjs(tanggalPo).format("YYYY-MM-DD"),
      nomer_do: "",
      delivery_area: deliveryArea.value,
      nomer_invoices: invoiceList,
      tanggal_invoices: tanggalList,
      nilai_invoices: nilaiInvoiceList,
      start_date_periode: dayjs(startDatePeriode).format("YYYY-MM-DD"),
      end_date_periode: dayjs(endDatePeriode).format("YYYY-MM-DD"),
      is_pajak: isPajak.value,
      nomer_seri_pajak: nomerSeriFakturPajakList,
      created_at: createdAt,
      updated_at: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      status: "waiting_for_approval",
    };

    await Api.put(`/penagihan/${param.id}`, inititalValue, {
      Headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        setId(response.data.id);
        setOpenBackdrop(false);
        toast.success("Penagihan update success!", {
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        navigate("/vendor/monitoring");
      })
      .catch(() => {
        setId(0);
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
  };

  const steps = ["Tipe Penagihan", "Billing", "Dokumen"];
  return (
    <Admin>
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
                            <div className="w-[250px]">
                              No Purchase Order (PO)
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
                                  maxLength={20}
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerDo}
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
                                      maxLength={20}
                                      type="text"
                                      name=""
                                      id={i}
                                      value={item.value}
                                      onChange={onChangeInvoice}
                                      className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
                            ))}
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
                                    <div>*)</div>
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
                                        type="number"
                                        min={0}
                                        max={999999999999}
                                        step={0.01}
                                        onKeyDown={(evt) =>
                                          (evt.key === "e" ||
                                            evt.key === "-") &&
                                          evt.preventDefault()
                                        }
                                        value={nilaiInvoice[i].value}
                                        onChange={onChangeNilaiInvoice}
                                        className="max-[821px]:w-[208px] w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                      />
                                    </div>
                                    <div>*)</div>
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
                            <div className="w-[250px]">
                              No seri faktur pajak
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
                                      maxLength={19}
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
                            <div className="w-[250px]">
                              No Purchase Order (PO)
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
                                        maxLength={20}
                                        type="text"
                                        name=""
                                        id={i}
                                        value={item.value}
                                        onChange={onChangeInvoice}
                                        className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                      />
                                    </div>
                                    <div>*)</div>
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
                                    <div>*)</div>
                                  </div>
                                </div>
                              </div>
                            ))}
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
                                      type="number"
                                      min={0}
                                      max={999999999999}
                                      step={0.01}
                                      onKeyDown={(evt) =>
                                        (evt.key === "e" || evt.key === "-") &&
                                        evt.preventDefault()
                                      }
                                      value={nilaiInvoice[i].value}
                                      onChange={onChangeNilaiInvoice}
                                      className="max-[821px]:w-[208px] w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                    />
                                  </div>
                                  <div>*)</div>
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
                            <div className="w-[250px]">
                              No seri faktur pajak
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
                                      maxLength={19}
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
                              <div className="w-[350px]">Purchase Order</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-purchaseorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">
                                Delivery Order (DO) / Packing List (Surat Jalan)
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-deliveryorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">
                                Invoice (Faktur Penagihan)
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-invoice" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="mb-10">
                              {invoiceTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    {i === 0 ? (
                                      <div className="w-[350px]">
                                        Invoice Tambahan
                                      </div>
                                    ) : (
                                      <div className="w-[350px]">
                                        Invoice Tambahan {i + 1}
                                      </div>
                                    )}

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                      <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeInvoiceTambahan}
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addInvoiceTambahan}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceTambahan.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="flex flex-col gap-1 w-[350px]">
                                <div className="">Kwitansi</div>
                                <div className="text-[10px] text-gray-500">
                                  total penagihan diatas 5 juta diwajibkan
                                  bermaterai
                                </div>
                              </div>

                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-kwitansi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">Faktur Pajak</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-fakturpajak" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="mb-10">
                              {fakturPajakTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    {i === 0 ? (
                                      <div className="w-[350px]">
                                        Faktur Pajak Tambahan
                                      </div>
                                    ) : (
                                      <div className="w-[350px]">
                                        Faktur Pajak Tambahan {i + 1}
                                      </div>
                                    )}

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                      <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeFakturPajakTambahan}
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addFakturPajakFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  fakturPajakTambahan.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-20">
                              <div className="w-[350px]">Receiving Note</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-receivingnote" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                                  <label htmlFor="upload-resi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                                  <div>*)</div>
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
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">Purchase Order</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-purchaseorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">
                                Delivery Order (DO) / Packing List (Surat Jalan)
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-deliveryorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">
                                Invoice (Faktur Penagihan)
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-invoice" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="mb-10">
                              {invoiceTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    {i === 0 ? (
                                      <div className="w-[350px]">
                                        Invoice Tambahan
                                      </div>
                                    ) : (
                                      <div className="w-[350px]">
                                        Invoice Tambahan {i + 1}
                                      </div>
                                    )}

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                      <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeInvoiceTambahan}
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addInvoiceTambahan}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceTambahan.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="flex flex-col gap-1 w-[350px] ">
                                <div>Kwitansi</div>
                                <div className="text-[10px] text-gray-500">
                                  total penagihan diatas 5 juta diwajibkan
                                  bermaterai
                                </div>
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-kwitansi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">Faktur Pajak</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-fakturpajak" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                            </div>
                            <div className="mb-10">
                              {fakturPajakTambahan.map((item, i) => (
                                <div key={i}>
                                  <div className="flex items-center gap-3 mb-3">
                                    {i === 0 ? (
                                      <div className="w-[350px]">
                                        Faktur Pajak Tambahan
                                      </div>
                                    ) : (
                                      <div className="w-[350px]">
                                        Faktur Pajak Tambahan {i + 1}
                                      </div>
                                    )}

                                    <div>:</div>
                                    <div className="flex items-center gap-1">
                                      <div>
                                      <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeFakturPajakTambahan}
                                          accept=".jpg,.pdf"
                                          className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addFakturPajakFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  fakturPajakTambahan.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-20">
                              <div className="w-[350px]">Scan Report Sales</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                <label htmlFor="upload-scanreportsales" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                                  <label htmlFor="upload-resi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                                  <div>*)</div>
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
                        tipePenagihan.value === "beli putus" ? saveDraft : saveDraft2
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
                        tipePenagihan.value === "beli putus" ? handleNext : handleNext2
                      }
                      className={`bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]`}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={
                        tipePenagihan.value === "beli putus" ? handleNext : handleNext2
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
                                <label htmlFor="">Penagihan</label>
                              </div>
                              <div>
                                <Select
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
                                  <div className="flex">
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
                                        maxLength={20}
                                        type="text"
                                        name=""
                                        id=""
                                        value={nomerDo}
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
                                          No Invoice {i + 1} *)
                                        </div>
                                      )}
                                      <div className="fw-full">
                                        <div>
                                          <input
                                            maxLength={20}
                                            type="text"
                                            name=""
                                            id={i}
                                            value={item.value}
                                            onChange={onChangeInvoice}
                                            className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
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
                                            Tanggal Invoice {i + 1} *)
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
                                            Nilai Invoice {i + 1} *)
                                          </div>
                                        )}
                                        <div className="fw-full">
                                          <div>
                                            <input
                                              id={i}
                                              type="number"
                                              min={0}
                                              max={999999999999}
                                              step={0.01}
                                              onKeyDown={(evt) =>
                                                (evt.key === "e" ||
                                                  evt.key === "-") &&
                                                evt.preventDefault()
                                              }
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
                                    <div className="w-[250px]">
                                      No seri faktur pajak :
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
                                                maxLength={19}
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
                                  <div className="flex">
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
                                            No Invoice {i + 1} *)
                                          </div>
                                        )}
                                        <div className="fw-full">
                                          <div>
                                            <input
                                              maxLength={20}
                                              type="text"
                                              name=""
                                              id={i}
                                              value={item.value}
                                              onChange={onChangeInvoice}
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
                                            Tanggal Invoice {i + 1} *)
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
                                          Nilai Invoice {i + 1} *)
                                        </div>
                                      )}
                                      <div className="fw-full">
                                        <div>
                                          <input
                                            id={i}
                                            type="number"
                                            min={0}
                                            max={999999999999}
                                            step={0.01}
                                            onKeyDown={(evt) =>
                                              (evt.key === "e" ||
                                                evt.key === "-") &&
                                              evt.preventDefault()
                                            }
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
                                    <div className="w-[250px]">
                                      No seri faktur pajak :
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
                                                maxLength={19}
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
                                    <div className="w-[350px]">
                                      Purchase Order *) :
                                    </div>

                                    <div>
                                    <label htmlFor="upload-purchaseorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-purchaseorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangePurchaseOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="">
                                      Delivery Order (DO) / Packing List (Surat
                                      Jalan) *) :
                                    </div>

                                    <div>
                                    <label htmlFor="upload-deliveryorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-deliveryorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeDeliveryOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="">
                                      Invoice (Faktur penagihan) *) :
                                    </div>

                                    <div>
                                    <label htmlFor="upload-invoice" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-invoice"
                                        onChange={onChangeInvoiceFile}
                                        accept=".jpg,.pdf"
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {invoiceTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div>Invoice Tambahan :</div>
                                          ) : (
                                            <div>
                                              Invoice Tambahan : {i + 1}
                                            </div>
                                          )}

                                          <div>
                                          <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeInvoiceTambahan}
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addInvoiceTambahan}
                                      className={` flex justify-end ${
                                        invoiceTambahan.length === 5
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      <div className="py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]">
                                        Add row
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-10">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[350px]">
                                        Kwitansi *)
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        total penagihan diatas 5 juta diwajibkan
                                        bermaterai
                                      </div>
                                    </div>

                                    <div className="w-full">
                                    <label htmlFor="upload-kwitansi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-kwitansi"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeKwitansiFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Faktur Pajak *)</div>

                                    <div>
                                    <label htmlFor="upload-fakturpajak" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-fakturpajak"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeFakturPajakFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {fakturPajakTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div>Faktur Pajak Tambahan</div>
                                          ) : (
                                            <div>
                                              Faktur Pajak Tambahan {i + 1}
                                            </div>
                                          )}

                                          <div>
                                          <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={
                                                onChangeFakturPajakTambahan
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addFakturPajakFile}
                                      className={` flex justify-end ${
                                        invoiceTambahan.length === 5
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      <div className="py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]">
                                        Add row
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-20">
                                    <div>Receiving Note *) :</div>

                                    <div>
                                    <label htmlFor="upload-receivingnote" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-receivingnote"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeReceivingNoteFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
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
                                      <div>Resi Bukti Pengiriman *) :</div>

                                      <div>
                                      <label htmlFor="upload-resi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-blue-400 py-2 px-5 text-white hover:bg-blue-200 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
                                    <div>Purchase Order *) :</div>

                                    <div>
                                    <label htmlFor="upload-purchaseorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-purchaseorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangePurchaseOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>
                                      Delivery Order (DO) / Packing List (Surat
                                      Jalan) *) :
                                    </div>

                                    <div>
                                    <label htmlFor="upload-deliveryorder" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-deliveryorder"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeDeliveryOrderFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Invoice (Faktur Penagihan) *) :</div>

                                    <div>
                                    <label htmlFor="upload-invoice" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-invoice"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeInvoiceFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {invoiceTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div>Invoice Tambahan</div>
                                          ) : (
                                            <div>Invoice Tambahan {i + 1}</div>
                                          )}

                                          <div>
                                          <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeInvoiceTambahan}
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addInvoiceTambahan}
                                      className={`flex justify-end ${
                                        invoiceTambahan.length === 5
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      <div className="py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]">
                                        Add row
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-10">
                                    <div className="flex flex-col gap-1">
                                      <div className="w-[350px]">
                                        Kwitansi *)
                                      </div>
                                      <div className="text-[10px] text-gray-500">
                                        total penagihan diatas 5 juta diwajibkan
                                        bermaterai
                                      </div>
                                    </div>

                                    <div>
                                    <label htmlFor="upload-kwitansi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-kwitansi"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeKwitansiFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Faktur Pajak *) :</div>

                                    <div>
                                    <label htmlFor="upload-fakturpajak" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-fakturpajak"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeFakturPajakFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {fakturPajakTambahan.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan
                                            </div>
                                          ) : (
                                            <div className="w-[350px]">
                                              Faktur Pajak Tambahan {i + 1}
                                            </div>
                                          )}

                                          <div>
                                          <label htmlFor={i} className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={
                                                onChangeFakturPajakTambahan
                                              }
                                              accept=".jpg,.pdf"
                                              className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addFakturPajakFile}
                                      className={`flex justify-end ${
                                        fakturPajakTambahan.length === 5
                                          ? "cursor-not-allowed"
                                          : "cursor-pointer"
                                      } `}
                                    >
                                      <div className="py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496]">
                                        Add row
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-20">
                                    <div>Scan Report Sales *) :</div>

                                    <div>
                                    <label htmlFor="upload-scanreportsales" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
                    </label>
                                      <input
                                        type="file"
                                        id="upload-scanreportsales"
                                        accept=".jpg,.pdf"
                                        onChange={onChangeScanReportSalesFile}
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
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
                                      <div className="w-[350px]">
                                        Resi Bukti Pengiriman *) :
                                      </div>

                                      <div>
                                      <label htmlFor="upload-resi" className="w-fit">
                      <div className="w-fit flex gap-1 items-center bg-[#fff2cc] py-2 px-5 hover:bg-yellow-100 rounded-md">
                        <span><FaCloudUploadAlt /></span>
                        <div>Upload</div>
                      </div>
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
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999999999 }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Admin>
  );
};

export default Penagihan;
