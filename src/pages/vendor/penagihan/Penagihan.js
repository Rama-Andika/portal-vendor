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
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { PiWarningCircleLight } from "react-icons/pi";
import isEmpty from "../../../components/functions/CheckEmptyObject";
import Cookies from "js-cookie";
import { FaCloudUploadAlt } from "react-icons/fa";

import GetBase64 from "../../../components/functions/GetBase64";
import { Viewer } from "@react-pdf-viewer/core";
import titleCase from "../../../components/functions/TitleCase";
import { IoIosAdd } from "react-icons/io";
import TableInvoice from "./table/TableInvoice";
import { toast, Toaster } from "sonner";

const optionsTipePenagihan = [
  { value: "beli putus", label: "Beli Putus", key: 0 },
  { value: "konsinyasi", label: "Konsinyasi", key: 1 },
];
const optionsDeliveryArea = [
  { value: "tangerang", label: "Tangerang", key: 0 },
  { value: "jakarta", label: "Jakarta", key: 1 },
  { value: "bali", label: "Bali", key: 2 },
  { value: "makassar", label: "Makassar", key: 3 },
];
const options = [
  { value: 0, label: "Tidak", key: 0 },
  { value: 1, label: "Ya", key: 1 },
];
const optionsTipePengiriman = [
  { value: 0, label: "Drop Box Gudang", key: 0 },
  { value: 1, label: "Kurir", key: 1 },
  { value: 2, label: "Diantar langsung ke office", key: 2 },
];

const api = process.env.REACT_APP_BASEURL;

