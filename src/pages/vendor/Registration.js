import {
  Backdrop,
  Box,
  Button,
  Checkbox,
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
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsBuildings } from "react-icons/bs";
import { MdPayments } from "react-icons/md";
import { HiOutlineDocument } from "react-icons/hi";
import Select from "react-select";
import { PiWarningCircleLight } from "react-icons/pi";
import ApiDataWilayahIndonesia from "../../api/ApiDataWilayahIndonesia";
import { Link, useNavigate } from "react-router-dom";
import isEmpty from "../../components/functions/CheckEmptyObject";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GetBase64 from "../../components/functions/GetBase64";

const steps = ["Company Profile", "Contact Person", "Payment", "Document"];
const options = [
  { value: "cv", label: "CV", key: 1 },
  { value: "pt", label: "PT", key: 2 },
  { value: "ud", label: "UD", key: 3 },
  { value: "perseorangan", label: "Perseorangan", key: 4 },
  { value: "lainnya", label: "Lainnya", key: 5 },
];

const optionTipePembelian = [
  { value: "konsinyasi", label: "Konsinyasi", key: 1 },
  { value: "beli putus", label: "Beli Putus", key: 2 },
];

const optionStatusPajak = [
  { value: "PKP", label: "Perusahaan Kena Pajak (PKP)", key: 1 },
  { value: "NPKP", label: "Non Perusahaan Kena Pajak (NPKP)", key: 2 },
];

const optionMetodePengiriman = [
  { value: "darat", label: "Darat", key: 1 },
  { value: "laut", label: "Laut", key: 2 },
  { value: "udara", label: "Udara", key: 3 },
];

const api = process.env.REACT_APP_BASEURL;

