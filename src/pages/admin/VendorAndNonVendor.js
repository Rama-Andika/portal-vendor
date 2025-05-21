import { useStateContext } from "../../contexts/ContextProvider";
import { Backdrop, Fade, Modal, Pagination } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useRef, useState } from "react";
import { CgDanger } from "react-icons/cg";
import dayjs from "dayjs";
import accountingNumber from "../../components/functions/AccountingNumber";
import ReactSelect from "react-select";
import isEmpty from "../../components/functions/CheckEmptyObject";
import { RiFileExcel2Line } from "react-icons/ri";
import Select from "../../components/form/Select";
import ButtonSearch from "../../components/button/ButtonSearch";
import { toast } from "sonner";

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const VendorAndNonVendor = () => {
  const { screenSize } = useStateContext();
  const [payments, setPayments] = useState([]);
  const [srcAccountOptions, setSrcAccountOptions] = useState([]);
  const [optionPeriode, setOptionPeriode] = useState([]);
  const [optionVendor, setOptionVendor] = useState([]);

  // Ref
  const lastColumnRef = useRef(null);
  const firstColumnRef = useRef(null);
  const checkColumnRef = useRef(null);

  //Pagination
  const [page, setPage] = useState(1);
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  //End pagination

  const [checkBox, setCheckBox] = useState([]);
  // Search
  const [supplier, setSupplier] = useState("");
  const [number, setNumber] = useState("");
  const [srcAccount, setSrcAccount] = useState({
    value: "0",
    label: "All",
  });
  const [srcPeriode, setSrcPeriode] = useState({
    value: "0",
    label: "All",
  });
  const [srcVendor, setSrcVendor] = useState({
    value: "0",
    label: "All",
  });
  const [mcmReff, setMcmReff] = useState("0");
  const [paymentDateIsBlank, setPaymentDateIsBlank] = useState("0");
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [ignoreDate, setIgnoreDate] = useState(1);
  const [srcStatus, setSrcStatus] = useState("0");

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [memoDetail, setMemoDetail] = useState("");
  // eslint-disable-next-line no-unused-vars

  const [outStandingDate, setOutStandingDate] = useState([]);
  const [mcmReffNo, setMcmReffNo] = useState([]);
  const [rate, setRate] = useState([]);
  const [term, SetTerm] = useState([]);
  const [paymentDate, setPaymentDate] = useState([]);
  const [mcmDate, setMcmDate] = useState([]);
  const [status, setStatus] = useState([]);
  const [idrCurrency, setIdrCurrency] = useState([]);

  const [isError, setisError] = useState([]);

  // eslint-disable-next-line no-new-object
  const fetchData = async (parameter = new Object()) => {
    await fetch(`${api}api/portal-vendor/payment-monitor/vendor-non-vendor`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          setTotal(res.total);
          setCount(Math.ceil(res.total / res.limit));
          setLimit(res.limit);
          setPayments(res.data);

          const check = res.data.map((item) => ({
            id: item.bankpo_payment_id,
            value: item.status_settle === "Paid" ? true : false,
          }));
          setCheckBox(check);

          const listOutStandingDate = res.data.map((item) => {
            let date = dayjs(item.tanggal_tt);
            let outstanding_date = date.subtract(3, "day");
            return { id: item.bankpo_payment_id, value: outstanding_date };
          });

          const listMcmReffNo = res.data.map((item) => {
            return item.mcm_reff_no !== null
              ? { id: item.bankpo_payment_id, value: item.mcm_reff_no }
              : { id: 0, value: item.mcm_reff_no };
          });

          const listRate = res.data.map((item) => {
            return item.rate.trim().length > 0
              ? { id: item.bankpo_payment_id, value: item.rate }
              : { id: item.bankpo_payment_id, value: "1" };
          });

          const listTerm = res.data.map((item) => {
            return item?.term
              ? { id: item.bankpo_payment_id, value: item.term }
              : { id: 0, value: "" };
          });

          const listMcmDate = res.data.map((item) => {
            return item.mcm_date.length > 0
              ? { id: item.bankpo_payment_id, value: dayjs(item.mcm_date) }
              : { id: 0, value: undefined };
          });

          const listPaymentDate = res.data.map((item) => {
            return item.payment_date.length > 0
              ? { id: item.bankpo_payment_id, value: dayjs(item.payment_date) }
              : { id: 0, value: undefined };
          });

          const listStatus = listOutStandingDate.map((item, i) => {
            let status;
            const outstandingDate = dayjs(item.value).format("YYYY-MM-DD");
            const datePayment =
              item.id === listPaymentDate[i].id
                ? dayjs(listPaymentDate[i].value).format("YYYY-MM-DD")
                : undefined;

            if (datePayment) {
              if (outstandingDate < datePayment) {
                status = "Late";
              } else {
                status = "On time";
              }
            }

            return { id: item.id, value: status };
          });

          const listIdr = res.data.map((item, i) => {
            let idr;
            if (item.currency === "Rp.") {
              idr = item.ori_currency;
            } else {
              idr = parseFloat(item.ori_currency) * parseInt(item.rate);
            }

            return { id: item.bankpo_payment_id, value: idr };
          });

          setIdrCurrency(listIdr);
          setStatus(listStatus);
          setMcmReffNo(listMcmReffNo);
          setMcmDate(listMcmDate);
          setPaymentDate(listPaymentDate);
          setRate(listRate);
          SetTerm(listTerm);

          setOutStandingDate(listOutStandingDate);
        } else {
          setPayments([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // eslint-disable-next-line no-new-object
  const fetchCoa = async (parameter = new Object()) => {
    await fetch(`${api}api/portal-vendor/list/coa`, {
      method: "POST",
      body: JSON.stringify({
        header: "cash in bank",
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          const options = data.map((item, i) => {
            let object = [];
            object[i + 1] = { value: item.id, label: item.name };
            // eslint-disable-next-line array-callback-return
            item.child.map((children, index) => {
              object[index + 2] = { value: children.id, label: children.name };
            });

            return object;
          });
          options[0][0] = { value: "0", label: "All" };

          setSrcAccountOptions(options[0]);
        } else {
        }
      });
  };

  const fetchPeriode = async (parameter = new Object()) => {
    await fetch(`${api}api/portal-vendor/list/periode`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          const optionPeriodeCopy = data.map((d) => ({
            value: d.id,
            label: d.name,
          }));
          optionPeriodeCopy.unshift({ value: "0", label: "All" });

          setOptionPeriode(optionPeriodeCopy);
        }
      });
  };

  const fetchVendor = async (parameter = new Object()) => {
    await fetch(`${api}api/portal-vendor/list/oxyvendor`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        const data = res.data;
        if (data.length > 0) {
          const optionVendorCopy = data.map((d) => ({
            value: d.id,
            label: d.name,
          }));
          optionVendorCopy.unshift({ value: "0", label: "All" });

          setOptionVendor(optionVendorCopy);
        }
      });
  };

  const customeStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
    }),
    menu: (baseStyles, state) => ({
      ...baseStyles,
      zIndex: 9999,
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected
        ? "#569cb8"
        : state.isFocused && "#caf0f8",
    }),
  };

  // const fetchDataMore = async (parameter = { start: 0 }) => {
  //   parameter["record_size"] = start + limit;

  //   await fetch(`${api}api/portal-vendor/payment-monitor/vendor-non-vendor`, {
  //     method: "POST",
  //     body: JSON.stringify(parameter),
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       if (res.data.length > 0) {
  //         res.data.length >= total ? setHasMore(false) : setHasMore(true);
  //         setStart((prev) => prev + limit);
  //         setPayments(res.data);

  //         const listOutStandingDate = res.data.map((item) => {
  //           let date = dayjs(item.tanggal_tt).add(item.term, "day");
  //           let outstanding_date = date.subtract(7, "day");
  //           return outstanding_date;
  //         });

  //         const listMcmReffNo = res.data.map((item) => {
  //           return item.mcm_reff_no;
  //         });

  //         const listRate = res.data.map((item) => {
  //           return item.rate;
  //         });

  //         const listMcmDate = res.data.map((item) => {
  //           return item.mcm_date.length > 0 ? dayjs(item.mcm_date) : undefined;
  //         });

  //         const listPaymentDate = res.data.map((item) => {
  //           return item.payment_date.length > 0
  //             ? dayjs(item.payment_date)
  //             : undefined;
  //         });

  //         const listStatus = listOutStandingDate.map((item, i) => {
  //           let status;
  //           const outstandingDate = dayjs(item).format("YYYY-MM-DD");
  //           const datePayment = dayjs(listPaymentDate[i]).format("YYYY-MM-DD");
  //           if (outstandingDate < datePayment) {
  //             status = "Late";
  //           } else {
  //             status = "Ontime";
  //           }

  //           return status;
  //         });

  //         const listIdr = res.data.map((item, i) => {
  //           let idr;
  //           if (item.currency === "Rp.") {
  //             idr = item.ori_currency;
  //           } else {
  //             idr = parseFloat(item.ori_currency) * parseInt(item.rate);
  //           }

  //           return idr;
  //         });

  //         setIdrCurrency(listIdr);

  //         setStatus(listStatus);
  //         setMcmReffNo(listMcmReffNo);
  //         setMcmDate(listMcmDate);
  //         setPaymentDate(listPaymentDate);
  //         setRate(listRate);

  //         setOutStandingDate(listOutStandingDate);
  //       } else {
  //         setPayments([]);
  //         setHasMore(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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

    if (number.trim().length > 0) {
      parameter["number"] = number;
    }
    if (srcStatus !== "0") {
      parameter["status"] = srcStatus;
    }
    if (!isEmpty(srcVendor) && srcVendor.value !== "0") {
      parameter["vendorId"] = srcVendor.value;
    }

    if (mcmReff !== "0") {
      parameter["mcm_is_blank"] = mcmReff;
    }

    if (paymentDateIsBlank !== "0") {
      parameter["payment_date_is_blank"] = paymentDateIsBlank;
    }

    if (!isEmpty(srcAccount) && srcAccount.value !== "0") {
      parameter["coa_id"] = srcAccount.value;
    }

    if (!isEmpty(srcPeriode) && srcPeriode.value !== "0") {
      parameter["periodeId"] = srcPeriode.value;
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD");
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  const onChangePaymentDate = (value, index, item) => {
    const listOutStandingDate = outStandingDate.filter(
      (d) => d.id === item.bankpo_payment_id
    );
    const outstdDate = dayjs(listOutStandingDate[0].value).format("YYYY-MM-DD");
    const datePayment = dayjs(value).format("YYYY-MM-DD");

    let status;
    if (outstdDate < datePayment) {
      status = "Late";
    } else {
      status = "On time";
    }

    setStatus((prevItems) =>
      prevItems.map((p) =>
        p.id === item.bankpo_payment_id ? { ...p, value: status } : p
      )
    );

    const checkIfMcmDateExists = paymentDate.some(
      (m) => m.id === item.bankpo_payment_id
    );
    if (!checkIfMcmDateExists) {
      setPaymentDate((prevItems) =>
        prevItems.map((p) =>
          p.id === 0 ? { ...p, id: item.bankpo_payment_id, value: value } : p
        )
      );
    } else {
      setPaymentDate((prevItems) =>
        prevItems.map((p) =>
          p.id === item.bankpo_payment_id ? { ...p, value: dayjs(value) } : p
        )
      );
    }
  };

  const onChangeMcmDate = (value, index, item) => {
    const checkIfMcmDateExists = mcmDate.some(
      (m) => m.id === item.bankpo_payment_id
    );
    if (!checkIfMcmDateExists) {
      setMcmDate((prevItems) =>
        prevItems.map((p) =>
          p.id === 0 ? { ...p, id: item.bankpo_payment_id, value: value } : p
        )
      );
    } else {
      setMcmDate((prevItems) =>
        prevItems.map((p) =>
          p.id === item.bankpo_payment_id ? { ...p, value: value } : p
        )
      );
    }
  };

  const onChangeMcmReff = (e, index, item) => {
    const value = e.target.value;
    const checkIfMcmRefNoExists = mcmReffNo.some(
      (m) => m.id === item.bankpo_payment_id
    );
    if (!checkIfMcmRefNoExists) {
      setMcmReffNo((prevItems) =>
        prevItems.map((p) =>
          p.id === 0 ? { ...p, id: item.bankpo_payment_id, value: value } : p
        )
      );
    } else {
      setMcmReffNo((prevItems) =>
        prevItems.map((p) =>
          p.id === item.bankpo_payment_id ? { ...p, value: value } : p
        )
      );
    }
  };

  const onChangeRate = (e, index, item) => {
    const value = e.target.value;

    if (item.currency !== "Rp.") {
      setIdrCurrency((prevItems) =>
        prevItems.map((p) =>
          p.id === item.bankpo_payment_id
            ? { ...p, value: item.ori_currency * value }
            : p
        )
      );
    }

    const rateCopy = rate.map((prevItems) =>
      prevItems.map((p) =>
        p.id === item.bankpo_payment_id ? { ...p, value: value } : p
      )
    );
    setRate(rateCopy);
  };

  const onChangeTerm = (e, index, item) => {
    const value = e.target.value;
    const outStandingDateCopy = [...outStandingDate];
    let date = dayjs(item.tanggal_tt).add(parseInt(value), "day");
    let outstanding_date = date.subtract(3, "day");
    outStandingDateCopy[index].id = item.bankpo_payment_id;
    outStandingDateCopy[index].value = outstanding_date;
    setOutStandingDate(outStandingDateCopy);

    const termCopy = [...term];
    termCopy[index].id = item.bankpo_payment_id;
    termCopy[index].value = value;
    SetTerm(termCopy);
  };

  // const onChangeTerm = (e) => {
  //   e.target.validity.valid ? setTerm(e.target.value) : setTerm("");
  // };

  // const onChangeOriCurrency = (e) => {
  //   e.target.validity.valid
  //     ? setOriCurrency(e.target.value)
  //     : setOriCurrency("");
  // };

  // const onChangeIdrCurrency = (e) => {
  //   e.target.validity.valid
  //     ? setIdrCurrency(e.target.value)
  //     : setIdrCurrency("");
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
    fetchCoa();
    fetchPeriode();
    fetchVendor();
  }, []);

  // const onClickEdit = (index) => {
  //   handleOpen();
  // };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (!isEmpty(srcVendor) && srcVendor.value !== "0") {
      parameter["vendorId"] = srcVendor.value;
    }
    if (number.trim().length > 0) {
      parameter["number"] = number;
    }
    if (srcStatus !== "0") {
      parameter["status"] = srcStatus;
    }
    if (!isEmpty(srcAccount) && srcAccount.value !== "0") {
      parameter["coa_id"] = srcAccount.value;
    }
    if (!isEmpty(srcPeriode) && srcPeriode.value !== "0") {
      parameter["periodeId"] = srcPeriode.value;
    }
    if (mcmReff !== "0") {
      parameter["mcm_is_blank"] = mcmReff;
    }

    if (paymentDateIsBlank !== "0") {
      parameter["payment_date_is_blank"] = paymentDateIsBlank;
    }

    if (ignoreDate === 0) {
      parameter["start_date"] = dayjs(startDate).format("YYYY-MM-DD");
      parameter["end_date"] = dayjs(endDate).format("YYYY-MM-DD");
    }
    setStart(0);
    setPage(1);
    fetchData(parameter);
  };

  const onUpdate = (e) => {
    e.preventDefault();
    const isErrorCopy = [...isError];
    payments.map(async (item, i) => {
      if (
        item.status_settle !== "Paid" &&
        checkBox[i].id === item.bankpo_payment_id &&
        checkBox[i].value
      ) {
        if (
          mcmReffNo[i].value !== undefined &&
          mcmReffNo[i].value?.length > 0 &&
          mcmDate[i].value !== undefined
        ) {
          await fetch(`${api}api/portal-vendor/payment`, {
            method: "POST",
            body: JSON.stringify({
              id: item.id !== undefined ? item.id : 0,
              bankpo_payment_id: item.bankpo_payment_id,
              mcm_reff_no:
                item.bankpo_payment_id === mcmReffNo[i].id
                  ? mcmReffNo[i].value
                  : "",
              mcm_date:
                mcmDate[i].id === item.bankpo_payment_id
                  ? dayjs(mcmDate[i].value).format("YYYY-MM-DD HH:mm:ss")
                  : null,
              payment_date:
                paymentDate[i].id === item.bankpo_payment_id
                  ? dayjs(paymentDate[i].value).format("YYYY-MM-DD HH:mm:ss")
                  : null,
              status:
                item.bankpo_payment_id === status[i].id ? status[i].value : "",
              rate: item.bankpo_payment_id === rate[i].id ? rate[i].value : "",
              term: item.bankpo_payment_id === term[i].id ? term[i].value : "",
            }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.data !== 0) {
                isErrorCopy[i] = false;
                setisError(isErrorCopy);

                toast.success(`${mcmReffNo[i].value} success!`);

                document.getElementById("check_all").checked = false;
                setNumber("");
                setSupplier("");
                setMcmReff("0");
                const parameter = { start: start };
                fetchData(parameter);
              } else {
                isErrorCopy[i] = true;
                setisError(isErrorCopy);

                toast.error(`${mcmReffNo[i].value} failed!`);
              }
            })
            .catch((err) => {
              isErrorCopy[i] = true;
              setisError(isErrorCopy);
            });
        } else {
          toast.error(
            `${
              mcmReffNo[i].value !== undefined ? mcmReffNo[i].value : ""
            } failed!`
          );
          isErrorCopy[i] = true;
          setisError(isErrorCopy);
        }
      }
    });
  };

  const onChangeCheckedAll = () => {
    const checkAll = document.getElementById("check_all");
    let arr = [];
    if (checkAll.checked) {
      // eslint-disable-next-line array-callback-return
      arr = payments.map((item) => ({
        id: item.bankpo_payment_id,
        value: true,
      }));
    } else {
      // eslint-disable-next-line array-callback-return
      arr = payments.map((item) => ({
        id: item.bankpo_payment_id,
        value: item.tipe === "1" ? true : false,
      }));
    }
    setCheckBox(arr);
  };

  const onChangeChecked = (item, index) => {
    document.getElementById("check_all").checked = false;

    const arr = payments.map((item) => ({
      id: item.bankpo_payment_id,
      value: document.getElementsByName(`check_${item.bankpo_payment_id}`)[0]
        .checked,
    }));

    setCheckBox(arr);

    const arrChecked = arr.filter((item) => {
      return item.value === true;
    });

    if (arrChecked.length === payments.length) {
      document.getElementById("check_all").checked = true;
    }
  };

  const onChangeAccount = (item) => {
    setSrcAccount(item);
  };

  const onChangeStartDate = (value) => {
    setStartDate(value);
  };

  const onChangeEndDate = (value) => {
    setEndDate(value);
  };

  const onClickSeeDetailMemo = (memo) => {
    setMemoDetail(memo);
    handleOpen();
  };

  const onClickToFirstColumn = () => {
    firstColumnRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onClickToLastColumn = () => {
    lastColumnRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const onScroll = () => {
    if (lastColumnRef.current && checkColumnRef.current) {
      if (lastColumnRef.current === checkColumnRef.current) {
        console.log(true);
      }
    }
  };
  return (
    <div
      className={`${
        screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
      } font-roboto overflow-x-hidden `}
    >
      <div className="mb-20 max-[349px]:mb-5">Vendor</div>
      <div className="mb-5 w-[70%] max-[850px]:w-full">
        <div className="mb-5 text-slate-400">Searching Parameter</div>
        <div>
          <form onSubmit={(e) => onSearch(e)}>
            <div className="flex max-[557px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Vendor
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full">
                  <ReactSelect
                    value={srcVendor}
                    onChange={(value) => setSrcVendor(value)}
                    className="whitespace-nowrap"
                    options={optionVendor}
                    noOptionsMessage={() => "Data not found"}
                    styles={customeStyles}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    PR Number
                  </label>
                  <div className="hidden">:</div>
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    name=""
                    id=""
                    className="w-full h-[32px]  border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                  />
                </div>
              </div>
            </div>
            <div className="flex max-[557px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1 mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Period
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full">
                  <ReactSelect
                    value={srcPeriode}
                    onChange={(value) => setSrcPeriode(value)}
                    className="whitespace-nowrap"
                    options={optionPeriode}
                    noOptionsMessage={() => "Data not found"}
                    styles={customeStyles}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Payment Date
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="flex items-center gap-2">
                    <label htmlFor="all-mcm">All</label>
                    <input
                      name="mcm-reff"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="all-mcm"
                      value="0"
                      checked={paymentDateIsBlank === "0" ? true : false}
                      onChange={(e) => setPaymentDateIsBlank(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="blank">Blank</label>
                    <input
                      name="mcm-reff"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="blank"
                      value="1"
                      checked={paymentDateIsBlank === "1" ? true : false}
                      onChange={(e) => setPaymentDateIsBlank(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="not-blank">Not Blank</label>
                    <input
                      name="mcm-reff"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="not-blank"
                      value="2"
                      checked={paymentDateIsBlank === "2" ? true : false}
                      onChange={(e) => setPaymentDateIsBlank(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex max-[557px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1 mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Account
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full">
                  <ReactSelect
                    value={srcAccount}
                    onChange={onChangeAccount}
                    className="whitespace-nowrap"
                    options={srcAccountOptions}
                    noOptionsMessage={() => "Data not found"}
                    styles={customeStyles}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col  gap-1 mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Mcm Reff
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="flex items-center gap-2">
                    <label htmlFor="all-mcm">All</label>
                    <input
                      name="paymentDateBlank"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="all-mcm"
                      value="0"
                      checked={mcmReff === "0" ? true : false}
                      onChange={(e) => setMcmReff(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="blank">Blank</label>
                    <input
                      name="paymentDateBlank"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="blank"
                      value="1"
                      checked={mcmReff === "1" ? true : false}
                      onChange={(e) => setMcmReff(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="not-blank">Not Blank</label>
                    <input
                      name="paymentDateBlank"
                      className="checked:bg-[#0077b6] checked:ring-0 focus:ring-0"
                      type="radio"
                      id="not-blank"
                      value="2"
                      checked={mcmReff === "2" ? true : false}
                      onChange={(e) => setMcmReff(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex max-[557px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1 mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Status
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full">
                  <Select
                    value={srcStatus}
                    onChange={(e) => setSrcStatus(e.target.value)}
                  >
                    <option value="0">All</option>
                    <option value="Not Posted">Draft</option>
                    <option value="Posted">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Ready To Paid">Ready To Paid</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full mb-3 ">
              <div className="whitespace-nowrap flex">
                <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                  Create Date
                </label>
                <div className="hidden">:</div>
              </div>
              <div className="flex max-[1254px]:items-start items-center gap-2 max-[1254px]:flex-col">
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
                    <div>s/d</div>
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
                <div className="flex gap-1 items-center text-[12px]">
                  <div>
                    <input
                      onChange={() =>
                        setIgnoreDate((prev) => (prev === 1 ? 0 : 1))
                      }
                      type="checkbox"
                      className="checked:bg-[#0077b6] border-[#cecfcf]"
                      value="1"
                      checked={ignoreDate === 1 ? true : false}
                    />
                  </div>
                  <div className="whitespace-nowrap">Ignore</div>
                </div>
              </div>
            </div>
            {/* <div className="flex max-[349px]:flex-col gap-5 items-center">
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Type
                  </label>
                  <div className="hidden">:</div>
                </div>
                <div className="w-full relative">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                  />
                </div>
              </div>
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Status
                  </label>
                  <div className="hidden">:</div>
                </div>
                <div className="w-full relative">
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                  />
                </div>
              </div>
            </div> */}
            <div className="flex justify-end mt-2">
              <ButtonSearch  />
            </div>
          </form>
        </div>
      </div>
      <div className="relative">
        <div
          onClick={onClickToLastColumn}
          className="absolute top-2 right-[-20px] bg-white rounded-full shadow-md py-2 px-4 border text-[24px] z-[9999] animate-bounce cursor-pointer"
        >
          {">"}
        </div>
        <div
          onClick={onClickToFirstColumn}
          className="absolute top-2 left-[-20px] bg-white rounded-full shadow-md py-2 px-4 border text-[24px] z-[9999] animate-bounce cursor-pointer"
        >
          {"<"}
        </div>
        <div className="w-full overflow-auto shadow-md text-[14px] max-h-[600px]">
          <table className="w-full table-monitoring">
            <thead className="sticky top-0 z-10">
              <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
                <td ref={firstColumnRef} className="p-5 border ">
                  No
                </td>
                <td className="p-5 border ">Create Date</td>
                <td className="p-5 border ">Month</td>
                <td className="p-5 w-8 border ">Name Preparer</td>
                <td className="p-5 border ">PR Number</td>
                <td className="p-5 border ">Supplier</td>
                <td className="p-5 border ">Memo</td>
                <td className="p-5 border ">Currency</td>
                <td className="p-5 border ">Ori Currency</td>
                <td className="p-5 border ">Rate</td>
                <td className="p-5 border ">IDR Currency</td>
                <td className="p-5 border">Term (Days)</td>
                <td className="p-5 border b">Outstanding Date</td>
                <td className="p-5 border ">Indicator</td>
                <td className="p-5 border ">Bank Out</td>
                <td className="p-5 border  ">MCM Reff No</td>
                <td className="p-5 border ">Date MCM</td>
                <td className="p-5 border">Payment Date</td>
                <td className="p-5 border ">Status</td>
                <td className="p-5 border ">Settlement In Oxy</td>
                <td ref={lastColumnRef} className="p-5 border">
                  <div>
                    <input
                      onChange={onChangeCheckedAll}
                      id="check_all"
                      type="checkbox"
                      className="checked:bg-[#0077b6]"
                    />
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 &&
                payments.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center whitespace-nowrap hover:bg-slate-100 border bg-white"
                  >
                    <td className="p-5 border ">{start + index + 1} </td>
                    <td className="p-5 border ">
                      {dayjs(item.date).format("MMM DD, YYYY")}
                    </td>
                    <td className="p-5 border ">
                      {dayjs(item.date).month() + 1}
                    </td>
                    <td className="p-5 border w-16 ">
                      {item.name_preparer !== undefined
                        ? item.name_preparer
                        : ""}
                    </td>
                    <td className="p-5 border ">{item.pr_number}</td>
                    <td className="text-left ps-2 p-5 border ">
                      {item.supplier}
                    </td>
                    <td className="text-left ps-2 p-5 border ">
                      <div className="flex gap-2 items-center">
                        <input
                          value={item.memo}
                          className="disabled:bg-gray-200"
                          disabled
                          type="text"
                          name=""
                          id=""
                        />
                        <div
                          onClick={() => onClickSeeDetailMemo(item.memo)}
                          className="underline text-blue-400 cursor-pointer"
                        >
                          See detail
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border ">{item.currency}</td>
                    <td className="p-5 border ">
                      {accountingNumber(
                        item.ori_currency !== undefined ? item.ori_currency : 0
                      )}
                    </td>
                    <td className="p-5 border ">
                      <div className="">
                        <input
                          onKeyDown={(e) => e.key === " " && e.preventDefault()}
                          onChange={(e) => onChangeRate(e, index, item)}
                          type="number"
                          value={
                            item.bankpo_payment_id === rate[index].id
                              ? rate[index].value
                              : ""
                          }
                          disabled={
                            item.status_settle === "Paid" ? true : false
                          }
                          className={`border-slate-300 ${
                            item.status_settle === "Paid" && "bg-gray-200"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="p-5 border ">
                      {accountingNumber(
                        item.bankpo_payment_id === idrCurrency[index].id
                          ? idrCurrency[index].value
                          : 0
                      )}
                    </td>
                    <td className="py-5  border ">{item.due_date}</td>
                    <td className="p-5 border ">
                      {dayjs(outStandingDate[index].value).format(
                        "MMM DD, YYYY"
                      )}
                    </td>
                    <td className="p-5 border ">
                      {dayjs(outStandingDate[index].value).format(
                        "YYYY-MM-DD"
                      ) > dayjs(new Date()).format("YYYY-MM-DD") ? (
                        ""
                      ) : (
                        <div className="text-red-400 flex items-center gap-1">
                          <span>
                            <CgDanger />
                          </span>
                          Need to pay
                        </div>
                      )}
                    </td>
                    <td className="text-left p-5 ps-2 border ">
                      {item.bank_out}
                    </td>
                    <td className="p-5 border  ">
                      <div className="">
                        <input
                          onKeyDown={(e) => e.key === " " && e.preventDefault()}
                          onChange={(e) => onChangeMcmReff(e, index, item)}
                          type="text"
                          value={
                            item.bankpo_payment_id === mcmReffNo[index].id
                              ? mcmReffNo[index].value
                              : ""
                          }
                          disabled={
                            item.status_settle === "Paid" ? true : false
                          }
                          className={`border-slate-300 ${
                            item.status_settle === "Paid" && "bg-gray-200"
                          }`}
                        />
                      </div>
                    </td>
                    <td className="p-5 border ">
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              value={
                                mcmDate[index].id === item.bankpo_payment_id
                                  ? mcmDate[index].value
                                  : null
                              }
                              onChange={(value) =>
                                onChangeMcmDate(value, index, item)
                              }
                              slotProps={{ textField: { size: "small" } }}
                              disabled={
                                item.status_settle === "Paid" ? true : false
                              }
                              className={`w-full ${
                                item.status_settle === "Paid" && "bg-gray-200"
                              }`}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </td>
                    <td className="p-5 border bg-white">
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              disabled={
                                item.status_settle === "Paid" ? true : false
                              }
                              className={`w-full ${
                                item.status_settle === "Paid" && "bg-gray-200"
                              }`}
                              value={
                                paymentDate[index].id === item.bankpo_payment_id
                                  ? paymentDate[index].value
                                  : null
                              }
                              onChange={(value) =>
                                onChangePaymentDate(value, index, item)
                              }
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </td>
                    <td className="p-5 border ">
                      {status[index].id === item.bankpo_payment_id
                        ? status[index].value
                        : ""}
                    </td>
                    <td className="p-5 border ">
                      {item.status_settle === "Paid" ? "TRUE" : "FALSE"}
                    </td>
                    <td ref={checkColumnRef} className="p-5 border  ">
                      <div>
                        <input
                          onChange={() => onChangeChecked(item, index)}
                          name={`check_${item.bankpo_payment_id}`}
                          disabled={
                            item.status_settle === "Paid" ? true : false
                          }
                          type="checkbox"
                          checked={
                            checkBox.length > 0 &&
                            item.bankpo_payment_id === checkBox[index].id &&
                            checkBox[index].value
                              ? true
                              : false
                          }
                          className="checked:bg-[#0077b6]"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-[80%] max-[900px]:w-full flex justify-end mt-10">
        <button
          onClick={onUpdate}
          className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white"
        >
          Update
        </button>
      </div>
      {payments.length > 0 && (
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

      {payments.length > 0 && (
        <>
          <a
            //onClick={ExportToExcel(data, "list penagihan")}
            href={`${apiExport}servlet/com.project.ccs.report.RptPvPaymentMonitorVendorNonVendorXLS?vendorId=${
              srcVendor.value
            }&number=${number}&periodeId=${srcPeriode.value}&coaId=${
              srcAccount.value
            }&mcmReff=${mcmReff}&status=${srcStatus}&paymentDateIsBlank=${paymentDateIsBlank}&ignoreCreateDate=${ignoreDate}&startDate=${dayjs(
              startDate
            ).format("YYYY-MM-DD")}&endDate=${dayjs(endDate).format(
              "YYYY-MM-DD"
            )}`}
            className="flex items-center gap-2 mt-5 rounded-sm py-2 px-5 shadow-md bg-[#217346] w-fit text-white cursor-pointer"
          >
            <div>
              <RiFileExcel2Line />
            </div>
            <div>Download</div>
          </a>
        </>
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
            <div
              className={`border-0 bg-white  py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                screenSize <= 548 ? "w-[90%]" : "w-[50%]"
              }`}
            >
              <div className="text-[20px] mb-5 font-semibold ">Memo</div>
              <div>{memoDetail}</div>
            </div>
          </Fade>
        </Modal>
      </div>

      {/* <div>
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
              className={`border-0 bg-white  py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
                screenSize <= 548 ? "w-[90%]" : "w-fit"
              }`}
            >
              <div className="text-[20px] mb-5 font-semibold ">Edit Data</div>
              <div>
                <form action="">
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Ori Currency</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={oriCurrency}
                          onChange={onChangeOriCurrency}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">IDR Currency</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={idrCurrency}
                          onChange={onChangeIdrCurrency}
                          onKeyDown={(evt) =>
                            (evt.key === "e" || evt.key === "-") &&
                            evt.preventDefault()
                          }
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Rate</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Term (Days)</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          value={term}
                          onChange={onChangeTerm}
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Outstanding Date</label>
                      </div>
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker className="w-[208px] max-[490px]:w-full z-[99999999]" />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Payment Date</label>
                      </div>
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker className="w-[208px] max-[490px]:w-full z-[99999999]" />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Bank Out</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">MCM Reff No</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Indicator</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Status</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col min-[490px]:flex-row justify-between gap-5 mb-5">
                    <div>
                      <div className="mb-2">
                        <label htmlFor="">Settlement In Oxy</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="border border-slate-400 focus:border focus:border-[#0077b6] rounded-sm max-[490px]:w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-[#0077b6] px-5 py-2 shadow-sm rounded-sm text-white ">
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Fade>
        </Modal>
      </div> */}
    </div>
  );
};

export default VendorAndNonVendor;
