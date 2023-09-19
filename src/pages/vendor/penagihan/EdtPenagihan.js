import { BsBuildings } from "react-icons/bs";
import { useStateContext } from "../../../contexts/ContextProvider";
import Admin from "../../../layouts/Admin";
import { MdPayments } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
  Box,
  Button,
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
import { Link } from "react-router-dom";
import Select from "react-select";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const optionsTipePenagihan = [
  { value: 0, label: "Beli Putus", key: 0 },
  { value: 1, label: "Konsinyasi", key: 1 },
];
const optionsDeliveryArea = [
  { value: 0, label: "Tangerang", key: 0 },
  { value: 1, label: "Jakarta", key: 1 },
  { value: 2, label: "Bali", key: 2 },
  { value: 3, label: "Makassar", key: 3 },
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
const EdtPenagihan = () => {
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

  const inputTanggalInvoice = [
    {
      value: dayjs(new Date()),
    },
  ];
  const { screenSize } = useStateContext();
  const [activeStep, setActiveStep] = useState(0);

  const [tipePenagihan, setTipePenagihan] = useState({
    value: 0,
    label: "Beli Putus",
    key: 0,
  });
  const [nomerPo, setNomerPo] = useState();
  const [tanggalPo, setTanggalPo] = useState();
  const [tanggalInvoice, setTanggalInvoice] = useState();
  const [tanggalInvoice2, setTanggalInvoice2] = useState(inputTanggalInvoice);
  const [nomerDo, setNomerDo] = useState();
  const [deliveryArea, setDeliveryArea] = useState({
    value: 0,
    label: "Tangerang",
    key: 0,
  });
  const [nomerInvoice, setNomerInvoice] = useState(inputArr);
  const [nilaiInvoice, setNilaiInvoice] = useState(inputNilaiInvoice);
  const [invoiceFile, setInvoiceFile] = useState([{ type: "file" }]);
  const [fakturPajakFile, setFakturPajakFile] = useState([{ type: "file" }]);
  const [tipePengiriman, setTipePengiriman] = useState({
    value: 0,
    label: "Drop Box Gudang PT KPU",
    key: 0,
  });
  const [, setResiFile] = useState(undefined);
  const [isPajak, setIsPajak] = useState({ value: 0, label: "Ya", key: 0 });
  const [nomerSeriFakturPajak, setNomerSeriFakturPajak] = useState();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
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
    setTanggalPo(dayjs(new Date()));
    setTanggalInvoice(dayjs(new Date()));

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

  const onChangeTanggalInvoice = (value) => {
    setTanggalPo(value);
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
      newArr[index].value = e.target.value;

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
      setNomerSeriFakturPajak("");
    }
    setIsPajak(item);
  };

  const onChangeInvoiceFile = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setInvoiceFile((s) => {
      const newArr = s.slice();
      newArr[index] = e.target.files[0];

      return newArr;
    });
  };

  const onChangeFakturPajakFile = (e) => {
    e.preventDefault();

    const index = e.target.id;
    setFakturPajakFile((s) => {
      const newArr = s.slice();
      newArr[index] = e.target.files[0];

      return newArr;
    });
  };

  const onChangeTipePengiriman = (item) => {
    if (item.value !== 1) {
      setResiFile(undefined);
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

      setTanggalInvoice2((s) => {
        return [
          ...s,
          {
            value: dayjs(new Date()),
          },
        ];
      });
    }
  };

  const addInvoiceFile = () => {
    if (invoiceFile.length < 5) {
      setInvoiceFile((s) => {
        return [...s, { type: "file" }];
      });
    }
  };

  const addFakturPajakFile = () => {
    if (fakturPajakFile.length < 5) {
      setFakturPajakFile((s) => {
        return [...s, { type: "file" }];
      });
    }
  };

  const formatFakturPajak = (value) => {
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
      setNomerSeriFakturPajak(nilai);
    } catch (err) {
      return "";
    }
  };

  const steps = ["Tipe Penagihan", "Billing", "Dokumen"];
  return (
    <Admin>
      <div
        className={`${
          screenSize < 768 ? "px-5 pt-20" : "px-10"
        } pt-20 font-roboto `}
      >
        Edit Penagihan
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
                                  className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] "
                                />
                              </div>
                              <div>*)</div>
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
                              <div>*)</div>
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
                                  className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                />
                              </div>
                              <div>*)</div>
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
                              <div>*)</div>
                            </div>
                          </div>
                          <div className="mb-3">
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
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-[250px]">Tanggal Invoice</div>
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
                                      value={tanggalInvoice}
                                      onChange={onChangeTanggalInvoice}
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
                          <div className="mb-3">
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
                                      className="max-[821px]:w-[208px] w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
                            ))}
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
                                <div className="flex items-center gap-1">
                                  <input
                                    maxLength={19}
                                    disabled={
                                      isPajak.label === "Tidak" ? true : false
                                    }
                                    type="text"
                                    name=""
                                    id=""
                                    value={nomerSeriFakturPajak}
                                    onChange={(e) =>
                                      formatFakturPajak(e.target.value)
                                    }
                                    className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                  />
                                  <div>*)</div>
                                </div>
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                />
                              </div>
                            </div>
                          </div>
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
                                  className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] "
                                />
                              </div>
                              <div>*)</div>
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
                              <div>*)</div>
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
                              <div>*)</div>
                            </div>
                          </div>
                          <div className="mb-3">
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

                          <div className="mb-3">
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
                                <div className="flex">
                                  <div className="w-[24px]"></div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="w-full bg-[#fff2cc]"
                                        value={tanggalInvoice}
                                        onChange={(item) =>
                                          setTanggalInvoice(item)
                                        }
                                        slotProps={{
                                          textField: { size: "small" },
                                        }}
                                      />
                                    </DemoContainer>
                                  </LocalizationProvider>
                                </div>
                              </div>
                              <div className="ps-10 flex items-center gap-2">
                                <div className="w-[210px]">Sampai Tanggal</div>
                                <div>:</div>
                                <div className="flex">
                                  <div className="w-[24px]"></div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="w-full bg-[#fff2cc]"
                                        value={tanggalInvoice}
                                        onChange={(item) =>
                                          setTanggalInvoice(item)
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
                                <div className="flex items-center gap-1">
                                  <input
                                    maxLength={19}
                                    disabled={
                                      isPajak.label === "Tidak" ? true : false
                                    }
                                    type="text"
                                    name=""
                                    id=""
                                    value={nomerSeriFakturPajak}
                                    onChange={(e) =>
                                      formatFakturPajak(e.target.value)
                                    }
                                    className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                  />
                                  <div>*)</div>
                                </div>
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                />
                                <input
                                  maxLength={19}
                                  disabled={
                                    isPajak.label === "Tidak" ? true : false
                                  }
                                  type="text"
                                  name=""
                                  id=""
                                  value={nomerSeriFakturPajak}
                                  onChange={(e) =>
                                    formatFakturPajak(e.target.value)
                                  }
                                  className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                />
                              </div>
                            </div>
                          </div>
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                            </div>
                            <div className="mb-10">
                              {invoiceFile.map((item, i) => (
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
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeInvoiceFile}
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addInvoiceFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceFile.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="w-[350px]">
                                Kwitansi Penagihan bermeterai
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                            </div>
                            <div className="mb-10">
                              {fakturPajakFile.map((item, i) => (
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
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeFakturPajakFile}
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addFakturPajakFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceFile.length === 5
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                <div className="flex items-center gap-1">
                                  <div className="w-[307.2px]">
                                    <Select
                                      value={tipePengiriman}
                                      onChange={onChangeTipePengiriman}
                                      className="whitespace-nowrap"
                                      options={optionsTipePengiriman}
                                      noOptionsMessage={() => "Data not found"}
                                      styles={customeStyles}
                                      required
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-[350px]">
                                  Resi Bukti Pengiriman
                                </div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div>
                                    <input
                                      disabled={
                                        tipePengiriman.value === 1
                                          ? false
                                          : true
                                      }
                                      type="file"
                                      id="upload-npwp"
                                      accept="image/jpg,.pdf"
                                      className=" w-[307.2px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-[350px]">Purchase Order</div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                            </div>
                            <div className="mb-10">
                              {invoiceFile.map((item, i) => (
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
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeInvoiceFile}
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addInvoiceFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceFile.length === 5
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                                } `}
                              >
                                Add row
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mb-10">
                              <div className="w-[350px]">
                                Kwitansi Penagihan bermeterai
                              </div>
                              <div>:</div>
                              <div className="flex items-center gap-1">
                                <div>
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                  />
                                </div>
                                <div>*)</div>
                              </div>
                            </div>
                            <div className="mb-10">
                              {fakturPajakFile.map((item, i) => (
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
                                        <input
                                          type="file"
                                          id={i}
                                          onChange={onChangeFakturPajakFile}
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div
                                onClick={addFakturPajakFile}
                                className={`py-1 px-4 rounded-sm shadow-sm text-white bg-[#305496] w-fit ${
                                  invoiceFile.length === 5
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
                                  <input
                                    type="file"
                                    id="upload-npwp"
                                    accept="image/jpg,.pdf"
                                    className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                <div className="flex items-center gap-1">
                                  <div className="w-[307.2px]">
                                    <Select
                                      value={tipePengiriman}
                                      onChange={onChangeTipePengiriman}
                                      className="whitespace-nowrap"
                                      options={optionsTipePengiriman}
                                      noOptionsMessage={() => "Data not found"}
                                      styles={customeStyles}
                                      required
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-[350px]">
                                  Resi Bukti Pengiriman
                                </div>
                                <div>:</div>
                                <div className="flex items-center gap-1">
                                  <div>
                                    <input
                                      disabled={
                                        tipePengiriman.value === 1
                                          ? false
                                          : true
                                      }
                                      type="file"
                                      id="upload-npwp"
                                      accept="image/jpg,.pdf"
                                      className=" w-[307.2px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  <div>*)</div>
                                </div>
                              </div>
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
                    className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 ${
                      activeStep === 0 ? "hidden" : "block"
                    } `}
                  >
                    Save as draft
                  </button>

                  {activeStep === steps.length - 1 ? (
                    <Link to="/profile">
                      <button
                        onClick={handleNext}
                        className={`bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]`}
                      >
                        Submit
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
                                  <div>No Purchase Order (PO) *) :</div>
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
                                        className="w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>Tanggal PO *) : </div>

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
                                  <div>No Delivery Order (DO) *) : </div>

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
                                        className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] "
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-10">
                                  <div>Delivery Area *) : </div>

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
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>Tanggal Invoice *) : </div>

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
                                            value={tanggalInvoice}
                                            onChange={onChangeTanggalInvoice}
                                            slotProps={{
                                              textField: { size: "small" },
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
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
                                            className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7]"
                                          />
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
                                        <div className="flex items-center gap-1">
                                          <input
                                            maxLength={19}
                                            disabled={
                                              isPajak.label === "Tidak"
                                                ? true
                                                : false
                                            }
                                            type="text"
                                            name=""
                                            id=""
                                            value={nomerSeriFakturPajak}
                                            onChange={(e) =>
                                              formatFakturPajak(e.target.value)
                                            }
                                            className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#ddebf7] disabled:bg-gray-300`}
                                          />
                                          <div>*)</div>
                                        </div>
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#ddebf7] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#ddebf7] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#ddebf7] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#ddebf7] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>No Purchase Order (PO) *) :</div>
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
                                        className="w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-3">
                                  <div>Tanggal PO *) : </div>

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
                                  <div>Delivery Area *) : </div>

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
                                              className="max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc]"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 mb-3">
                                        <div>Tanggal Invoice *) : </div>

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
                                                  onChange={
                                                    onChangeTanggalInvoice2
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

                                <div className="mb-3">
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
                                            value={tanggalInvoice}
                                            onChange={(item) =>
                                              setTanggalInvoice(item)
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
                                            value={tanggalInvoice}
                                            onChange={(item) =>
                                              setTanggalInvoice(item)
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
                                        <div className="flex items-center gap-1">
                                          <input
                                            maxLength={19}
                                            disabled={
                                              isPajak.label === "Tidak"
                                                ? true
                                                : false
                                            }
                                            type="text"
                                            name=""
                                            id=""
                                            value={nomerSeriFakturPajak}
                                            onChange={(e) =>
                                              formatFakturPajak(e.target.value)
                                            }
                                            className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] bg-[#fff2cc] disabled:bg-gray-300`}
                                          />
                                          <div>*)</div>
                                        </div>
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#fff2cc] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#fff2cc] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#fff2cc] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                        <input
                                          maxLength={19}
                                          disabled={
                                            isPajak.label === "Tidak"
                                              ? true
                                              : false
                                          }
                                          type="text"
                                          name=""
                                          id=""
                                          value={nomerSeriFakturPajak}
                                          onChange={(e) =>
                                            formatFakturPajak(e.target.value)
                                          }
                                          className={`max-[821px]:w-full w-[246.4px] h-[40px] border border-slate-300 rounded-sm bg-[#fff2cc] focus:border focus:border-[#0077b6] disabled:bg-gray-300`}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
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
                                  Save as draft
                                </button>

                                <button
                                  onClick={handleNext}
                                  className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                >
                                  {activeStep === steps.length - 1
                                    ? "Submit"
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
                                  Save as draft
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
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="">
                                      Delivery Order (DO) / Packing List (Surat
                                      Jalan) *) :
                                    </div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div className="">
                                      Invoice (Faktur penagihan) *) :
                                    </div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {invoiceFile.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div>Invoice Tambahan *) :</div>
                                          ) : (
                                            <div>
                                              Invoice Tambahan *) : {i + 1}
                                            </div>
                                          )}

                                          <div>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeInvoiceFile}
                                              accept="image/jpg,.pdf"
                                              className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addInvoiceFile}
                                      className={` flex justify-end ${
                                        invoiceFile.length === 5
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
                                    <div>Kwitansi Penagihan bermeterai</div>

                                    <div className="w-full">
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Faktur Pajak *)</div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {fakturPajakFile.map((item, i) => (
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
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeFakturPajakFile}
                                              accept="image/jpg,.pdf"
                                              className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addInvoiceFile}
                                      className={` flex justify-end ${
                                        invoiceFile.length === 5
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
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                        <input
                                          disabled={
                                            tipePengiriman.value === 1
                                              ? false
                                              : true
                                          }
                                          type="file"
                                          id="upload-npwp"
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Purchase Order *) :</div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>
                                      Delivery Order (DO) / Packing List (Surat
                                      Jalan) *) :
                                    </div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Invoice (Faktur Penagihan) *) :</div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {invoiceFile.map((item, i) => (
                                      <div key={i}>
                                        <div className="flex flex-col gap-3 mb-3">
                                          {i === 0 ? (
                                            <div>Invoice Tambahan</div>
                                          ) : (
                                            <div>Invoice Tambahan {i + 1}</div>
                                          )}

                                          <div>
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeInvoiceFile}
                                              accept="image/jpg,.pdf"
                                              className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addInvoiceFile}
                                      className={`flex justify-end ${
                                        invoiceFile.length === 5
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
                                    <div>
                                      Kwitansi Penagihan bermeterai *) :
                                    </div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-3 mb-3">
                                    <div>Faktur Pajak *) :</div>

                                    <div>
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-10">
                                    {fakturPajakFile.map((item, i) => (
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
                                            <input
                                              type="file"
                                              id={i}
                                              onChange={onChangeFakturPajakFile}
                                              accept="image/jpg,.pdf"
                                              className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div
                                      onClick={addFakturPajakFile}
                                      className={`flex justify-end ${
                                        invoiceFile.length === 5
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
                                      <input
                                        type="file"
                                        id="upload-npwp"
                                        accept="image/jpg,.pdf"
                                        className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                                        <input
                                          disabled={
                                            tipePengiriman.value === 1
                                              ? false
                                              : true
                                          }
                                          type="file"
                                          id="upload-npwp"
                                          accept="image/jpg,.pdf"
                                          className=" w-full h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </form>
                            <div className="flex max-[348px]:flex-col max-[348px]:gap-2 mt-24 justify-between">
                              {screenSize > 348 ? (
                                <>
                                  <button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={`ms-2 border border-[#00b4d8] px-10 py-2 hover:bg-slate-200 text-[10px] whitespace-nowrap ${
                                      activeStep === 0 && "cursor-not-allowed"
                                    } `}
                                  >
                                    Save as draft
                                  </button>

                                  <button
                                    onClick={handleNext}
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8] text-[10px]"
                                  >
                                    {activeStep === steps.length - 1
                                      ? "Submit"
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
                                    Save as draft
                                  </button>

                                  <button
                                    onClick={handleNext}
                                    className="bg-[#0077b6] text-white py-2 px-10 rounded-sm shadow-sm hover:bg-[#00b4d8]"
                                  >
                                    {activeStep === steps.length - 1
                                      ? "Submit"
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
    </Admin>
  );
};

export default EdtPenagihan;
