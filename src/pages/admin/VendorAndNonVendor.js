import { useStateContext } from "../../contexts/ContextProvider";
import { Pagination } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import { CgDanger } from "react-icons/cg";
import dayjs from "dayjs";
import accountingNumber from "../../components/functions/AccountingNumber";
import toast from "react-hot-toast";
import Select from "react-select";
import isEmpty from "../../components/functions/CheckEmptyObject";

const api = process.env.REACT_APP_BASEURL;

const VendorAndNonVendor = () => {
  const { screenSize } = useStateContext();
  const [payments, setPayments] = useState([]);
  const [srcAccountOptions,  setSrcAccountOptions] = useState([])
  const [srcAccount, setSrcAccount] = useState({
    value: "0",
    label: "All" 
  })

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
          setCount(Math.round(res.total / res.limit));
          setLimit(res.limit);
          setPayments(res.data);

          const check = res.data.map((item) => ({
            id: item.bankpo_payment_id,
            value: false,
          }));
          setCheckBox(check);

          const listOutStandingDate = res.data.map((item) => {
            let date = dayjs(item.tanggal_tt);
            let outstanding_date = date.subtract(3, "day");
            return outstanding_date;
          });

          const listMcmReffNo = res.data.map((item) => {
            return item.mcm_reff_no;
          });

          const listRate = res.data.map((item) => {
            return item.rate;
          });

          const listTerm = res.data.map((item) => {
            return item.term;
          });

          const listMcmDate = res.data.map((item) => {
            return item.mcm_date.length > 0 ? dayjs(item.mcm_date) : undefined;
          });

          const listPaymentDate = res.data.map((item) => {
            return item.payment_date.length > 0
              ? dayjs(item.payment_date)
              : undefined;
          });

          const listStatus = listOutStandingDate.map((item, i) => {
            let status;
            const outstandingDate = dayjs(item).format("YYYY-MM-DD");
            const datePayment = dayjs(listPaymentDate[i]).format("YYYY-MM-DD");
            if (outstandingDate < datePayment) {
              status = "Late";
            } else {
              status = "Ontime";
            }

            return status;
          });

          const listIdr = res.data.map((item, i) => {
            let idr;
            if (item.currency === "Rp.") {
              idr = item.ori_currency;
            } else {
              idr = parseFloat(item.ori_currency) * parseInt(item.rate);
            }

            return idr;
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
    await fetch(`${api}api/portal-vendor/list/coa`,{
      method: "POST",
      body: JSON.stringify({
        header: "cash in bank"
      })
    }).then((response) => response.json())
    .then((res) => {
      const data = res.data
      if(data.length > 0){
       const options =  data.map((item,i) => {
        console.log(item)
          let object = []
          object[i+1] = {value: item.id, label:item.name}
          // eslint-disable-next-line array-callback-return
          item.child.map((children,index) => {
            object[index+2] = {value: children.id, label:children.name}
          })

 
          return object
        })
        options[0][0] = {value: "0", label:"All"}
  
        setSrcAccountOptions(options[0])
      }else{

      }
    })
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
    if (supplier.trim().length > 0) {
      parameter["supplier"] = supplier;
    }

    if (!isEmpty(srcAccount) && srcAccount.value !== "0") {
      parameter["coa_id"] = srcAccount.value;
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  const onChangePaymentDate = (value, index, item) => {
    const outstandingDate = dayjs(outStandingDate[index]).format("YYYY-MM-DD");
    const datePayment = dayjs(value).format("YYYY-MM-DD");
    const statusCopy = [...status];
    if (outstandingDate < datePayment) {
      statusCopy[index] = "Late";
    } else {
      statusCopy[index] = "Ontime";
    }
    setStatus(statusCopy);

    const startDateCopy = [...paymentDate];
    startDateCopy[index] = value;
    setPaymentDate(startDateCopy);
  };

  const onChangeMcmDate = (value, index) => {
    const startDateCopy = [...mcmDate];
    startDateCopy[index] = value;
    setMcmDate(startDateCopy);
  };

  const onChangeMcmReff = (e, index, item) => {
    const value = e.target.value;

    const mcmReffCopy = [...mcmReffNo];
    mcmReffCopy[index] = value;
    setMcmReffNo(mcmReffCopy);
  };

  const onChangeRate = (e, index, item) => {
    const value = e.target.value;

    if (item.currency !== "Rp.") {
      const idrCurrencyCopy = [...idrCurrency];
      idrCurrencyCopy[index] = parseFloat(item.ori_currency * value);
      setIdrCurrency(idrCurrencyCopy);
    }

    const mcmReffCopy = [...rate];
    mcmReffCopy[index] = value;
    setRate(mcmReffCopy);
  };

  const onChangeTerm = (e, index, item) => {
    
    const value = e.target.value;
    console.log(parseInt(value))
    const outStandingDateCopy = [...outStandingDate];
    let date = dayjs(item.tanggal_tt).add(parseInt(value), "day");
    let outstanding_date = date.subtract(3, "day");
    outStandingDateCopy[index] = outstanding_date;
    setOutStandingDate(outStandingDateCopy)

    const termCopy = [...term];
    termCopy[index] = value;
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
    fetchCoa()
  }, []);

  // const onClickEdit = (index) => {
  //   handleOpen();
  // };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (supplier.trim().length > 0) {
      parameter["supplier"] = supplier;
    }
    if (number.trim().length > 0) {
      parameter["number"] = number;
    }

    if (!isEmpty(srcAccount) && srcAccount.value !== "0") {
      parameter["coa_id"] = srcAccount.value;
    }
    setStart(0);
    setPage(1);
    fetchData(parameter);
  };

  const onUpdate = (e) => {
    e.preventDefault();
    const isErrorCopy = [...isError];
    payments.map(async (item, i) => {
      
      if (checkBox[i].id === item.bankpo_payment_id && checkBox[i].value) {
        console.log(term[i] )
        if (
          mcmReffNo[i] !== undefined &&
          mcmReffNo[i].length > 0 &&
          mcmDate[i] !== undefined &&
          paymentDate[i] !== undefined
          
        ) {
          await fetch(`${api}api/portal-vendor/payment`, {
            method: "POST",
            body: JSON.stringify({
              id: item.id !== undefined ? item.id : 0,
              bankpo_payment_id: item.bankpo_payment_id,
              mcm_reff_no: mcmReffNo[i],
              mcm_date: dayjs(mcmDate[i]).format("YYYY-MM-DD HH:mm:ss"),
              payment_date: dayjs(paymentDate[i]).format("YYYY-MM-DD HH:mm:ss"),
              status: status[i],
              rate: rate[i],
              term: term[i]
            }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.data !== 0) {
                isErrorCopy[i] = false;
                setisError(isErrorCopy);

                toast.success(`${mcmReffNo[i]} success!`, {
                  position: "top-right",
                  duration: 500,
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });

                document.getElementById("check_all").checked = false;
                setNumber("");
                setSupplier("");
                const parameter = { start: start };
                fetchData(parameter);
              } else {
                isErrorCopy[i] = true;
                setisError(isErrorCopy);

                toast.error(`${mcmReffNo[i]} failed!`, {
                  position: "top-right",
                  duration: 500,
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              }
            })
            .catch((err) => {
              isErrorCopy[i] = true;
              setisError(isErrorCopy);
            });
        } else {
          toast.error(
            `${mcmReffNo[i] !== undefined ? mcmReffNo[i] : ""} failed!`,
            {
              position: "top-right",
              duration: 500,
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }
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
        value: false,
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
  return (
    <div
      className={`${
        screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
      } font-roboto overflow-x-hidden `}
    >
    
      <div className="mb-20 max-[349px]:mb-5">Vendor & Non Vendor</div>
      <div className="mb-5 w-[70%] max-[638px]:w-full">
        <div className="mb-5 text-slate-400">Searching Parameter</div>
        <div>
          <form onSubmit={(e) => onSearch(e)}>
            <div className="flex max-[349px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Supplier Name
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full relative">
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    name=""
                    id=""
                    className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
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
                <div className="w-full relative">
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    name=""
                    id=""
                    className="w-full h-[32px] text-slate-400 border border-slate-300 rounded-sm focus:border focus:border-[#0077b6]  "
                  />
                </div>
              </div>
            </div>
            <div className="flex max-[349px]:flex-col gap-5 items-center mb-5">
              <div className="flex flex-col  gap-1  mb-3 w-full ">
                <div className="whitespace-nowrap flex">
                  <label htmlFor="" className="w-36 text-[14px] text-slate-400">
                    Account
                  </label>
                  <div className="hidden ">:</div>
                </div>
                <div className="w-full relative">
                <Select
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
              <button className="py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        id="scrollableDiv"
        className="w-full overflow-auto shadow-md text-[14px] max-h-[400px]"
      >
        <table className="w-full table-monitoring">
          <thead>
            <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
              <td className="p-5 border">No</td>
              <td className="p-5 border">Vendor & Non Vendor</td>
              <td className="p-5 border">Create Date</td>
              <td className="p-5 border">Month</td>
              <td className="p-5 w-8 border">Name Preparer</td>
              <td className="p-5 border">PR Number</td>
              <td className="p-5 border">Supplier</td>
              <td className="p-5 border">Currency</td>
              <td className="p-5 border">Ori Currency</td>
              <td className="p-5 border">Rate</td>
              <td className="p-5 border">IDR Currency</td>
              <td className="p-5">Term (Days)</td>
              <td className="p-5 border">Outstanding Date</td>
              <td className="p-5 border">Indicator</td>
              <td className="p-5 border">Bank Out</td>
              <td className="p-5 border">MCM Reff No</td>
              <td className="p-5 border">Date MCM</td>
              <td className="p-5 border">Payment Date</td>
              <td className="p-5 border">Status</td>
              <td className="p-5 border">Settlement In Oxy</td>
              <td className="p-5 border">
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
                  <td className="p-5 border">{start + index + 1}</td>
                  <td className="p-5 border">
                    {item.tipe === "0" ? "Vendor" : "Non Vendor"}
                  </td>
                  <td className="p-5 border">
                    {dayjs(item.date).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-5 border">
                    {dayjs(item.tanggal_tt).month() + 1}
                  </td>
                  <td className="p-5 border w-16">
                    {item.name_preparer !== undefined ? item.name_preparer : ""}
                  </td>
                  <td className="p-5 border">{item.pr_number}</td>
                  <td className="text-left ps-2 p-5 border">{item.supplier}</td>
                  <td className="p-5 border">{item.currency}</td>
                  <td className="p-5 border">
                    {accountingNumber(
                      item.ori_currency !== undefined ? item.ori_currency : 0
                    )}
                  </td>
                  <td className="p-5 border">
                    <div className="relative">
                      <input
                        onKeyDown={(e) => e.key === " " && e.preventDefault()}
                        onChange={(e) => onChangeRate(e, index, item)}
                        type="number"
                        value={rate[index]}
                        className={`border-slate-300`}
                      />
                    </div>
                  </td>
                  <td className="p-5 border">
                    {accountingNumber(idrCurrency[index])}
                  </td>
                  <td className="py-5  border">
                    {item.tipe === "0" ? (
                      item.due_date
                    ) : (
                      <input
                        onKeyDown={(e) => e.key === " " && e.preventDefault()}
                        onChange={(e) => onChangeTerm(e, index, item)}
                        type="number"
                        value={term[index]}
                        className={`border-slate-300 w-[100px] text-center`}
                      />
                    )}
                  </td>
                  <td className="p-5 border">
                    {dayjs(outStandingDate[index]).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-5 border">
                    {dayjs(outStandingDate[index]).format("YYYY-MM-DD") >
                    dayjs(new Date()).format("YYYY-MM-DD") ? (
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
                  <td className="text-left p-5 ps-2 border">{item.bank_out}</td>
                  <td className="p-5 border">
                    <div className="relative">
                      <input
                        onKeyDown={(e) => e.key === " " && e.preventDefault()}
                        onChange={(e) => onChangeMcmReff(e, index)}
                        type="text"
                        value={mcmReffNo[index]}
                        className={`border-slate-300`}
                      />
                    </div>
                  </td>
                  <td className="p-5 border">
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="w-full"
                            value={mcmDate[index]}
                            onChange={(value) => onChangeMcmDate(value, index)}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="p-5 border">
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="w-full"
                            value={paymentDate[index]}
                            onChange={(value) =>
                              onChangePaymentDate(value, index, item)
                            }
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="p-5 border">{status[index]}</td>
                  <td className="p-5 border">TRUE</td>
                  <td className="p-5 border">
                    <div>
                      <input
                        onChange={() => onChangeChecked(item, index)}
                        name={`check_${item.bankpo_payment_id}`}
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