const Registration = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [optionProvinsi, setOptionProvinsi] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tipePerusahaan, setTipePerusahaan] = useState({});
  const [tipePerusahaanText, setTipePerusahaanText] = useState("");
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [kode, setKode] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState({});
  const [kota, setKota] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [tipePembelian, setTipePembelian] = useState({});
  const [npwp, setNpwp] = useState("");
  const [statusPajak, setStatusPajak] = useState({
    value: "NPKP",
    label: "Non Perusahaan Kena Pajak (NPKP)",
    key: 2,
  });
  const [website, setWebsite] = useState("");
  const [namaPemilikPerusahaan, setNamaPemilikPerusahaan] = useState("");
  const [namaPenanggungJawab, setNamaPenanggungJawab] = useState("");
  const [jabatanPenanggungJawab, setJabatanPenanggungJawab] = useState("");
  const [noTelpKantor, setNoTelpKantor] = useState("");
  const [whatsappKeuangan, setWhatsappKeuangan] = useState("");
  const [whatsappPO, setWhatsappPO] = useState("");
  const [emailKorespondensiPo, setEmailKorespondensiPo] = useState("");
  const [namaKontak, setNamaKontak] = useState("");
  const [namaKontakKeuangan, setNamaKontakKeuangan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [jabatanKeuangan, setJabatanKeuangan] = useState("");
  const [emailKorespondensiKeuangan, setEmailKorespondensiKeuangan] =
    useState("");
  const [termPembayaran, setTermPembayaran] = useState("");
  const [pengembalianBarang, setPengembalianBarang] = useState("");
  const [bank, setBank] = useState("");
  const [nomorRekening, setRekening] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [kantorCabangBank, setKantorCabangBank] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState({});
  const [rebate, setRebate] = useState("");
  const [marketingFee, setMarketingFee] = useState("");
  const [listingFee, setListingFee] = useState("");
  const [promotionFund, setPromotionFund] = useState("");

  const [npwpFile, setNpwpFile] = useState(null);
  const [ktpPemilikFile, setKtpPemilikFIle] = useState(null);
  const [ktpPenanggungJawabFile, setKtpPenanggungJawabFile] = useState(null);
  const [spkpFile, setSpkpFile] = useState(null);
  const [nibFile, setNibFile] = useState(null);
  const [ssPerusahaanFile, setSsPerusahaanFile] = useState(null);
  const [sertifBpomFile, setSertifBpomFile] = useState(null);

  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aggrement, setAggrement] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        username.trim().length > 0 &&
        email.trim().length > 0 &&
        password.trim().length > 0 &&
        kode.trim().length > 0 &&
        namaPerusahaan.trim().length > 0 &&
        alamat.trim().length > 0 &&
        !isEmpty(provinsi) &&
        kota.trim().length > 0 &&
        kodePos.trim().length > 0 &&
        !isEmpty(tipePembelian) &&
        !isEmpty(statusPajak)
      ) {
        if (!isValidEmail(email)) {
          setIsError(true);
          setMessage("Email Tidak Valid!");
        } else {
          fetch(`${api}api/portal-vendor/user/validation`, {
            method: "POST",
            body: JSON.stringify({
              username: username,
              email: email,
            }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (!res.data) {
                setIsError(true);
                setMessage("Username atau Email Sudah ada!");
              } else {
                fetch(`${api}api/portal-vendor/vendor/validation`, {
                  method: "POST",
                  body: JSON.stringify({
                    name: namaPerusahaan,
                    code: kode
                  }),
                })
                  .then((response) => response.json())
                  .then((res) => {
                    if (!res.data) {
                      setIsError(true);
                      setMessage("Nama Perusahaan atau kode Sudah ada!");
                    } else {
                      if (statusPajak.value === "PKP") {
                        if (npwp.trim().length === 20) {
                          setIsError(false);
                        } else {
                          setMessage("Data Belum Lengkap!");
                          return setIsError(true);
                        }
                      }

                      if (!isEmpty(tipePerusahaan)) {
                        if (tipePerusahaan.value === "lainnya") {
                          if (tipePerusahaanText.trim().length > 0) {
                            setIsError(false);
                            setActiveStep(
                              (prevActiveStep) => prevActiveStep + 1
                            );
                          } else {
                            setMessage("Data Belum Lengkap!");
                            setIsError(true);
                          }
                        } else {
                          setIsError(false);
                          setActiveStep((prevActiveStep) => prevActiveStep + 1);
                        }
                      } else {
                        setMessage("Data Belum Lengkap!");
                        setIsError(true);
                      }
                    }
                  }).catch((err) => {
                    console.log(err)
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        setMessage("Data Belum Lengkap!");
        setIsError(true);
      }
    } else if (activeStep === 1) {
      if (
        namaPemilikPerusahaan.trim().length > 0 &&
        namaPenanggungJawab.trim().length > 0 &&
        jabatanPenanggungJawab.trim().length > 0 &&
        noTelpKantor.trim().length > 0 &&
        whatsappPO.trim().length > 0 &&
        namaKontak.trim().length > 0 &&
        whatsappKeuangan.trim().length > 0 &&
        namaKontakKeuangan.trim().length > 0 &&
        jabatanKeuangan.trim().length > 0
      ) {
        setIsError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setIsError(true);
        setMessage("Data Belum Lengkap!");
      }
    } else if (activeStep === 2) {
      if (
        termPembayaran.trim().length > 0 &&
        bank.trim().length > 0 &&
        nomorRekening.trim().length > 0 &&
        namaRekening.trim().length > 0 &&
        kantorCabangBank.trim().length > 0 &&
        !isEmpty(metodePengiriman) &&
        pengembalianBarang.trim().length > 0
      ) {
        setIsError(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setIsError(true);
        setMessage("Data Belum Lengkap!");
      }
    } else if (activeStep === 3) {
      if (
        npwpFile !== null &&
        ktpPemilikFile !== null &&
        ktpPenanggungJawabFile !== null &&
        spkpFile !== null &&
        nibFile !== null &&
        ssPerusahaanFile !== null
      ) {
        if (aggrement !== 1) {
          setMessage("Perjanjian Belum Disetujui!");
          setIsError(true);
        } else {
          setIsError(false);
          saveVendor();
        }
      } else {
        setIsError(true);
        setMessage(
          "File yang bertanda *) tidak boleh kosong atau maksimal size file adalah 2 mb!"
        );
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
      2: <AiOutlineUser />,
      3: <MdPayments />,
      4: <HiOutlineDocument />,
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

  const fetchProvince = async () => {
    await ApiDataWilayahIndonesia.get("provinces.json").then((response) => {
      const provinsiValue = response.data.map((item, i) => {
        const provinsiCopy = [...optionProvinsi];
        return (provinsiCopy[i] = {
          value: item.name,
          label: item.name,
          key: item.id,
        });
      });

      setOptionProvinsi(provinsiValue);
    });
  };

  const saveVendor = async () => {
    setOpenBackdrop(true);
    setLoading(true);

    const inititalValue = {
      id: 0,
      username: username,
      email: email,
      password: password,
      nama: namaPerusahaan.trim(),
      kode: kode.trim(),
      tipe_perusahaan: tipePerusahaan.value,
      tipe_perusahaan_lainnya: tipePerusahaanText.trim(),
      alamat: alamat.trim(),
      provinsi: provinsi.value,
      kota: kota.trim(),
      kode_pos: kodePos.trim(),
      tipe_pembelian: tipePembelian.value,
      status_pajak: statusPajak.value,
      npwp: npwp.trim(),
      website: website.trim(),
      nama_pemilik: namaPemilikPerusahaan.trim(),
      nama_penanggung_jawab: namaPenanggungJawab.trim(),
      jabatan_penanggung_jawab: jabatanPenanggungJawab.trim(),
      no_telp_kantor: noTelpKantor.trim(),
      no_wa_purchase_order: whatsappPO.trim(),
      email_korespondensi: emailKorespondensiPo.trim(),
      nama_kontak: namaKontak.trim(),
      jabatan_kontak: jabatan.trim(),
      no_wa_keuangan: whatsappKeuangan.trim(),
      email_korespondensi_keuangan: emailKorespondensiKeuangan.trim(),
      nama_kontak_keuangan: namaKontakKeuangan.trim(),
      jabatan_keuangan: jabatanKeuangan.trim(),
      term_pembayaran: termPembayaran.trim(),
      pengembalian_barang: pengembalianBarang.trim(),
      bank: bank.trim(),
      no_rekening_bank: nomorRekening.trim(),
      nama_rekening_bank: namaRekening.trim(),
      kantor_cabang_bank: kantorCabangBank.trim(),
      metode_pengiriman: metodePengiriman.value,
      rebate: rebate.trim(),
      marketing_fee: marketingFee.trim(),
      listing_fee: listingFee.trim(),
      promotion_found: promotionFund.trim(),
      file_npwp: npwpFile !== null ? npwpFile : null,
      file_ktp_pemilik: ktpPemilikFile !== null ? ktpPemilikFile : null,
      file_ktp_penanggung_jawab:
        ktpPenanggungJawabFile !== null ? ktpPenanggungJawabFile : null,
      file_spkp: spkpFile !== null ? spkpFile : null,
      file_nib: nibFile !== null ? nibFile : null,
      file_screenshot_rekening:
        ssPerusahaanFile !== null ? ssPerusahaanFile : null,
      file_sertikasi_bpom: sertifBpomFile !== null ? sertifBpomFile : null,
      vendor_id: 0,
      status: "PENDING",
    };

    //const json = JSON.stringify(inititalValue)

    await fetch(`${api}api/portal-vendor/sign-up`, {
      method: "POST",
      body: JSON.stringify(inititalValue),
    })
      .then((response) => response.json())
      .then((res) => {
        setLoading(false);
        if (res.data !== 0) {
          setOpenBackdrop(false);
          toast.success("Sign up success!", {
            position: "top-right",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          navigate(`/`);
        } else {
          setOpenBackdrop(false);
          toast.error("Failed to sign up!", {
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
        setLoading(false);
        setOpenBackdrop(false);
        toast.error("Failed to sign up!", {
          position: "top-right",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });
  };

  // const saveUser = async (id) => {
  //   const inititalValue = {
  //     email: email.trim(),
  //     username: username.trim(),
  //     password: password.trim(),
  //     vendor_id: id,
  //   };

  //   await fetch(`${api}api/portal-vendor/user`, {
  //     method: "POST",
  //     body: JSON.stringify(inititalValue),
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       if (res.data !== 0) {
  //         setOpenBackdrop(false);
  //         toast.success("Sign up success!", {
  //           position: "top-right",
  //           style: {
  //             borderRadius: "10px",
  //             background: "#333",
  //             color: "#fff",
  //           },
  //         });
  //         navigate(`/`);
  //       } else {
  //         setOpenBackdrop(false);
  //         toast.error("Sign up failed!", {
  //           position: "top-right",
  //           style: {
  //             borderRadius: "10px",
  //             background: "#333",
  //             color: "#fff",
  //           },
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       setOpenBackdrop(false);
  //       toast.error("Sign up failed!", {
  //         position: "top-right",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#333",
  //           color: "#fff",
  //         },
  //       });
  //     });
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  useEffect(() => {
    fetchProvince();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNpwp = (value) => {
    try {
      var cleaned = ("" + value).replace(/\D/g, "");
      var match = cleaned.match(
        /(\d{0,1})?(\d{0,2})?(\d{0,3})?(\d{0,3})?(\d{0,1})?(\d{0,3})?(\d{0,3})$/
      );


      var nilai = [
        match[1] && "0",
        match[2],
        match[3] ? "." : "",
        match[3],
        match[4] ? "." : "",
        match[4],
        match[5] ? "." : "",
        match[5],
        match[6] ? "-" : "",
        match[6],
        match[7] ? "." : "",
        match[7],
      ].join("");
      setNpwp(nilai);
    } catch (err) {
      return "";
    }
  };

  const onChangeStatusPajak = (item) => {
    setStatusPajak(item);
  };

  const onChangeWhatsappKeuangan = (e) => {
    if (e.target.validity.valid) {
      setWhatsappKeuangan(e.target.value);
    } else {
      setWhatsappKeuangan("");
    }
  };

  const onChangeNoTelpKantor = (e) => {
    if (e.target.validity.valid) {
      setNoTelpKantor(e.target.value);
    } else {
      setNoTelpKantor("");
    }
  };

  const onChangeWhatsappPO = (e) => {
    if (e.target.validity.valid) {
      setWhatsappPO(e.target.value);
    } else {
      setWhatsappPO("");
    }
  };

  const onChangeTermPembayaran = (e) => {
    if (e.target.validity.valid) {
      setTermPembayaran(e.target.value);
    } else {
      setTermPembayaran("");
    }
  };

  const onChangePengembalianBarang = (e) => {
    if (e.target.validity.valid) {
      setPengembalianBarang(e.target.value);
    } else {
      setPengembalianBarang("");
    }
  };

  const onChangeMarketingFee = (e) => {
    e.target.validity.valid
      ? setMarketingFee(e.target.value)
      : setMarketingFee("");
  };

  const onChangeRebate = (e) => {
    e.target.validity.valid ? setRebate(e.target.value) : setRebate("");
  };

  const onChangeListingFee = (e) => {
    e.target.validity.valid ? setListingFee(e.target.value) : setListingFee("");
  };

  const onChangePromotionFund = (e) => {
    e.target.validity.valid
      ? setPromotionFund(e.target.value)
      : setPromotionFund("");
  };

  const onChangeNpwpFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setNpwpFile(result);
          })
          .catch((err) => {
            setNpwpFile(null);
          });
      } else {
        setNpwpFile(null);
      }
    }
  };

  const onChangeKtpPemilikFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setKtpPemilikFIle(result);
          })
          .catch((err) => {
            setKtpPemilikFIle(null);
          });
      } else {
        setKtpPemilikFIle(null);
      }
    }
  };

  const onChangeKtpPenanggungJawabFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setKtpPenanggungJawabFile(result);
          })
          .catch((err) => {
            setKtpPenanggungJawabFile(null);
          });
      } else {
        setKtpPenanggungJawabFile(null);
      }
    }
  };

  const onChangeSpkpFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setSpkpFile(result);
          })
          .catch((err) => {
            setSpkpFile(null);
          });
      } else {
        setSpkpFile(null);
      }
    }
  };

  const onChangeNibFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setNibFile(result);
          })
          .catch((err) => {
            setNibFile(null);
          });
      } else {
        setNibFile(null);
      }
    }
  };

  const onChangeSsRekeningFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setSsPerusahaanFile(result);
          })
          .catch((err) => {
            setSsPerusahaanFile(null);
          });
      } else {
        setSsPerusahaanFile(null);
      }
    }
  };

  const onChangeBpomFile = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e.target.files[0].size <= 2000000) {
        GetBase64(e.target.files[0])
          .then((result) => {
            setSertifBpomFile(result);
          })
          .catch((err) => {
            setSertifBpomFile(null);
          });
      } else {
        setSertifBpomFile(null);
      }
    }
  };

  const onChangeProvinsi = (item) => {
    if (provinsi.value !== item.value) {
      setProvinsi(item);
    }
  };

  const onChangeTipePerusahaan = (item) => {
    setTipePerusahaan(item);
    if (item.value !== "lainnya") {
      setTipePerusahaanText("");
    }
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  return (
    <div className={`font-roboto pt-20 px-10 `}>
      {screenSize > 580 ? (
        <div className="w-full">
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
                  <div className="flex mb-10 text-slate-400  text-[12px]">
                    <div className="w-36">Keterangan</div>
                    <div className="me-2">:</div>
                    <div>* = Tidak boleh kosong</div>
                  </div>
                  <form action="">
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Username
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyDown={(evt) =>
                            evt.key === " " && evt.preventDefault()
                          }
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && username.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && username.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Email
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(evt) =>
                            evt.key === " " && evt.preventDefault()
                          }
                          type="email"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && email.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && email.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-10">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Password
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(evt) =>
                            evt.key === " " && evt.preventDefault()
                          }
                          type={`${showPassword ? "text" : "password"}`}
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && password.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="cursor-pointer absolute top-[50%] right-[10px] translate-y-[-50%] "
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                        </div>
                        <div className="absolute right-[-20px] top-0">
                          {isError && password.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Tipe Perusahaan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative flex flex-col gap-1">
                        <Select
                          value={tipePerusahaan}
                          onChange={onChangeTipePerusahaan}
                          options={options}
                          noOptionsMessage={() => "Data not found"}
                          styles={customeStyles}
                          placeholder="Pilih Tipe Perusahaan..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && isEmpty(tipePerusahaan) ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                        {tipePerusahaan.value === "lainnya" && (
                          <div className="relative">
                            <input
                              value={tipePerusahaanText}
                              onChange={(e) =>
                                setTipePerusahaanText(e.target.value)
                              }
                              type="text"
                              name=""
                              id=""
                              placeholder="Tulis tipe perusahaan..."
                              className={`w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] ${
                                isError &&
                                tipePerusahaanText.trim().length === 0 &&
                                "border-red-400"
                              } `}
                            />

                            <div className="absolute right-[-20px] top-0">
                              {isError &&
                              tipePerusahaanText.trim().length === 0 ? (
                                <div className="text-red-500">
                                  <PiWarningCircleLight />
                                </div>
                              ) : (
                                "*)"
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Nama Perusahaan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaPerusahaan}
                          onChange={(e) => setNamaPerusahaan(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && namaPerusahaan.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && namaPerusahaan.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Kode
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={kode}
                          onChange={(e) => setKode(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && kode.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && kode.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Alamat
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <textarea
                          rows={5}
                          value={alamat}
                          onChange={(e) => setAlamat(e.target.value)}
                          name=""
                          id=""
                          className={`w-full borderrounded-sm focus:border focus:border-[#0077b6] ${
                            isError && alamat.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && alamat.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Provinsi
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <Select
                          value={provinsi}
                          onChange={onChangeProvinsi}
                          options={optionProvinsi}
                          noOptionsMessage={() => "Provinsi not found"}
                          styles={customeStyles}
                          placeholder="Pilih Provinsi..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && isEmpty(provinsi) ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Kota
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={kota}
                          onChange={(e) => setKota(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && kota.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && kota.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Kode Pos
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={kodePos}
                          onChange={(e) => setKodePos(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && kodePos.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && kodePos.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Tipe Pembelian
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <Select
                          value={tipePembelian}
                          onChange={(item) => setTipePembelian(item)}
                          options={optionTipePembelian}
                          noOptionsMessage={() => "Tipe not found"}
                          styles={customeStyles}
                          placeholder="Pilih tipe Pembelian..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && isEmpty(tipePembelian) ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Status Pajak
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <Select
                          options={optionStatusPajak}
                          defaultValue={statusPajak}
                          onChange={onChangeStatusPajak}
                          noOptionsMessage={() => "Status pajak not found"}
                          styles={customeStyles}
                          placeholder="Pilih status pajak..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && isEmpty(statusPajak) ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-36">
                            NPWP
                          </label>
                        </div>

                        <div className="flex gap-1 items-center text-[12px]">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>Harus 15 digit</div>
                        </div>
                      </div>
                      <div className="mr-2">:</div>

                      <div className="w-1/2 relative">
                        <input
                          maxLength={21}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError &&
                            statusPajak.value === "PKP" &&
                            namaPerusahaan.trim().length < 20
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                          value={npwp}
                          onChange={(e) => formatNpwp(e.target.value)}
                        />
                        {statusPajak.value === "PKP" ? (
                          <div className="absolute right-[-20px] top-0">
                            {isError && npwp.trim().length !== 20 ? (
                              <div className="text-red-500">
                                <PiWarningCircleLight />
                              </div>
                            ) : (
                              "*)"
                            )}
                          </div>
                        ) : (
                          <div className="absolute right-[-20px] top-0"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          Website
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2">
                        <input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    {isError && (
                      <div className="mt-10 mb-3">
                        <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>{message}</div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : activeStep === 1 ? (
                <div className="mt-20 ps-3 max-[697px]:pe-3">
                  <div className="flex mb-10 text-slate-400  text-[12px]">
                    <div className="w-36">Keterangan</div>
                    <div className="me-2">:</div>
                    <div>* = Tidak boleh kosong</div>
                  </div>
                  <form action="">
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Nama Pemilik Perusahaan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaPemilikPerusahaan}
                          onChange={(e) =>
                            setNamaPemilikPerusahaan(e.target.value)
                          }
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && namaPemilikPerusahaan.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError &&
                          namaPemilikPerusahaan.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Nama Penanggung Jawab
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaPenanggungJawab}
                          onChange={(e) =>
                            setNamaPenanggungJawab(e.target.value)
                          }
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && namaPenanggungJawab.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError &&
                          namaPenanggungJawab.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3 items-center">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Jabatan Penanggung Jawab
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={jabatanPenanggungJawab}
                          onChange={(e) =>
                            setJabatanPenanggungJawab(e.target.value)
                          }
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError &&
                            jabatanPenanggungJawab.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError &&
                          jabatanPenanggungJawab.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          No Telp Kantor
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={noTelpKantor}
                          onChange={(e) => onChangeNoTelpKantor(e)}
                          type="text"
                          name=""
                          id=""
                          pattern="[0-9]*"
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && noTelpKantor.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && noTelpKantor.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 font-semibold underline">
                      Kontak korenspondensi notifikasi
                    </div>
                    <div className="flex gap-2 items-center mb-3 mt-2">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          No Whatsapp Purchase Order (PO)
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          name=""
                          id=""
                          value={whatsappPO}
                          onChange={(e) => onChangeWhatsappPO(e)}
                          className={`w-full h-[36px]  rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && whatsappPO.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && whatsappPO.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Email Korespondensi PO
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={emailKorespondensiPo}
                          onChange={(e) =>
                            setEmailKorespondensiPo(e.target.value)
                          }
                          type="email"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Nama Kontak
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaKontak}
                          onChange={(e) => setNamaKontak(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6]  ${
                            isError && namaKontak.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && namaKontak.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Jabatan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2">
                        <input
                          value={jabatan}
                          onChange={(e) => setJabatan(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3 mt-10">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          No Whatsapp Keuangan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          maxLength={20}
                          pattern="[0-9]*"
                          type="text"
                          name=""
                          id=""
                          value={whatsappKeuangan}
                          onChange={(e) => onChangeWhatsappKeuangan(e)}
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && whatsappKeuangan.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && whatsappKeuangan.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Email Korespondensi Keuangan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={emailKorespondensiKeuangan}
                          onChange={(e) =>
                            setEmailKorespondensiKeuangan(e.target.value)
                          }
                          type="email"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Nama Kontak
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaKontakKeuangan}
                          onChange={(e) =>
                            setNamaKontakKeuangan(e.target.value)
                          }
                          maxLength={20}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && namaKontakKeuangan.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && namaKontakKeuangan.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Jabatan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={jabatanKeuangan}
                          onChange={(e) => setJabatanKeuangan(e.target.value)}
                          maxLength={20}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && jabatanKeuangan.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && jabatanKeuangan.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>

                    {isError && (
                      <div className="mt-10 mb-3">
                        <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>{message}</div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : activeStep === 2 ? (
                <div className="mt-20 ps-3">
                  <div className="flex mb-10 text-slate-400  text-[12px]">
                    <div className="w-36">Keterangan</div>
                    <div className="me-2">:</div>
                    <div>* = Tidak boleh kosong</div>
                  </div>
                  <div className="font-semibold underline ">
                    Detail Pembayaran
                  </div>
                  <form action="">
                    <div className="flex gap-2 items-center mb-3 mt-5">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Term Pembayaran
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative flex items-center gap-2">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          name=""
                          id=""
                          value={termPembayaran}
                          onChange={onChangeTermPembayaran}
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && termPembayaran.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div>Hari</div>
                        <div className="absolute right-[-20px] top-0">
                          {isError && termPembayaran.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Bank
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={bank}
                          onChange={(e) => setBank(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px]  rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && bank.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && bank.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3 items-center">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          No. Rekening Bank
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={nomorRekening}
                          onChange={(e) => setRekening(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && nomorRekening.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && nomorRekening.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Nama Rekening Bank
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          value={namaRekening}
                          onChange={(e) => setNamaRekening(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && namaRekening.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && namaRekening.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Kantor Cabang Bank
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative flex items-center gap-2">
                        <div>KCP</div>
                        <input
                          value={kantorCabangBank}
                          onChange={(e) => setKantorCabangBank(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && kantorCabangBank.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && kantorCabangBank.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Metode Pengiriman
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <Select
                          value={metodePengiriman}
                          onChange={(item) => setMetodePengiriman(item)}
                          options={optionMetodePengiriman}
                          noOptionsMessage={() => "Metode not found"}
                          styles={customeStyles}
                          placeholder="Pilih metode pengiriman..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && isEmpty(metodePengiriman) ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3 mt-5">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Pengembalian Barang
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative flex items-center gap-2">
                        <input
                          type="text"
                          pattern="[0-9]*"
                          name=""
                          id=""
                          value={pengembalianBarang}
                          onChange={onChangePengembalianBarang}
                          className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && pengembalianBarang.trim().length === 0
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div>Hari</div>
                        <div className="absolute right-[-20px] top-0">
                          {isError && pengembalianBarang.trim().length === 0 ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3 mt-10">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Rebate
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={rebate}
                          onChange={onChangeRebate}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Marketing fee
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={marketingFee}
                          onChange={onChangeMarketingFee}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Listing Fee
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={listingFee}
                          onChange={onChangeListingFee}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Promotion Found
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={promotionFund}
                          onChange={onChangePromotionFund}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                    {isError && (
                      <div className="mt-10 mb-3">
                        <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>{message}</div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <div className="mt-20 ps-3">
                  <div className="flex flex-col mb-10 text-slate-400 gap-2 text-[12px]">
                    <div className="flex">
                      <div className="w-36">Keterangan</div>
                      <div className="me-2">:</div>
                      <div>* = Tidak boleh kosong</div>
                    </div>
                    <div className="flex gap-1 items-center text-[12px]">
                      <div>
                        <PiWarningCircleLight />
                      </div>
                      <div>Upload file dalam format .pdf atau .jpg</div>
                    </div>
                  </div>

                  <form action="">
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            NPWP / Surat Keterangan Bebas Pajak
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>

                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeNpwpFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className={`w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && npwpFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          }  `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && npwpFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            KTP Pemilik
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeKtpPemilikFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className={` w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && ktpPemilikFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && ktpPemilikFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            KTP Penanggung Jawab
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeKtpPenanggungJawabFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className={` w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && ktpPenanggungJawabFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && ktpPenanggungJawabFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex items-center">
                          <label
                            htmlFor=""
                            className="w-72 whitespace-pre-wrap"
                          >
                            Surat Pengukuhan Kena Pajak (SPKP) / Surat
                            Keterangan Non PKP (Bagi Pengusaha Tidak Kena Pajak)
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeSpkpFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className={` w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && spkpFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && spkpFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            Nomer Induk Berusaha (NIB)
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeNibFile}
                          accept=".jpg,.pdf"
                          id="upload-npwp"
                          className={` w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && nibFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && nibFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            Screenshot Rekening Perusahaan
                          </label>
                          <div>:</div>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 2 mb
                        </div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeSsRekeningFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className={` w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                            isError && ssPerusahaanFile === null
                              ? "border-red-400"
                              : "border-slate-300"
                          } `}
                        />
                        <div className="absolute right-[-20px] top-0">
                          {isError && ssPerusahaanFile === null ? (
                            <div className="text-red-500">
                              <PiWarningCircleLight />
                            </div>
                          ) : (
                            "*)"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex flex-col gap-1">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-72">
                            Sertifikasi BPOM
                          </label>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Max size 1 mb
                        </div>
                        <div className="flex gap-1 items-center text-[12px]">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>Untuk supplier makanan & minuman</div>
                        </div>
                      </div>
                      <div className="mr-2">:</div>

                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeBpomFile}
                          id="upload-npwp"
                          accept=".jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                  </form>
                  <div className="flex gap-2 mt-20">
                    <div>
                      <Checkbox
                        onChange={() =>
                          setAggrement((prev) => (prev === 0 ? 1 : 0))
                        }
                        value="1"
                        checked={aggrement === 1 ? true : false}
                      />
                    </div>
                    <div className="w-[500px] text-[12px]">
                      Kami, yang bertanda tangan dibawah ini menyatakan telah
                      mengisi dengan sebenar-benarnya dan menyatakan telah
                      mematuhi segala bentuk UU dan peraturan yang dibuat oleh
                      Pemerintah Republik Indonesia, dalam lingkup usaha kami
                      yang kami jalakan selama menajadi supplier/vendor aktif
                      kepada PT Karya Prima Unggulan
                    </div>
                  </div>

                  {isError && (
                    <div className="mt-10 mb-3">
                      <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                        <div>
                          <PiWarningCircleLight />
                        </div>
                        <div>{message}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex mt-24 justify-between mb-5">
                {activeStep === 0 ? (
                  <Link to="/">
                    <button
                      className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 `}
                    >
                      Back
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 `}
                  >
                    Back
                  </button>
                )}

                {activeStep === steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={loading ? true : false}
                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Finish"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
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
                        <div className="flex  mb-10 text-slate-400  text-[12px]">
                          <div className="">Keterangan :</div>
                          <div>* = Tidak boleh kosong</div>
                        </div>
                        <form action="">
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Username{" "}
                                {isError && username.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap">
                              <input
                                value={username}
                                onKeyDown={(evt) =>
                                  evt.key === " " && evt.preventDefault()
                                }
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && username.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Email{" "}
                                {isError && email.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap">
                              <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(evt) =>
                                  evt.key === " " && evt.preventDefault()
                                }
                                type="email"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && email.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-10">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Password{" "}
                                {isError && password.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap relative">
                              <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(evt) =>
                                  evt.key === " " && evt.preventDefault()
                                }
                                type={`${showPassword ? "text" : "password"}`}
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && password.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                              <div
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="cursor-pointer absolute top-[50%] right-[10px] translate-y-[-50%]"
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Tipe Perusahaan{" "}
                                {isError && isEmpty(tipePerusahaan) ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="w-full whitespace-nowrap flex flex-col gap-1">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />
                              {tipePerusahaan.value === "lainnya" && (
                                <input
                                  value={tipePerusahaanText}
                                  onChange={(e) =>
                                    setTipePerusahaanText(e.target.value)
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  placeholder="Tulis tipe perusahaan..."
                                  className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                    isError &&
                                    tipePerusahaanText.trim().length === 0
                                      ? "border-red-400"
                                      : "border-slate-400"
                                  } `}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Nama Perusahaan{" "}
                                {isError &&
                                namaPerusahaan.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap">
                              <input
                                value={namaPerusahaan}
                                onChange={(e) =>
                                  setNamaPerusahaan(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && namaPerusahaan.trim().length === 0
                                    ? "border-red-400"
                                    : "border-x-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Kode{" "}
                                {isError && kode.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap">
                              <input
                                value={kode}
                                onChange={(e) => setKode(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && kode.trim().length === 0
                                    ? "border-red-400"
                                    : "border-x-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                alamat{" "}
                                {isError && alamat.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div>
                              <textarea
                                rows={5}
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                name=""
                                id=""
                                className={`w-full rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && alamat.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Provinsi{" "}
                                {isError && isEmpty(provinsi) ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <Select
                                value={provinsi}
                                onChange={onChangeProvinsi}
                                options={optionProvinsi}
                                noOptionsMessage={() => "Provinsi not found"}
                                styles={customeStyles}
                                placeholder="Pilih Provinsi..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Kota{" "}
                                {isError && kota.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                value={kota}
                                onChange={(e) => setKota(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && kota.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Kode Pos{" "}
                                {isError && kodePos.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={kodePos}
                                onChange={(e) => setKodePos(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && kodePos.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Tipe Pembelian{" "}
                                {isError && isEmpty(tipePembelian) ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <Select
                                value={tipePembelian}
                                onChange={(item) => setTipePembelian(item)}
                                options={optionTipePembelian}
                                noOptionsMessage={() => "Tipe not found"}
                                styles={customeStyles}
                                placeholder="Pilih tipe Pembelian..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className="w-36 flex gap-1 items-center"
                              >
                                Status Pajak{" "}
                                {isError && isEmpty(statusPajak) ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <Select
                                options={optionStatusPajak}
                                noOptionsMessage={() =>
                                  "Status pajak not found"
                                }
                                defaultValue={statusPajak}
                                onChange={onChangeStatusPajak}
                                styles={customeStyles}
                                placeholder="Pilih status pajak..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex flex-col">
                              <div className="whitespace-nowrap flex">
                                {statusPajak.value === "PKP" ? (
                                  <label
                                    htmlFor=""
                                    className="w-36 flex gap-1 items-center"
                                  >
                                    NPWP{" "}
                                    {isError && npwp.trim().length === 0 ? (
                                      <span className="text-red-400">
                                        <PiWarningCircleLight />
                                      </span>
                                    ) : (
                                      "*"
                                    )}
                                  </label>
                                ) : (
                                  <label htmlFor="" className="w-36">
                                    NPWP
                                  </label>
                                )}
                              </div>

                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Harus 15 digit</div>
                              </div>
                            </div>
                            <div className=" relative">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                maxLength={21}
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  npwp.trim().length === 0 &&
                                  statusPajak.value === "PKP"
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                                value={npwp}
                                onChange={(e) => formatNpwp(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Website
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>{message}</div>
                              </div>
                            </div>
                          )}
                        </form>
                        <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between">
                          {screenSize > 348 ? (
                            <>
                              <Link to="/">
                                <button
                                  className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 `}
                                >
                                  Back
                                </button>
                              </Link>

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
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

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
                        <div className="flex mb-10 text-slate-400  text-[12px]">
                          <div className="">Keterangan :</div>
                          <div>* = Tidak boleh kosong</div>
                        </div>
                        <form action="">
                          <div className="flex flex-col gap-2 mb-3">
                            <div className=" flex">
                              <label
                                htmlFor=""
                                className="flex gap-1 items-center"
                              >
                                Nama Pemilik Perusahaan{" "}
                                {isError &&
                                namaPemilikPerusahaan.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="w-full whitespace-nowrap">
                              <input
                                value={namaPemilikPerusahaan}
                                onChange={(e) =>
                                  setNamaPemilikPerusahaan(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  namaPemilikPerusahaan.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Nama Penanggung Jawab{" "}
                                {isError &&
                                namaPenanggungJawab.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="whitespace-nowrap">
                              <input
                                value={namaPenanggungJawab}
                                onChange={(e) =>
                                  setNamaPenanggungJawab(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  namaPenanggungJawab.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Jabatan Penanggung Jawab{" "}
                                {isError &&
                                jabatanPenanggungJawab.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div>
                              <input
                                value={jabatanPenanggungJawab}
                                onChange={(e) =>
                                  setJabatanPenanggungJawab(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  jabatanPenanggungJawab.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className=" flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                No Telp Kantor{" "}
                                {isError && noTelpKantor.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                value={noTelpKantor}
                                onChange={(e) =>
                                  setNoTelpKantor(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] border rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && noTelpKantor.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="font-semibold underline mt-10">
                            Kontak Korespondensi Notifikasi
                          </div>
                          <div className="flex flex-col gap-2 mb-3 mt-2">
                            <div className="flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                No Whatsapp Purchase Order (PO){" "}
                                {isError && whatsappPO.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                name=""
                                id=""
                                value={whatsappPO}
                                onChange={(e) => onChangeWhatsappPO(e)}
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && whatsappPO.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Email Korespondensi PO
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={emailKorespondensiPo}
                                onChange={(e) =>
                                  setEmailKorespondensiPo(e.target.value)
                                }
                                type="email"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className=" flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Nama Kontak{" "}
                                {isError && namaKontak.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                value={namaKontak}
                                onChange={(e) => setNamaKontak(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && namaKontak.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Jabatan
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                value={jabatan}
                                onChange={(e) => setJabatan(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 mt-10">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                No Whatsapp Keuangan{" "}
                                {isError &&
                                whatsappKeuangan.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className=" relative">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                maxLength={15}
                                name=""
                                id=""
                                value={whatsappKeuangan}
                                onChange={(e) => onChangeWhatsappKeuangan(e)}
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  whatsappKeuangan.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Email Korespondensi Keuangan
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={emailKorespondensiKeuangan}
                                onChange={(e) =>
                                  setEmailKorespondensiKeuangan(e.target.value)
                                }
                                type="email"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Nama Kontak{" "}
                                {isError &&
                                namaKontakKeuangan.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={namaKontakKeuangan}
                                onChange={(e) =>
                                  setNamaKontakKeuangan(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  namaKontakKeuangan.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Jabatan{" "}
                                {isError &&
                                jabatanKeuangan.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={jabatanKeuangan}
                                onChange={(e) =>
                                  setJabatanKeuangan(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && jabatanKeuangan.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>{message}</div>
                              </div>
                            </div>
                          )}
                        </form>
                        <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between">
                          {screenSize > 348 ? (
                            <>
                              <button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

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
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

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
                    ) : activeStep === 2 ? (
                      <div className="mt-5">
                        <div className="flex  mb-10 text-slate-400  text-[12px]">
                          <div className="">Keterangan</div>
                          <div className="me-2">:</div>
                          <div>* = Tidak boleh kosong</div>
                        </div>
                        <div className="font-semibold underline ">
                          Detail Pembayaran
                        </div>
                        <form action="">
                          <div className="flex flex-col gap-2 mb-3 mt-5">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Term Pembayaran{" "}
                                {isError &&
                                termPembayaran.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative flex items-center gap-2">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                name=""
                                id=""
                                value={termPembayaran}
                                onChange={onChangeTermPembayaran}
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6]  ${
                                  isError && termPembayaran.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                              <div>Hari</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Bank{" "}
                                {isError && bank.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && bank.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                No. Rekening Bank{" "}
                                {isError &&
                                nomorRekening.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                value={nomorRekening}
                                onChange={(e) => setRekening(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && nomorRekening.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col  mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Nama Rekening Bank{" "}
                                {isError && namaRekening.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                value={namaRekening}
                                onChange={(e) =>
                                  setNamaRekening(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError && namaRekening.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Kantor Cabang Bank{" "}
                                {isError &&
                                kantorCabangBank.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative flex items-center gap-2">
                              <div>KCP</div>
                              <input
                                value={kantorCabangBank}
                                onChange={(e) =>
                                  setKantorCabangBank(e.target.value)
                                }
                                type="text"
                                name=""
                                id=""
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  kantorCabangBank.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Metode Pengiriman{" "}
                                {isError && isEmpty(metodePengiriman) ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative">
                              <Select
                                value={metodePengiriman}
                                onChange={(item) => setMetodePengiriman(item)}
                                className="whitespace-nowrap"
                                options={optionMetodePengiriman}
                                noOptionsMessage={() => "Metode not found"}
                                styles={customeStyles}
                                placeholder="Pilih metode pengiriman..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 mt-5">
                            <div className="whitespace-nowrap flex">
                              <label
                                htmlFor=""
                                className=" flex gap-1 items-center"
                              >
                                Pengembalian Barang{" "}
                                {isError &&
                                pengembalianBarang.trim().length === 0 ? (
                                  <span className="text-red-400">
                                    <PiWarningCircleLight />
                                  </span>
                                ) : (
                                  "*"
                                )}
                              </label>
                            </div>
                            <div className="relative flex items-center gap-2">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                name=""
                                id=""
                                value={pengembalianBarang}
                                onChange={onChangePengembalianBarang}
                                className={`w-full h-[36px] rounded-sm focus:border focus:border-[#0077b6] ${
                                  isError &&
                                  pengembalianBarang.trim().length === 0
                                    ? "border-red-400"
                                    : "border-slate-300"
                                } `}
                              />
                              <div>Hari</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3 mt-10">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Rebate
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={rebate}
                                onChange={onChangeRebate}
                                onKeyDown={(evt) =>
                                  (evt.key === "e" || evt.key === "-") &&
                                  evt.preventDefault()
                                }
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Marketing fee
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={marketingFee}
                                onChange={onChangeMarketingFee}
                                onKeyDown={(evt) =>
                                  (evt.key === "e" || evt.key === "-") &&
                                  evt.preventDefault()
                                }
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Listing Fee
                              </label>
                            </div>
                            <div className=" relative">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={listingFee}
                                onChange={onChangeListingFee}
                                onKeyDown={(evt) =>
                                  (evt.key === "e" || evt.key === "-") &&
                                  evt.preventDefault()
                                }
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Promotion Found
                              </label>
                            </div>
                            <div className=" relative">
                              <input
                                type="number"
                                min={0}
                                step={0.01}
                                value={promotionFund}
                                onChange={onChangePromotionFund}
                                onKeyDown={(evt) =>
                                  (evt.key === "e" || evt.key === "-") &&
                                  evt.preventDefault()
                                }
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>{message}</div>
                              </div>
                            </div>
                          )}
                        </form>
                        <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between">
                          {screenSize > 348 ? (
                            <>
                              <button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

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
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

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
                    ) : (
                      <div className="mt-5">
                        <div className="flex flex-col mb-10 text-slate-400 gap-2 text-[12px]">
                          <div className="flex">
                            <div className="">Keterangan</div>
                            <div className="me-2">:</div>
                            <div>* = Tidak boleh kosong</div>
                          </div>
                          <div className="flex gap-1 items-center text-[12px]">
                            <div>
                              <PiWarningCircleLight />
                            </div>
                            <div>Upload file dalam format .pdf atau .jpg</div>
                          </div>
                        </div>
                        <form action="">
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  NPWP / Surat Keterangan Bebas Pajak{" "}
                                  {isError && npwpFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>

                            <div className="relative">
                              <input
                                type="file"
                                onChange={onChangeNpwpFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  KTP Pemilik{" "}
                                  {isError && ktpPemilikFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={onChangeKtpPemilikFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  KTP Penanggung Jawab{" "}
                                  {isError &&
                                  ktpPenanggungJawabFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>
                            <div className=" relative">
                              <input
                                type="file"
                                onChange={onChangeKtpPenanggungJawabFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  Surat Pengukuhan Kena Pajak (SPKP) / Surat
                                  Keterangan Non PKP (Bagi Pengusaha Tidak Kena
                                  Pajak){" "}
                                  {isError && spkpFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={onChangeSpkpFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  Nomer Induk Berusaha (NIB){" "}
                                  {isError && nibFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={onChangeNibFile}
                                accept="image/jpg,.pdf"
                                id="upload-npwp"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex flex-col gap-1">
                              <div className=" flex">
                                <label
                                  htmlFor=""
                                  className=" flex gap-1 items-center"
                                >
                                  Screenshot Rekening Perusahaan{" "}
                                  {isError && spkpFile === null ? (
                                    <span className="text-red-400">
                                      <PiWarningCircleLight />
                                    </span>
                                  ) : (
                                    "*"
                                  )}
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 2 mb
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={onChangeSsRekeningFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex flex-col">
                              <div className=" flex">
                                <label htmlFor="" className="">
                                  Sertifikasi BPOM
                                </label>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Max size 1 mb
                              </div>
                              <div className="flex gap-1 items-center text-[12px]">
                                <div>
                                  <PiWarningCircleLight />
                                </div>
                                <div>Untuk supplier makanan & minuman</div>
                              </div>
                            </div>

                            <div className=" relative">
                              <input
                                type="file"
                                onChange={onChangeBpomFile}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          {isError && (
                            <div className="mt-10 mb-3">
                              <div className="w-fit flex gap-1 items-center text-[14px] bg-red-500 text-white py-3 px-5 ">
                                <div>{message}</div>
                              </div>
                            </div>
                          )}
                        </form>
                        <div className="flex gap-2 mt-20">
                          <div>
                            <Checkbox
                              onChange={() =>
                                setAggrement((prev) => (prev === 0 ? 1 : 0))
                              }
                              value="1"
                              checked={aggrement === 1 ? true : false}
                            />
                          </div>
                          <div className="w-[500px] text-[12px]">
                            Kami, yang bertanda tangan dibawah ini menyatakan
                            telah mengisi dengan sebenar-benarnya dan menyatakan
                            telah mematuhi segala bentuk UU dan peraturan yang
                            dibuat oleh Pemerintah Republik Indonesia, dalam
                            lingkup usaha kami yang kami jalakan selama menajadi
                            supplier/vendor aktif kepada PT Karya Prima Unggulan
                          </div>
                        </div>
                        <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between py-3">
                          {screenSize > 348 ? (
                            <>
                              <button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>
                              {activeStep === steps.length - 1 ? (
                                <button
                                  disabled={loading ? true : false}
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {loading ? (
                                    <CircularProgress
                                      size={20}
                                      sx={{ color: "white" }}
                                    />
                                  ) : (
                                    "Finish"
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  Next
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={`border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                                  activeStep === 0 && "cursor-not-allowed"
                                } `}
                              >
                                Back
                              </button>

                              {activeStep === steps.length - 1 ? (
                                <button
                                  disabled={loading ? true : false}
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {loading ? (
                                    <CircularProgress
                                      size={20}
                                      sx={{ color: "white" }}
                                    />
                                  ) : (
                                    "Finish"
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  Next
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
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
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999999999,
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Registration;
