import {
  Box,
  Button,
  Checkbox,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ApiDataWilayahIndonesia from "../../api/ApiDataWilayahIndonesia";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const steps = ["Company Profile", "Contact Person", "Payment", "Document"];
const options = [
  { value: "CV", label: "CV", key: 1 },
  { value: "PT", label: "PT", key: 2 },
];

const optionTipePembelian = [
  { value: "01", label: "Konsinyasi", key: 1 },
  { value: "02", label: "Beli Putus", key: 2 },
];

const optionStatusPajak = [
  { value: "01", label: "Perusahaan Kena Pajak (PKP)", key: 1 },
  { value: "02", label: "Non Perusahaan Kena Pajak (NPKP)", key: 2 },
];

const optionMetodePengiriman = [
  { value: "01", label: "Darat", key: 1 },
  { value: "02", label: "Laut", key: 2 },
  { value: "03", label: "Udara", key: 2 },
];

const Registration = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const [activeStep, setActiveStep] = useState(0);
  const [optionProvinsi, setOptionProvinsi] = useState([]);
  const [optionKota, setOptionKota] = useState([]);

  const [tipePerusahaan, setTipePerusahaan] = useState({});
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [provinsi, setProvinsi] = useState({});
  const [kota, setKota] = useState({});
  const [kodePos, setKodePos] = useState("");
  const [tipePembelian, setTipePembelian] = useState({});
  const [npwp, setNpwp] = useState("");
  const [statusPajak, setStatusPajak] = useState({
    value: "01",
    label: "Perusahaan Kena Pajak (PKP)",
    key: "01",
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
  const [bank, setBank] = useState("");
  const [nomorRekening, setRekening] = useState("");
  const [namaRekening, setNamaRekening] = useState("");
  const [kantorCabangBank, setKantorCabangBank] = useState("");
  const [metodePengiriman, setMetodePengiriman] = useState({});
  const [pengembalianBarang, setPengembalianBarang] = useState({});
  const [rebate, setRebate] = useState("");
  const [marketingFee, setMarketingFee] = useState("");
  const [listingFee, setListingFee] = useState("");
  const [promotionFund, setPromotionFund] = useState("");

  const [, setNpwpFile] = useState(null);
  const [, setKtpPemilikFIle] = useState(null);
  const [, setKtpPenanggungJawabFile] = useState(null);
  const [, setSpkpFile] = useState(null);
  const [, setSiupFile] = useState(null);
  const [, setNibFile] = useState(null);
  const [, setSsPerusahaanFile] = useState(null);
  const [, setSertifBpomFile] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
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
          value: item.id,
          label: item.name,
          key: item.id,
        });
      });

      setOptionProvinsi(provinsiValue);
    });
  };

  const fetchKota = async (id) => {
    await ApiDataWilayahIndonesia.get(`regencies/${id}.json`).then(
      (response) => {
        const optionsValue = response.data.map((item, i) => {
          const optionCopy = [...optionKota];
          return (optionCopy[i] = {
            value: item.id,
            label: item.name,
            key: item.id,
          });
        });

        setOptionKota(optionsValue);
      }
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  useEffect(() => {
    setPengembalianBarang(dayjs(new Date()));
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
        /(\d{0,2})?(\d{0,3})?(\d{0,3})?(\d{0,1})?(\d{0,3})?(\d{0,3})$/
      );

      var nilai = [
        match[1],
        match[2] ? "." : "",
        match[2],
        match[3] ? "." : "",
        match[3],
        match[4] ? "." : "",
        match[4],
        match[5] ? "-" : "",
        match[5],
        match[6] ? "." : "",
        match[6],
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

  const onChangePengembalianBarang = (newValue) => {
    setPengembalianBarang(newValue);
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
    setNpwpFile(e.target.files[0]);
  };

  const onChangeProvinsi = (item) => {
    if (provinsi.value !== item.value) {
      setProvinsi(item);
      setKota({});

      fetchKota(item.value);
    }
  };

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
                          Tipe Perusahaan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <Select
                          value={tipePerusahaan}
                          onChange={(item) => setTipePerusahaan(item)}
                          options={options}
                          noOptionsMessage={() => "Data not found"}
                          styles={customeStyles}
                          placeholder="Pilih Tipe Perusahaan..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                        <Select
                          value={kota}
                          onChange={(item) => setKota(item)}
                          options={optionKota}
                          noOptionsMessage={() => "Kota not found"}
                          styles={customeStyles}
                          placeholder="Pilih Kota..."
                          required
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-36">
                          NPWP
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          maxLength={20}
                          type="text"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                          value={npwp}
                          onChange={(e) => formatNpwp(e.target.value)}
                        />
                        {statusPajak.value === "01" ? (
                          <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          onChange={(e) => setNoTelpKantor(e.target.value)}
                          type="text"
                          name=""
                          id=""
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div>Hari</div>
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                          className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
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
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-44">
                          Pengembalian Barang
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className=" w-full"
                              value={pengembalianBarang}
                              onChange={onChangePengembalianBarang}
                            />
                          </DemoContainer>
                        </LocalizationProvider>

                        <div className="absolute right-[-20px] top-0">*)</div>
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
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          NPWP / Surat Keterangan Bebas Pajak
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={onChangeNpwpFile}
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          KTP Pemilik
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) => setKtpPemilikFIle(e.target.files[0])}
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          KTP Penanggung Jawab
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) =>
                            setKtpPenanggungJawabFile(e.target.files[0])
                          }
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Surat Pengukuhan Kena Pajak (SPKP)
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) => setSpkpFile(e.target.files[0])}
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Surat Ijin Usaha Perdagangan (SIUP)
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) => setSiupFile(e.target.files[0])}
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Nomor Induk Berusaha (NIB)
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) => setNibFile(e.target.files[0])}
                          accept="image/jpg,.pdf"
                          id="upload-npwp"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="whitespace-nowrap flex">
                        <label htmlFor="" className="w-72">
                          Screenshoot Rekening Perusahaan
                        </label>
                        <div>:</div>
                      </div>
                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) =>
                            setSsPerusahaanFile(e.target.files[0])
                          }
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                        <div className="absolute right-[-20px] top-0">*)</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-3">
                      <div className="flex flex-col">
                        <div className="whitespace-nowrap flex">
                          <label htmlFor="" className="w-[17.5rem]">
                            Sertifikasi BPOM
                          </label>
                        </div>
                        <div className="flex gap-1 items-center text-[12px]">
                          <div>
                            <PiWarningCircleLight />
                          </div>
                          <div>Untuk supplier makanan & minuman</div>
                        </div>
                      </div>

                      <div>:</div>

                      <div className="w-1/2 relative">
                        <input
                          type="file"
                          onChange={(e) => setSertifBpomFile(e.target.files[0])}
                          id="upload-npwp"
                          accept="image/jpg,.pdf"
                          className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                        />
                      </div>
                    </div>
                  </form>
                  <div className="flex gap-2 mt-20">
                    <div>
                      <Checkbox />
                    </div>
                    <div className="w-[500px] text-[12px]">
                      Kami, yang bertanda tangan dibawah ini menyatakan telah
                      mengisi dengan sebenar-benarnya dan menyatakan
                      telahmematuhi segala bentuk UU dan peraturan yang dibuat
                      oleh Pemerintah Republik Indonesia, dalam lingkup usaha
                      kami yang kami jalakan selama menajadi supplier/vendor
                      aktif kepada PT Karya Prima Unggulan
                    </div>
                  </div>
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
                  <Link to="/profile">
                    <button
                      onClick={handleNext}
                      className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                    >
                      Finish
                    </button>
                  </Link>
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
                              <label htmlFor="" className="w-36">
                                Tipe Perusahaan *
                              </label>
                            </div>
                            <div className="w-full whitespace-nowrap">
                              <Select
                                value={tipePerusahaan}
                                onChange={(item) => setTipePerusahaan(item)}
                                options={options}
                                noOptionsMessage={() => "Data not found"}
                                styles={customeStyles}
                                placeholder="Pilih Tipe Perusahaan..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Nama Perusahaan *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Alamat *
                              </label>
                            </div>
                            <div>
                              <textarea
                                rows={5}
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                name=""
                                id=""
                                className="w-full border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Provinsi *
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
                              <label htmlFor="" className="w-36">
                                Kota *
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <Select
                                value={kota}
                                onChange={(item) => setKota(item)}
                                options={optionKota}
                                noOptionsMessage={() => "Kota not found"}
                                styles={customeStyles}
                                placeholder="Pilih Kota..."
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Kode Pos *
                              </label>
                            </div>
                            <div className="">
                              <input
                                value={kodePos}
                                onChange={(e) => setKodePos(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Tipe Pembelian *
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
                              <label htmlFor="" className="w-36">
                                Status Pajak *
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
                            <div className="whitespace-nowrap flex">
                              {statusPajak.value === "01" ? (
                                <label htmlFor="" className="w-36">
                                  NPWP *
                                </label>
                              ) : (
                                <label htmlFor="" className="w-36">
                                  NPWP
                                </label>
                              )}
                            </div>
                            <div className=" relative">
                              <input
                                type="text"
                                pattern="[0-9]*"
                                maxLength={20}
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Nama Pemilik Perusahaan *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Nama Penanggung Jawab *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Jabatan Penanggung Jawab *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                No Telp Kantor *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="font-semibold underline mt-10">
                            Kontak Korespondensi Notifikasi
                          </div>
                          <div className="flex flex-col gap-2 mb-3 mt-2">
                            <div className="flex">
                              <label htmlFor="" className="w-72">
                                No Whatsapp Purchase Order (PO) *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Nama Kontak *
                              </label>
                            </div>
                            <div className=" whitespace-nowrap">
                              <input
                                value={namaKontak}
                                onChange={(e) => setNamaKontak(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                              <label htmlFor="" className="w-36">
                                No Whatsapp Keuangan *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                              <label htmlFor="" className="w-36">
                                Nama Kontak *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-36">
                                Jabatan
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
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
                              <label htmlFor="" className="w-44">
                                Term Pembayaran *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                              <div>Hari</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Bank *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                No. Rekening Bank *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                value={nomorRekening}
                                onChange={(e) => setRekening(e.target.value)}
                                type="text"
                                name=""
                                id=""
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 flex-col  mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Nama Rekening Bank *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Kantor Cabang Bank *
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
                                className="w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Metode Pengiriman *
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
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="whitespace-nowrap flex">
                              <label htmlFor="" className="w-44">
                                Pengembalian Barang *
                              </label>
                            </div>
                            <div className=" relative">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    className=" w-full"
                                    value={pengembalianBarang}
                                    onChange={(newValue) =>
                                      setPengembalianBarang(newValue)
                                    }
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
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
                            <div className=" flex">
                              <label htmlFor="" className="w-[19rem]">
                                NPWP / Surat Keterangan Bebas Pajak *
                              </label>
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
                            <div className=" flex">
                              <label htmlFor="" className="w-72">
                                KTP Pemilik *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) =>
                                  setKtpPemilikFIle(e.target.files[0])
                                }
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex">
                              <label htmlFor="" className="w-72">
                                KTP Penanggung Jawab *
                              </label>
                            </div>
                            <div className=" relative">
                              <input
                                type="file"
                                onChange={(e) =>
                                  setKtpPenanggungJawabFile(e.target.files[0])
                                }
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className=" flex">
                              <label htmlFor="" className="">
                                Surat Pengukuhan Kena Pajak (SPKP) *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) => setSpkpFile(e.target.files[0])}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mb-3">
                            <div className=" flex">
                              <label htmlFor="" className="">
                                Surat Ijin Usaha Perdagangan (SIUP) *
                              </label>
                              <div>:</div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) => setSiupFile(e.target.files[0])}
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className="flex">
                              <label htmlFor="" className="">
                                Nomor Induk Berusaha (NIB) *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) => setNibFile(e.target.files[0])}
                                accept="image/jpg,.pdf"
                                id="upload-npwp"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2  mb-3">
                            <div className=" flex">
                              <label htmlFor="" className="">
                                Screenshoot Rekening Perusahaan *
                              </label>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(e) =>
                                  setSsPerusahaanFile(e.target.files[0])
                                }
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
                                onChange={(e) =>
                                  setSertifBpomFile(e.target.files[0])
                                }
                                id="upload-npwp"
                                accept="image/jpg,.pdf"
                                className=" w-full h-[36px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                              />
                            </div>
                          </div>
                        </form>
                        <div className="flex gap-2 mt-20">
                          <div>
                            <Checkbox />
                          </div>
                          <div className="w-[500px] text-[12px]">
                            Kami, yang bertanda tangan dibawah ini menyatakan
                            telah mengisi dengan sebenar-benarnya dan menyatakan
                            telahmematuhi segala bentuk UU dan peraturan yang
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
                                <Link to="/profile">
                                  <button
                                    onClick={handleNext}
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                  >
                                    Finish
                                  </button>
                                </Link>
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
                                <Link to="/profile">
                                  <button
                                    onClick={handleNext}
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                  >
                                    Finish
                                  </button>
                                </Link>
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
    </div>
  );
};

export default Registration;