const Penagihan = () => {
  const inputNoSeriFakturPajak = [
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
  const [optionLokasi, setOptionLokasi] = useState([]);
  const [nomerPo, setNomerPo] = useState("");
  const [tanggalPo, setTanggalPo] = useState(undefined);
  const [nomerDo, setNomerDo] = useState("");
  const [deliveryArea, setDeliveryArea] = useState({
    value: "bali",
    label: "Bali",
  });

  const [addMode, setAddMode] = useState(true);
  const inputNomorInvoiceRef = useRef(null);
  const [invoice, setInvoice] = useState({
    nomorInvoice: "",
    tanggalInvoice: dayjs(new Date()).format("YYYY-MM-DD"),
    startDate: dayjs(new Date()).format("YYYY-MM-DD"),
    endDate: dayjs(new Date()).format("YYYY-MM-DD"),
    nilaiInvoice: "",
    lokasi: { value: "", label: "" },
    editMode: false,
  });
  const [invoices, setInvoices] = useState([]);
  const [invoiceTambahan, setInvoiceTambahan] = useState([]);
  const [fakturPajakTambahan, setFakturPajakTambahan] = useState([]);

  const [tipePengiriman, setTipePengiriman] = useState({
    value: 0,
    label: "Drop Box Gudang",
  });

  const [isPajak, setIsPajak] = useState({ value: 0, label: "Tidak", key: 0 });
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

  const [purchaseOrderPreviewFile, setPurchaseOrderPreviewFile] =
    useState(null);
  const [deliveryOrderPreviewFile, setDeliveryOrderPreviewFile] =
    useState(null);
  const [invoicePreviewFile, setInvoicePreviewFile] = useState(null);
  const [kwitansiPreviewFile, setKwitansiPreviewFile] = useState(null);
  const [fakturPajakPreviewFile, setFakturPajakPreviewFile] = useState(null);
  const [resiPreviewFile, setResiPreviewFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [createdAt, setCreatedAt] = useState();
  const [isError, setIsError] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [id, setId] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const vendorId = Cookies.get("vendor_id");
  const userId = Cookies.get("id");
  const [vendors, setVendors] = useState({});

  const fetchvendor = async () => {
    setOpenBackdrop(true);
    await fetch(`${api}api/portal-vendor/list/vendors`, {
      method: "POST",
      body: JSON.stringify({
        id: vendorId,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          setTipePenagihan({
            value: res.data[0].tipe_pembelian,
            label: titleCase(res.data[0].tipe_pembelian),
          });
          setVendors(res.data[0]);
        }
        setOpenBackdrop(false);
      })
      .then((err) => {
        setOpenBackdrop(false);
      });
  };

  const getLocation = useCallback(async () => {
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

        setOptionLokasi(options);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      if (invoices.length > 0) {
        setIsError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setIsError(true);
      }
    } else if (activeStep === 2) {
      if (invoiceFile !== null && kwitansiFile !== null) {
        if (vendors.status_pajak === "PKP") {
          if (fakturPajakFile !== null) {
            setIsError(false);
          } else {
            return setIsError(true);
          }
        } else {
          setIsError(false);
        }

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
    if (activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 1) {
      if (invoices.length > 0) {
        setIsError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setIsError(true);
      }
    } else if (activeStep === 2) {
      setIsError(false);

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
    fetchvendor();
    getLocation();

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

  const onChangeDeliveryArea = (item) => {
    setDeliveryArea(item);
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

  const onChangeTipePengiriman = (item) => {
    if (item.value !== 1) {
      setResiFile(null);
    }

    setTipePengiriman(item);
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
        setPurchaseOrderPreviewFile(URL.createObjectURL(e.target.files[0]));
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
        setDeliveryOrderPreviewFile(URL.createObjectURL(e.target.files[0]));
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
        setInvoicePreviewFile(URL.createObjectURL(e.target.files[0]));
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
        setKwitansiPreviewFile(URL.createObjectURL(e.target.files[0]));
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
        setFakturPajakPreviewFile(URL.createObjectURL(e.target.files[0]));
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

  const onChangeResiBuktiPengirimanFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        setResiPreviewFile(URL.createObjectURL(e.target.files[0]));
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

  const clearValue = useCallback(() => {
    setInvoice({
      ...invoice,
      nomorInvoice: "",
      tanggalInvoice: dayjs(new Date()).format("YYYY-MM-DD"),
      nilaiInvoice: "",
      lokasi: { value: "", label: "" },
    });
  }, [invoice]);

  const onClickAdd = useCallback(() => {
    setAddMode(true);
    clearValue();
    if (invoices.length > 0) {
      const newInvoices = invoices.map((invoice) => {
        invoice.editMode = false;
        return invoice;
      });
      if (newInvoices) {
        setInvoices(newInvoices);
      }
    }
  }, [invoices]);

  const onClickSave = useCallback(
    (index = undefined) => {
      const newInvoice = {
        nomorInvoice: invoice.nomorInvoice.trim(),
        tanggalInvoice: invoice.tanggalInvoice,
        startDate: invoice.startDate,
        endDate: invoice.endDate,
        nilaiInvoice: invoice.nilaiInvoice,
        lokasi: invoice.lokasi,
        editMode: false,
      };

      if (newInvoice.nomorInvoice.length === 0) {
        toast.error("Nomor invoice tidak boleh kosong");
        return;
      }

      if (tipePenagihan.label !== "Beli Putus") {
        if (newInvoice.lokasi.value.length === 0) {
          toast.error("Lokasi tidak boleh kosong");
          return;
        }
      }

      if (invoices.length === 0) {
        setInvoices([newInvoice]);
      } else {
        if (index !== undefined) {
          let isExists = false;

          if (tipePenagihan.label === "Beli Putus") {
            isExists = invoices
              .filter((_, i) => i !== index)
              .some((inv) => inv.nomorInvoice === invoice.nomorInvoice.trim());

            if (isExists) {
              toast.error("Nomor invoice sudah ada pada tabel");
              return;
            }
          } else {
            isExists = invoices
              .filter((_, i) => i !== index)
              .some(
                (inv) =>
                  inv.nomorInvoice === invoice.nomorInvoice.trim() ||
                  inv.lokasi.value === invoice.lokasi.value
              );

            if (isExists) {
              toast.error("Nomor invoice atau lokasi sudah ada pada tabel");
              return;
            }
          }

          setInvoices((prevInvoices) =>
            prevInvoices.map((invoice, i) =>
              i === index ? newInvoice : invoice
            )
          );
        } else {
          let isExists = false;

          if (tipePenagihan.label === "Beli Putus") {
            isExists = invoices.some(
              (inv) => inv.nomorInvoice === invoice.nomorInvoice.trim()
            );

            if (isExists) {
              toast.error("Nomor invoice sudah ada pada tabel");
              return;
            }
          } else {
            isExists = invoices.some(
              (inv) =>
                inv.nomorInvoice === invoice.nomorInvoice.trim() ||
                inv.lokasi.value === invoice.lokasi.value
            );

            if (isExists) {
              toast.error("Nomor invoice atau lokasi sudah ada pada tabel");
              return;
            }
          }
          setInvoices([...invoices, newInvoice]);
        }
      }

      if (inputNomorInvoiceRef.current) {
        inputNomorInvoiceRef.current.focus();
      }
      clearValue();
    },
    [invoice]
  );

  const onClickCancel = useCallback(() => {
    setAddMode(false);
    clearValue();

    if (invoices.length > 0) {
      const newInvoices = invoices.map((invoice) => {
        invoice.editMode = false;
        return invoice;
      });
      if (newInvoices) {
        setInvoices(newInvoices);
      }
    }
  }, [invoices]);

  const onClickDelete = useCallback(
    (index) => {
      const newInvoices = invoices.filter((_, i) => i !== index);
      setInvoices(newInvoices);
    },
    [invoices]
  );

  const onClickEdit = useCallback(
    (data, index) => {
      setAddMode(false);
      setInvoices((prevInvoices) =>
        prevInvoices.map((prev, i) =>
          i === index
            ? { ...prev, editMode: true }
            : { ...prev, editMode: false }
        )
      );
      setInvoice({
        nomorInvoice: data?.nomorInvoice,
        tanggalInvoice: data?.tanggalInvoice,
        startDate: data?.startDate,
        endDate: data?.endDate,
        nilaiInvoice: data?.nilaiInvoice,
        lokasi: data?.lokasi,
      });
    },
    [invoice]
  );

  const saveDraft = async () => {
    setOpenBackdrop(true);
    let isSave = false;

    if (invoiceFile !== null && kwitansiFile !== null) {
      if (vendors.status_pajak === "PKP") {
        if (fakturPajakFile !== null) {
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

      if (isSave) {
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
      }
    } else {
      setIsError(true);
      isSave = false;
    }

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 19 && nomer.value.trim().length > 0) {
        return nomer.value;
      }
    });

    const nomorInvoices = invoices.map((invoice) =>
      invoice.nomorInvoice.trim()
    );
    const tanggalInvoices = invoices.map((invoice) => invoice.tanggalInvoice);
    const nilaiInvoices = invoices.map((invoice) => invoice.nilaiInvoice);

    if (Cookies.get("token") !== undefined) {
      if (isSave) {
        if (id === 0) {
          const initialValue = {
            id: id,
            vendor_id: vendorId,
            tipe_penagihan: tipePenagihan.value,
            tipe_pengiriman: tipePengiriman.value,
            nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
            tanggal_po:
              tanggalPo !== undefined
                ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
                : null,
            nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
            delivery_area: deliveryArea.value,
            nomer_invoices: nomorInvoices,
            tanggal_invoices: tanggalInvoices,
            nilai_invoices: nilaiInvoices,
            is_pajak: isPajak.value,
            nomer_seri_pajak: nomerSeriFakturPajakList,
            start_date_periode: null,
            end_date_periode: null,
            created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
            do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
            invoice_file: invoiceFile !== null ? invoiceFile : null,
            kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
            faktur_pajak_file:
              fakturPajakFile !== null ? fakturPajakFile : null,
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
              if (res.data === "0") {
                setOpenBackdrop(false);
                toast.error("Penagihan gagal di buat");
              } else {
                setId(res.data);
                navigate("/vendor/monitoring");
                setOpenBackdrop(false);
                toast.success("Penagihan berhasil di buat");
              }
            })
            .catch((err) => {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di buat");
            });
        } else {
          const initialValue = {
            id: id,
            vendor_id: vendorId,
            tipe_penagihan: tipePenagihan.value,
            tipe_pengiriman: tipePengiriman.value,
            nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
            tanggal_po:
              tanggalPo !== undefined
                ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
                : null,
            nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
            delivery_area: deliveryArea.value,
            nomer_invoices: nomorInvoices,
            tanggal_invoices: tanggalInvoices,
            nilai_invoices: nilaiInvoices,
            is_pajak: isPajak.value,
            nomer_seri_pajak: nomerSeriFakturPajakList,
            start_date_periode: null,
            end_date_periode: null,
            created_at: createdAt,
            updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
            do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
            invoice_file: invoiceFile !== null ? invoiceFile : null,
            kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
            faktur_pajak_file:
              fakturPajakFile !== null ? fakturPajakFile : null,
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
              if (res.data === "0") {
                setOpenBackdrop(false);
                toast.error("Penagihan gagal di perbaharui");
              } else {
                setId(res.data);

                setOpenBackdrop(false);
                toast.success("Penagihan berhasil di perbaharui");
              }
            })
            .catch((err) => {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di perbaharui");
            });
        }
      } else {
        setOpenBackdrop(false);
      }
    } else {
      navigate("/");
    }
  };

  const saveDraft2 = async () => {
    setOpenBackdrop(true);
    let isSave = true;

    setIsError(false);

    if (isSave) {
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
    }

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 19) {
        return nomer.value;
      }
    });

    const nomorInvoices = invoices.map((invoice) =>
      invoice.nomorInvoice.trim()
    );
    const startDates = invoices.map(() => invoice.startDate);
    const endDates = invoices.map(() => invoice.endDate);
    const locationIds = invoices.map((invoice) => invoice.lokasi.value);
    const nilaiInvoices = invoices.map((invoice) => invoice.nilaiInvoice);

    const invoiceTambahanFilesNew = invoices.map((_, i) =>
      invoiceTambahan[i] === undefined ? null : invoiceTambahan[i].base64
    );
    const fakturPajakTambahanFilesNew = invoices.map((_, i) =>
      fakturPajakTambahan[i] === undefined
        ? null
        : fakturPajakTambahan[i].base64
    );

    if (Cookies.get("token")) {
      if (isSave) {
        if (id === 0) {
          const initialValue = {
            id: id,
            vendor_id: vendorId,
            tipe_penagihan: tipePenagihan.value,
            tipe_pengiriman: tipePengiriman.value,
            nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
            tanggal_po:
              tanggalPo !== undefined
                ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
                : null,
            nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
            delivery_area: deliveryArea.value,
            nomer_invoices: nomorInvoices,
            start_dates: startDates,
            end_dates: endDates,
            location_ids: locationIds,
            nilai_invoices: nilaiInvoices,
            is_pajak: isPajak.value,
            nomer_seri_pajak: nomerSeriFakturPajakList,
            start_date_periode: null,
            end_date_periode: null,
            created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
            do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
            invoice_file: invoiceFile !== null ? invoiceFile : null,
            invoice_tambahan_file: invoiceTambahanFilesNew,
            faktur_pajak_tambahan_file: fakturPajakTambahanFilesNew,
            kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
            faktur_pajak_file:
              fakturPajakFile !== null ? fakturPajakFile : null,
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
              if (res.data === "0") {
                setOpenBackdrop(false);
                toast.error("Penagihan gagal di buat");
              } else {
                setId(res.data);
                navigate("/vendor/monitoring");
                setOpenBackdrop(false);
                toast.success("Penagihan berhasil di buat");
              }
            })
            .catch((err) => {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di buat");
            });
        } else {
          const initialValue = {
            id: id,
            vendor_id: vendorId,
            tipe_penagihan: tipePenagihan.value,
            tipe_pengiriman: tipePengiriman.value,
            nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
            tanggal_po:
              tanggalPo !== undefined
                ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
                : null,
            nomer_do: nomerDo ? "DO" + nomerDo : "",
            delivery_area: deliveryArea.value,
            nomer_invoices: nomorInvoices,
            start_dates: startDates,
            end_dates: endDates,
            location_ids: locationIds,
            nilai_invoices: nilaiInvoices,
            is_pajak: isPajak.value,
            nomer_seri_pajak: nomerSeriFakturPajakList,
            start_date_periode: null,
            end_date_periode: null,
            created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
            do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
            invoice_tambahan_file: invoiceTambahanFilesNew,
            faktur_pajak_tambahan_file: fakturPajakTambahanFilesNew,
            invoice_file: invoiceFile !== null ? invoiceFile : null,
            kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
            faktur_pajak_file:
              fakturPajakFile !== null ? fakturPajakFile : null,
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
              if (res.data === "0") {
                setOpenBackdrop(false);
                toast.error("Penagihan gagal di perbaharui");
              } else {
                setId(res.data);

                setOpenBackdrop(false);
                toast.success("Penagihan berhasil di perbaharui");
              }
            })
            .catch((err) => {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di perbaharui");
            });
        }
      } else {
        setOpenBackdrop(false);
      }
    } else {
      navigate("/");
    }
  };

  const onSubmitButton = async () => {
    setOpenBackdrop(true);

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 19) {
        return nomer.value;
      }
    });

    const nomorInvoices = invoices.map((invoice) =>
      invoice.nomorInvoice.trim()
    );
    const tanggalInvoices = invoices.map((invoice) => invoice.tanggalInvoice);
    const nilaiInvoices = invoices.map((invoice) => invoice.nilaiInvoice);

    if (Cookies.get("token") !== undefined) {
      if (id !== 0) {
        const initialValue = {
          id: id,
          vendor_id: vendorId,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
          tanggal_po:
            tanggalPo !== undefined
              ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
              : null,
          nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
          delivery_area: deliveryArea.value,
          nomer_invoices: nomorInvoices,
          tanggal_invoices: tanggalInvoices,
          nilai_invoices: nilaiInvoices,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: null,
          end_date_periode: null,
          created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
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
            if (res.data === "0") {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di perbaharui");
            } else {
              setId(res.data);

              setOpenBackdrop(false);
              toast.success("Penagihan berhasil di perbaharui");
              navigate("/vendor/monitoring");
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan gagal di perbaharui");
          });
      } else {
        const initialValue = {
          id: id,
          vendor_id: vendorId,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
          tanggal_po:
            tanggalPo !== undefined
              ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
              : null,
          nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
          delivery_area: deliveryArea.value,
          nomer_invoices: nomorInvoices,
          tanggal_invoices: tanggalInvoices,
          nilai_invoices: nilaiInvoices,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: null,
          end_date_periode: null,
          created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
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
            if (res.data === "0") {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di buat");
            } else {
              setId(res.data.id);

              setOpenBackdrop(false);
              toast.success("Penagihan berhasil di buat");
              navigate("/vendor/monitoring");
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan gagal di buat");
          });
      }
    } else {
      navigate("/");
    }
  };

  const onSubmitButton2 = async () => {
    setOpenBackdrop(true);

    // eslint-disable-next-line array-callback-return
    const nomerSeriFakturPajakList = nomerSeriFakturPajak.map((nomer) => {
      if (nomer.value.trim().length === 19) {
        return nomer.value;
      }
    });

    const nomorInvoices = invoices.map((invoice) =>
      invoice.nomorInvoice.trim()
    );
    const startDates = invoices.map(() => invoice.startDate);
    const endDates = invoices.map(() => invoice.endDate);
    const locationIds = invoices.map((invoice) => invoice.lokasi.value);
    const nilaiInvoices = invoices.map((invoice) => invoice.nilaiInvoice);

    const invoiceTambahanFilesNew = invoices.map((_, i) =>
      invoiceTambahan[i] === undefined ? null : invoiceTambahan[i].base64
    );
    const fakturPajakTambahanFilesNew = invoices.map((_, i) =>
      fakturPajakTambahan[i] === undefined
        ? null
        : fakturPajakTambahan[i].base64
    );

    if (Cookies.get("token") !== undefined) {
      if (id !== 0) {
        const initialValue = {
          id: id,
          vendor_id: vendorId,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
          tanggal_po:
            tanggalPo !== undefined
              ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
              : null,
          nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
          delivery_area: deliveryArea.value,
          nomer_invoices: nomorInvoices,
          start_dates: startDates,
          end_dates: endDates,
          location_ids: locationIds,
          nilai_invoices: nilaiInvoices,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: null,
          end_date_periode: null,
          created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_tambahan_file: invoiceTambahanFilesNew,
          faktur_pajak_tambahan_file: fakturPajakTambahanFilesNew,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
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
            if (res.data === "0") {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di perbaharui");
            } else {
              setId(res.data.id);

              setOpenBackdrop(false);
              toast.success("Penagihan berhasil di perbaharui");
              navigate("/vendor/monitoring");
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan gagal di perbaharui");
          });
      } else {
        const initialValue = {
          id: id,
          vendor_id: vendorId,
          tipe_penagihan: tipePenagihan.value,
          tipe_pengiriman: tipePengiriman.value,
          nomer_po: nomerPo.length > 0 ? "PO" + nomerPo : "",
          tanggal_po:
            tanggalPo !== undefined
              ? dayjs(tanggalPo).format("YYYY-MM-DD HH:mm:ss")
              : null,
          nomer_do: nomerDo.length > 0 ? "DO" + nomerDo : "",
          delivery_area: deliveryArea.value,
          nomer_invoices: nomorInvoices,
          start_dates: startDates,
          end_dates: endDates,
          location_ids: locationIds,
          nilai_invoices: nilaiInvoices,
          is_pajak: isPajak.value,
          nomer_seri_pajak: nomerSeriFakturPajakList,
          start_date_periode: null,
          end_date_periode: null,
          created_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          updated_at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          po_file: purchaseOrderFile !== null ? purchaseOrderFile : null,
          do_file: deliveryOrderFile !== null ? deliveryOrderFile : null,
          invoice_tambahan_file: invoiceTambahanFilesNew,
          faktur_pajak_tambahan_file: fakturPajakTambahanFilesNew,
          invoice_file: invoiceFile !== null ? invoiceFile : null,
          kwitansi_file: kwitansiFile !== null ? kwitansiFile : null,
          faktur_pajak_file: fakturPajakFile !== null ? fakturPajakFile : null,
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
            if (res.data === "0") {
              setOpenBackdrop(false);
              toast.error("Penagihan gagal di buat");
            } else {
              setId(res.data.id);

              setOpenBackdrop(false);
              toast.success("Penagihan berhasil di buat");
              navigate("/vendor/monitoring");
            }
          })
          .catch((err) => {
            setOpenBackdrop(false);
            toast.error("Penagihan gagal di buat");
          });
      }
    } else {
      navigate("/");
    }
  };

  const steps = ["Tipe Penagihan", "Billing", "Dokumen"];

  return (
    <>
      <Toaster position="top-center" richColors />
      {!isEmpty(vendors) && vendors.status === "APPROVED" ? (
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
                                    className="last:max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] border-slate-300"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-[250px]">Tanggal PO</div>

                              <div className="flex items-center gap-1">
                                <div className="w-[21.1px]"></div>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="w-full bg-[#ddebf7]"
                                        format="MM/DD/YYYY"
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
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-[250px]">
                                No Delivery Order (DO)
                              </div>

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
                                    className="max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] border-slate-300"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-10">
                              <div className="w-[250px]">Delivery Area</div>

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
                              <div className="mb-2">Daftar Invoice</div>
                              <div className="overflow-auto max-h-[400px]">
                                <TableInvoice
                                  data={invoice}
                                  setData={setInvoice}
                                  inputNomorInvoiceRef={inputNomorInvoiceRef}
                                  addMode={addMode}
                                  invoices={invoices}
                                  vendorType={tipePenagihan.label}
                                  optionLokasi={optionLokasi}
                                  onClickSave={onClickSave}
                                  onClickCancel={onClickCancel}
                                  onClickEdit={onClickEdit}
                                  onClickDelete={onClickDelete}
                                />
                              </div>
                              {!addMode && (
                                <div
                                  className="bg-[#305496] rounded-full shadow-md w-fit mt-2 cursor-pointer"
                                  onClick={onClickAdd}
                                >
                                  <IoIosAdd className="text-white text-xl" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-10 mt-10">
                              <div className="w-[250px]">
                                Apakah barang termasuk pajak?
                              </div>

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
                                          isPajak.label === "Tidak"
                                            ? true
                                            : false
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
                              <div className="w-[250px]">Start Date</div>

                              <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                                <div className="w-[24px]"></div>
                                <div className="w-full ">
                                  <input
                                    type="date"
                                    className="border-gray-400 rounded-sm h-[38px] w-full bg-[#fff2cc]"
                                    value={invoice.startDate}
                                    onChange={(e) =>
                                      setInvoice({
                                        ...invoice,
                                        startDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-10">
                              <div className="w-[250px]">End Date</div>

                              <div className="flex items-center gap-1 max-[821px]:w-[249.56px] w-[287.96px]">
                                <div className="w-[24px]"></div>
                                <div className="w-full ">
                                  <input
                                    type="date"
                                    className="border-gray-400 rounded-sm h-[38px] w-full bg-[#fff2cc]"
                                    value={invoice.endDate}
                                    onChange={(e) =>
                                      setInvoice({
                                        ...invoice,
                                        endDate: e.target.value,
                                      })
                                    }
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
                              <div className="mb-2">Daftar Invoice</div>
                              <div className="overflow-auto max-h-[400px]">
                                <TableInvoice
                                  data={invoice}
                                  setData={setInvoice}
                                  inputNomorInvoiceRef={inputNomorInvoiceRef}
                                  addMode={addMode}
                                  invoices={invoices}
                                  vendorType={tipePenagihan.label}
                                  optionLokasi={optionLokasi}
                                  onClickSave={onClickSave}
                                  onClickCancel={onClickCancel}
                                  onClickEdit={onClickEdit}
                                  onClickDelete={onClickDelete}
                                />
                              </div>
                              {!addMode && (
                                <div
                                  className="bg-[#305496] rounded-full shadow-md w-fit mt-2 cursor-pointer"
                                  onClick={onClickAdd}
                                >
                                  <IoIosAdd className="text-white text-xl" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-10">
                              <div className="w-[250px]">
                                Apakah barang termasuk pajak?
                              </div>

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
                                          isPajak.label === "Tidak"
                                            ? true
                                            : false
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
                                  <div className="w-[350px]">
                                    Purchase Order
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    Max size 2 mb
                                  </div>
                                </div>

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
                                </div>
                              </div>
                              {purchaseOrderFile !== null &&
                              RegExp("\\bpdf\\b").test(
                                purchaseOrderFile.split(",")[0]
                              ) ? (
                                <div className="h-[500px] w-[500px] mb-5">
                                  <div className="h-full w-full">
                                    <Viewer
                                      fileUrl={purchaseOrderPreviewFile}
                                    />
                                  </div>
                                </div>
                              ) : (
                                purchaseOrderFile !== null && (
                                  <div className="h-[500px] w-[400px] mb-5">
                                    <div className="h-full w-full">
                                      <img
                                        src={purchaseOrderFile}
                                        alt="no"
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}

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
                                </div>
                              </div>
                              {deliveryOrderFile !== null &&
                              RegExp("\\bpdf\\b").test(
                                deliveryOrderFile.split(",")[0]
                              ) ? (
                                <div className="h-[500px] w-[500px] mb-5">
                                  <div className="h-full w-full">
                                    <Viewer
                                      fileUrl={deliveryOrderPreviewFile}
                                    />
                                  </div>
                                </div>
                              ) : (
                                deliveryOrderFile !== null && (
                                  <div className="h-[500px] w-[400px] mb-5">
                                    <div className="h-full w-full">
                                      <img
                                        src={deliveryOrderPreviewFile}
                                        alt="no"
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex flex-col gap-1">
                                  <div className="w-[350px]">
                                    Invoice (Faktur Penagihan)
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    Max size 2 mb
                                  </div>
                                </div>

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
                              </div>
                              {invoiceFile !== null &&
                              RegExp("\\bpdf\\b").test(
                                invoiceFile.split(",")[0]
                              ) ? (
                                <div className="h-[500px] w-[500px] mb-5">
                                  <div className="h-full w-full">
                                    <Viewer fileUrl={invoicePreviewFile} />
                                  </div>
                                </div>
                              ) : (
                                invoiceFile !== null && (
                                  <div className="h-[500px] w-[400px] mb-5">
                                    <div className="h-full w-full">
                                      <img
                                        src={invoicePreviewFile}
                                        alt="no"
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}
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
                              </div>
                              {kwitansiFile !== null &&
                              RegExp("\\bpdf\\b").test(
                                kwitansiFile.split(",")[0]
                              ) ? (
                                <div className="h-[500px] w-[500px] mb-5">
                                  <div className="h-full w-full">
                                    <Viewer fileUrl={kwitansiPreviewFile} />
                                  </div>
                                </div>
                              ) : (
                                kwitansiFile !== null && (
                                  <div className="h-[500px] w-[400px] mb-5">
                                    <div className="h-full w-full">
                                      <img
                                        src={kwitansiPreviewFile}
                                        alt="no"
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                              {vendors.status_pajak === "PKP" && (
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
                                  </div>
                                  {fakturPajakFile !== null &&
                                  RegExp("\\bpdf\\b").test(
                                    fakturPajakFile.split(",")[0]
                                  ) ? (
                                    <div className="h-[500px] w-[500px] mb-5">
                                      <div className="h-full w-full">
                                        <Viewer
                                          fileUrl={fakturPajakPreviewFile}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    fakturPajakFile !== null && (
                                      <div className="h-[500px] w-[400px] mb-5">
                                        <div className="h-full w-full">
                                          <img
                                            src={fakturPajakPreviewFile}
                                            alt="no"
                                            className="w-full h-full"
                                          />
                                        </div>
                                      </div>
                                    )
                                  )}
                                </>
                              )}

                              <div>
                                <div className="italic">
                                  Dokumen asli (hardcopy) sudah :
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-[350px]">
                                    Tipe Pengiriman
                                  </div>

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
                                        onChange={
                                          onChangeResiBuktiPengirimanFile
                                        }
                                        id="upload-resi"
                                        accept=".jpg,.pdf"
                                        className="hidden w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                      />
                                    </div>
                                    {tipePengiriman.value === 1 && (
                                      <div>*)</div>
                                    )}
                                  </div>
                                </div>
                                {resiFile !== null &&
                                RegExp("\\bpdf\\b").test(
                                  resiFile.split(",")[0]
                                ) ? (
                                  <div className="h-[500px] w-[500px] mb-5">
                                    <div className="h-full w-full">
                                      <Viewer fileUrl={resiPreviewFile} />
                                    </div>
                                  </div>
                                ) : (
                                  resiFile !== null && (
                                    <div className="h-[500px] w-[400px] mb-5">
                                      <div className="h-full w-full">
                                        <img
                                          src={resiPreviewFile}
                                          alt="no"
                                          className="w-full h-full"
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                                {/* <div
                                  id="btn-upload"
                                  onClick={uploadFile}
                                  className="py-2 px-5 bg-blue-400 cursor-pointer"
                                >
                                  Upload file
                                </div> */}
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
                              <div className="overflow-auto max-h-[400px] mb-10">
                                <TableInvoice
                                  data={invoice}
                                  setData={setInvoice}
                                  inputNomorInvoiceRef={inputNomorInvoiceRef}
                                  addMode={addMode}
                                  invoices={invoices}
                                  invoiceFiles={invoiceTambahan}
                                  setInvoiceFiles={setInvoiceTambahan}
                                  pajakFiles={fakturPajakTambahan}
                                  setPajakFiles={setFakturPajakTambahan}
                                  vendorType={tipePenagihan.label}
                                  optionLokasi={optionLokasi}
                                  onClickSave={onClickSave}
                                  onClickCancel={onClickCancel}
                                  onClickEdit={onClickEdit}
                                  onClickDelete={onClickDelete}
                                  activeStep={activeStep}
                                />
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
                                </div>
                              </div>
                              {kwitansiFile !== null &&
                              RegExp("\\bpdf\\b").test(
                                kwitansiFile.split(",")[0]
                              ) ? (
                                <div className="h-[500px] w-[500px] mb-5">
                                  <div className="h-full w-full">
                                    <Viewer fileUrl={kwitansiPreviewFile} />
                                  </div>
                                </div>
                              ) : (
                                kwitansiFile !== null && (
                                  <div className="h-[500px] w-[400px] mb-5">
                                    <div className="h-full w-full">
                                      <img
                                        src={kwitansiPreviewFile}
                                        alt="no"
                                        className="w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}

                              <div>
                                <div className="italic">
                                  Dokumen asli (hardcopy) sudah di kirimkan ke
                                  PT My Company :
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-[350px]">
                                    Tipe Pengiriman
                                  </div>

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
                                    {tipePengiriman.value === 1 && (
                                      <div>*)</div>
                                    )}
                                  </div>
                                </div>
                                {resiFile !== null &&
                                RegExp("\\bpdf\\b").test(
                                  resiFile.split(",")[0]
                                ) ? (
                                  <div className="h-[500px] w-[500px] mb-5">
                                    <div className="h-full w-full">
                                      <Viewer fileUrl={resiPreviewFile} />
                                    </div>
                                  </div>
                                ) : (
                                  resiFile !== null && (
                                    <div className="h-[500px] w-[400px] mb-5">
                                      <div className="h-full w-full">
                                        <img
                                          src={resiPreviewFile}
                                          alt="no"
                                          className="w-full h-full"
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
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
                    <button
                      onClick={handleBack}
                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                        activeStep === 0 ? "hidden" : "block"
                      } `}
                    >
                      Back
                    </button>

                    {activeStep === steps.length - 1 ? (
                      <div className="flex items-center gap-2">
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
                      </div>
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
                                          className="w-full h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] border-slate-300"
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
                                          className="max-[821px]:w-full w-[246.4px] h-[40px] rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] border-slate-300"
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
                                    <div className="mb-2">Daftar Invoice</div>
                                    <div className="overflow-auto max-h-[400px]">
                                      <TableInvoice
                                        data={invoice}
                                        setData={setInvoice}
                                        inputNomorInvoiceRef={
                                          inputNomorInvoiceRef
                                        }
                                        addMode={addMode}
                                        invoices={invoices}
                                        vendorType={tipePenagihan.label}
                                        optionLokasi={optionLokasi}
                                        onClickSave={onClickSave}
                                        onClickCancel={onClickCancel}
                                        onClickEdit={onClickEdit}
                                        onClickDelete={onClickDelete}
                                      />
                                    </div>
                                    {!addMode && (
                                      <div
                                        className="bg-[#305496] rounded-full shadow-md w-fit mt-2 cursor-pointer"
                                        onClick={onClickAdd}
                                      >
                                        <IoIosAdd className="text-white text-xl" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="mb-10"></div>
                                  <div className="flex flex-col gap-2 mb-3">
                                    <div>
                                      Apakah barang termasuk pajak? *) :{" "}
                                    </div>

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
                                        Start Date{" "}
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
                                        <input
                                          type="date"
                                          className="border-gray-400 rounded-sm h-[38px] w-full bg-[#fff2cc]"
                                          value={invoice.startDate}
                                          onChange={(e) =>
                                            setInvoice({
                                              ...invoice,
                                              startDate: e.target.value,
                                            })
                                          }
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
                                        End Date{" "}
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
                                        <input
                                          type="date"
                                          className="border-gray-400 rounded-sm h-[38px] w-full bg-[#fff2cc]"
                                          value={invoice.endDate}
                                          onChange={(e) =>
                                            setInvoice({
                                              ...invoice,
                                              endDate: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    <div className="mb-2">Daftar Invoice</div>
                                    <div className="overflow-auto max-h-[400px]">
                                      <TableInvoice
                                        data={invoice}
                                        setData={setInvoice}
                                        inputNomorInvoiceRef={
                                          inputNomorInvoiceRef
                                        }
                                        addMode={addMode}
                                        invoices={invoices}
                                        vendorType={tipePenagihan.label}
                                        optionLokasi={optionLokasi}
                                        onClickSave={onClickSave}
                                        onClickCancel={onClickCancel}
                                        onClickEdit={onClickEdit}
                                        onClickDelete={onClickDelete}
                                      />
                                    </div>
                                    {!addMode && (
                                      <div
                                        className="bg-[#305496] rounded-full shadow-md w-fit mt-2 cursor-pointer"
                                        onClick={onClickAdd}
                                      >
                                        <IoIosAdd className="text-white text-xl" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-2 mb-3">
                                    <div>
                                      Apakah barang termasuk pajak? *) :{" "}
                                    </div>

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
                                      <div className="flex flex-col gap-1">
                                        <div className="w-[350px]">
                                          Purchase Order
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
                                    </div>
                                    {purchaseOrderFile !== null &&
                                    RegExp("\\bpdf\\b").test(
                                      purchaseOrderFile.split(",")[0]
                                    ) ? (
                                      <div className="h-[500px] w-full mb-5">
                                        <div className="h-full w-full">
                                          <Viewer
                                            fileUrl={purchaseOrderPreviewFile}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      purchaseOrderFile !== null && (
                                        <div className="h-[300px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <img
                                              src={purchaseOrderPreviewFile}
                                              alt="no"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div className="flex flex-col gap-1">
                                        <div className="">
                                          Delivery Order (DO) / Packing List
                                          (Surat Jalan)
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
                                    </div>
                                    {deliveryOrderFile !== null &&
                                    RegExp("\\bpdf\\b").test(
                                      deliveryOrderFile.split(",")[0]
                                    ) ? (
                                      <div className="h-[500px] w-full mb-5">
                                        <div className="h-full w-full">
                                          <Viewer
                                            fileUrl={deliveryOrderPreviewFile}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      deliveryOrderFile !== null && (
                                        <div className="h-[300px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <img
                                              src={deliveryOrderPreviewFile}
                                              alt="no"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    <div className="flex flex-col gap-3 mb-3">
                                      <div className="flex flex-col gap-1">
                                        <div className="w-[350px]">
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
                                    </div>
                                    {invoiceFile !== null &&
                                    RegExp("\\bpdf\\b").test(
                                      invoiceFile.split(",")[0]
                                    ) ? (
                                      <div className="h-[500px] w-full mb-5">
                                        <div className="h-full w-full">
                                          <Viewer
                                            fileUrl={invoicePreviewFile}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      invoiceFile !== null && (
                                        <div className="h-[300px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <img
                                              src={invoicePreviewFile}
                                              alt="no"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    <div className="flex flex-col gap-3 mb-10">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex flex-col gap-1">
                                          <div className="w-[350px]">
                                            Kwitansi *) :
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                          total penagihan diatas 5 juta
                                          diwajibkan bermaterai
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
                                    </div>
                                    {kwitansiFile !== null &&
                                    RegExp("\\bpdf\\b").test(
                                      kwitansiFile.split(",")[0]
                                    ) ? (
                                      <div className="h-[500px] w-full mb-5">
                                        <div className="h-full w-full">
                                          <Viewer
                                            fileUrl={kwitansiPreviewFile}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      kwitansiFile !== null && (
                                        <div className="h-[300px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <img
                                              src={kwitansiPreviewFile}
                                              alt="no"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    {vendors.status_pajak === "PKP" && (
                                      <>
                                        <div className="flex flex-col gap-3 mb-3">
                                          <div className="flex flex-col gap-1">
                                            <div className="w-[350px]">
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
                                        </div>
                                        {fakturPajakFile !== null &&
                                        RegExp("\\bpdf\\b").test(
                                          fakturPajakFile.split(",")[0]
                                        ) ? (
                                          <div className="h-[500px] w-full mb-5">
                                            <div className="h-full w-full">
                                              <Viewer
                                                fileUrl={fakturPajakPreviewFile}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          fakturPajakFile !== null && (
                                            <div className="h-[300px] w-full mb-5">
                                              <div className="h-full w-full">
                                                <img
                                                  src={fakturPajakPreviewFile}
                                                  alt="no"
                                                  className="w-full h-full"
                                                />
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </>
                                    )}

                                    <div>
                                      <div className="italic">
                                        Dokumen asli (hardcopy) sudah di
                                        kirimkan ke PT My Company :
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
                                      </div>
                                      {resiFile !== null &&
                                      RegExp("\\bpdf\\b").test(
                                        resiFile.split(",")[0]
                                      ) ? (
                                        <div className="h-[500px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <Viewer fileUrl={resiPreviewFile} />
                                          </div>
                                        </div>
                                      ) : (
                                        resiFile !== null && (
                                          <div className="h-[300px] w-full mb-5">
                                            <div className="h-full w-full">
                                              <img
                                                src={resiPreviewFile}
                                                alt="no"
                                                className="w-full h-full"
                                              />
                                            </div>
                                          </div>
                                        )
                                      )}
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
                                    <div className="overflow-auto max-h-[400px] mb-10">
                                      <TableInvoice
                                        data={invoice}
                                        setData={setInvoice}
                                        inputNomorInvoiceRef={
                                          inputNomorInvoiceRef
                                        }
                                        addMode={addMode}
                                        invoices={invoices}
                                        invoiceFiles={invoiceTambahan}
                                        setInvoiceFiles={setInvoiceTambahan}
                                        pajakFiles={fakturPajakTambahan}
                                        setPajakFiles={setFakturPajakTambahan}
                                        vendorType={tipePenagihan.label}
                                        optionLokasi={optionLokasi}
                                        onClickSave={onClickSave}
                                        onClickCancel={onClickCancel}
                                        onClickEdit={onClickEdit}
                                        onClickDelete={onClickDelete}
                                        activeStep={activeStep}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-3 mb-10">
                                      <div className="flex flex-col gap-1">
                                        <div className="flex flex-col gap-1">
                                          <div className="w-[350px]">
                                            Kwitansi
                                          </div>
                                          <div className="text-[10px] text-gray-500">
                                            Max size 2 mb
                                          </div>
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                          total penagihan diatas 5 juta
                                          diwajibkan bermaterai
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
                                    </div>
                                    {kwitansiFile !== null &&
                                    RegExp("\\bpdf\\b").test(
                                      kwitansiFile.split(",")[0]
                                    ) ? (
                                      <div className="h-[500px] w-full mb-5">
                                        <div className="h-full w-full">
                                          <Viewer
                                            fileUrl={kwitansiPreviewFile}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      kwitansiFile !== null && (
                                        <div className="h-[300px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <img
                                              src={kwitansiPreviewFile}
                                              alt="no"
                                              className="w-full h-full"
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <div>
                                      <div className="italic">
                                        Dokumen asli (hardcopy) sudah di
                                        kirimkan ke PT My Company :
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
                                      </div>
                                      {resiFile !== null &&
                                      RegExp("\\bpdf\\b").test(
                                        resiFile.split(",")[0]
                                      ) ? (
                                        <div className="h-[500px] w-full mb-5">
                                          <div className="h-full w-full">
                                            <Viewer fileUrl={resiPreviewFile} />
                                          </div>
                                        </div>
                                      ) : (
                                        resiFile !== null && (
                                          <div className="h-[300px] w-full mb-5">
                                            <div className="h-full w-full">
                                              <img
                                                src={resiPreviewFile}
                                                alt="no"
                                                className="w-full h-full"
                                              />
                                            </div>
                                          </div>
                                        )
                                      )}
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
                                          activeStep === 0 &&
                                          "cursor-not-allowed"
                                        } `}
                                      >
                                        Save as draft
                                      </button>
                                    ) : (
                                      <button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                          activeStep === 0 &&
                                          "cursor-not-allowed"
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
                                          activeStep === 0 &&
                                          "cursor-not-allowed"
                                        } `}
                                      >
                                        Save as draft
                                      </button>
                                    ) : (
                                      <button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                          activeStep === 0 &&
                                          "cursor-not-allowed"
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
      ) : (
        <div
          className={`flex justify-center items-center flex-col max-h-screen ${
            screenSize < 768 ? "px-5 pt-72" : "px-10"
          } pt-52 font-roboto `}
        >
          {" "}
          <div>
            <img
              className="w-52 h-52"
              src={require("../../../assets/images/warning.png")}
              alt=""
            />
          </div>
          <div>
            Anda tidak dapat membuat penagihan jika vendor anda belum active!
          </div>{" "}
        </div>
      )}

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
