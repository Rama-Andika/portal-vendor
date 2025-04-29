/* eslint-disable no-new-object */
import { useStateContext } from "../../contexts/ContextProvider";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  Pagination,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import accountingNumber from "../../components/functions/AccountingNumber";
import toast from "react-hot-toast";
import Select from "react-select";
import isEmpty from "../../components/functions/CheckEmptyObject";
import { RiFileExcel2Line } from "react-icons/ri";
import ButtonSearch from "../../components/button/ButtonSearch";

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;

const Cod = () => {
  const { screenSize } = useStateContext();
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [checkBox, setCheckBox] = useState([]);
  const [srcAccountOptions, setSrcAccountOptions] = useState([]);

  // Search
  const [supplier, setSupplier] = useState("");
  const [number, setNumber] = useState("");
  const [srcAccount, setSrcAccount] = useState({
    value: "0",
    label: "All",
  });

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [memoDetail, setMemoDetail] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [cashOutDate, setCashOutDate] = useState([]);
  const [otherBankNo, setOtherBankNo] = useState([]);
  const [bankReff, setBankReff] = useState([]);
  const [bankDate, setBankDate] = useState([]);
  const [memo, setMemo] = useState([]);

  const [isError, setisError] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (parameter = new Object()) => {
    await fetch(`${api}api/portal-vendor/payment-monitor/cod`, {
      method: "POST",
      body: JSON.stringify(parameter),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data.length > 0) {
          console.log(res.data);
          setTotal(res.total);
          setCount(Math.ceil(res.total / res.limit));
          setLimit(res.limit);
          setPayments(res.data);

          const check = res.data.map((item) => ({
            id: item.receive_id,
            value: false,
          }));
          setCheckBox(check);

          // eslint-disable-next-line array-callback-return
          const listOtherBank = res.data.map((item) => {
            return item.other_bank_no;
          });

          const listBankReff = res.data.map((item) => {
            return item.bank_reff;
          });

          const listMemo = res.data.map((item) => {
            return item.memo;
          });

          const listCashOutDate = res.data.map((item) => {
            return item.cash_out_date.length > 0
              ? dayjs(item.cash_out_date)
              : dayjs(new Date());
          });

          const listBankDate = res.data.map((item) => {
            return item.bank_date.length > 0 ? dayjs(item.bank_date) : null;
          });

          setMemo(listMemo);
          setOtherBankNo(listOtherBank);
          setBankReff(listBankReff);
          setCashOutDate(listCashOutDate);
          setBankDate(listBankDate);
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
            console.log(item);
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

  //   await fetch(`${api}api/portal-vendor/payment-monitor/cod`, {
  //     method: "POST",
  //     body: JSON.stringify(parameter),
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       if (res.data.length > 0) {
  //         res.data.length >= total ? setHasMore(false) : setHasMore(true);
  //         setStart((prev) => prev + limit);
  //         setPayments(res.data);

  //         // eslint-disable-next-line array-callback-return
  //         const listOtherBank = res.data.map((item) => {
  //           return item.other_bank_no;
  //         });

  //         const listBankReff = res.data.map((item) => {
  //           return item.bank_reff;
  //         });

  //         const listMemo = res.data.map((item) => {
  //           return item.memo;
  //         });

  //         const listCashOutDate = res.data.map((item) => {
  //           return item.cash_out_date.length > 0
  //             ? dayjs(item.cash_out_date)
  //             : undefined;
  //         });

  //         const listBankDate = res.data.map((item) => {
  //           return item.bank_date.length > 0
  //             ? dayjs(item.bank_date)
  //             : undefined;
  //         });

  //         setBankReff(listBankReff);
  //         setOtherBankNo(listOtherBank);
  //         setCashOutDate(listCashOutDate);
  //         setBankDate(listBankDate);
  //         setMemo(listMemo);
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

    // eslint-disable-next-line no-unused-vars
    const arr = payments.map((item, i) => {
      return document.getElementsByName(`check_${item.receive_id}`)[0];
    });

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  };

  const onChangeCashOutDate = (value, index) => {
    const startDateCopy = [...cashOutDate];
    startDateCopy[index] = value;
    setCashOutDate(startDateCopy);
  };

  const onChangeBankDate = (value, index) => {
    const startDateCopy = [...bankDate];
    startDateCopy[index] = value;
    setBankDate(startDateCopy);
  };

  const onChangeOtherBank = (e, index, item) => {
    const value = e.target.value;

    const mcmReffCopy = [...otherBankNo];
    mcmReffCopy[index] = value;
    setOtherBankNo(mcmReffCopy);
  };

  const onChangeBankReff = (e, index, item) => {
    const value = e.target.value;

    const mcmReffCopy = [...bankReff];
    mcmReffCopy[index] = value;
    setBankReff(mcmReffCopy);
  };

  const onChangeMemo = (e, index, item) => {
    const value = e.target.value;

    const mcmReffCopy = [...memo];
    mcmReffCopy[index] = value;
    setMemo(mcmReffCopy);
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
  }, []);

  // const onClickEdit = (index) => {
  //   handleOpen();
  // };

  const onSearch = (e) => {
    e.preventDefault();
    let parameter = {};
    if (number.trim().length > 0) {
      parameter["number"] = number;
    }
    if (supplier.trim().length > 0) {
      parameter["supplier"] = supplier;
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
    setLoading(true);

    // eslint-disable-next-line array-callback-return
    payments.map((item, i) => {
      if (checkBox[i].id === item.receive_id && checkBox[i].value) {
        if (
          otherBankNo[i] !== undefined &&
          otherBankNo[i].length > 0 &&
          bankReff[i] !== undefined &&
          bankReff[i].length > 0 &&
          memo[i] !== undefined &&
          memo[i].length > 0 &&
          cashOutDate[i] !== undefined &&
          bankDate[i] !== undefined
        ) {
          fetch(`${api}api/portal-vendor/payment`, {
            method: "POST",
            body: JSON.stringify({
              id: item.id !== undefined ? item.id : 0,
              receive_id: item.receive_id,
              other_bank_no: otherBankNo[i],
              bank_reff: bankReff[i],
              cash_out_date: dayjs(cashOutDate[i]).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
              bank_date: dayjs(bankDate[i]).format("YYYY-MM-DD HH:mm:ss"),
              memo: memo[i],
            }),
          })
            .then((response) => response.json())
            .then((res) => {
              if (res.data !== 0) {
                isErrorCopy[i] = false;
                setisError(isErrorCopy);

                toast.success(`${otherBankNo[i]} success!`, {
                  position: "top-right",
                  duration: 1000,
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });

                document.getElementById("check_all").checked = false;
                setNumber("");
                const parameter = { start: start };
                fetchData(parameter);
              } else {
                isErrorCopy[i] = true;
                setisError(isErrorCopy);

                toast.error(`${otherBankNo[i]} failed!`, {
                  position: "top-right",
                  duration: 1000,
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
            `${otherBankNo[i] !== undefined ? otherBankNo[i] : ""} failed!`,
            {
              position: "top-right",
              duration: 1000,
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
    setLoading(false);
  };

  const onChangeCheckedAll = () => {
    const checkAll = document.getElementById("check_all");
    let arr = [];
    if (checkAll.checked) {
      // eslint-disable-next-line array-callback-return
      arr = payments.map((item) => ({
        id: item.receive_id,
        value: true,
      }));
    } else {
      // eslint-disable-next-line array-callback-return
      arr = payments.map((item) => ({
        id: item.receive_id,
        value: false,
      }));
    }
    setCheckBox(arr);
  };

  const onChangeChecked = (item, index) => {
    document.getElementById("check_all").checked = false;

    const arr = payments.map((item) => ({
      id: item.receive_id,
      value: document.getElementsByName(`check_${item.receive_id}`)[0].checked,
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

  const onClickSeeDetailMemo = (memo) => {
    setMemoDetail(memo);
    handleOpen();
  };
  return (
    <div
      className={`${
        screenSize < 768 ? "px-5 pt-20" : "px-10 pt-10"
      } font-roboto `}
    >
      <div className="mb-10 max-[349px]:mb-5">COD</div>
      <div className="mb-5 w-[70%] max-[638px]:w-full">
        <div className="mb-5 text-slate-400">Parameter Pencarian</div>
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
                    Incoming Number
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
              <ButtonSearch onSearch={(e) => onSearch(e)} />
            </div>
          </form>
        </div>
      </div>

      <div
        id="scrollableDiv"
        className="w-full overflow-auto shadow-md text-[14px] max-h-[400px]"
      >
        <table className="w-full table-monitoring">
          <thead className="">
            <tr className="text-center whitespace-nowrap border-2 bg-[#eaf4f4]">
              <td className="p-5 border">No</td>
              <td className="p-5 border">Incoming Date</td>
              <td className="p-5 border">Incoming Number</td>
              <td className="p-5 border">PO Number</td>
              <td className="p-5 border">Supplier</td>
              <td className="p-5 border">Amount</td>
              <td className="p-5 border">Bank Out / Cash Out</td>
              <td className="p-5 border">Cash Out Date</td>
              <td className="p-5 border">Bank Out - Transfer ke</td>
              <td className="p-5 border">Other Bank Number</td>
              <td className="p-5 border">Bank Reff</td>
              <td className="p-5 border">Bank Date</td>
              <td className="p-5 border">Memo</td>
              <td className="p-5 border">Initial</td>
              <td className="p-5 border">Create Date</td>
              <td className="p-5 border">PR Number</td>
              <td className="p-5 border">Payment Date</td>
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
                    {dayjs(item.incoming_date).format("MMM DD, YYYY")}
                  </td>
                  <td className="p-5 border">{item.incoming_number}</td>
                  <td className="p-5 border">{item.po_number}</td>
                  <td className="p-5 border text-left">{item.supplier}</td>
                  <td className="p-5 border">
                    {accountingNumber(
                      item.total !== undefined ? item.total : 0
                    )}
                  </td>
                  <td className="p-5 border">
                    {item.bank_out !== undefined ? item.bank_out : ""}
                  </td>
                  <td className="p-5 border">
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="w-full"
                            value={cashOutDate[index]}
                            onChange={(value) =>
                              onChangeCashOutDate(value, index)
                            }
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="p-5 border">
                    {item.bank_out_transfer !== undefined
                      ? item.bank_out_transfer.map((bank, i) =>
                          item.bank_out_transfer.length > 1
                            ? item.bank_out_transfer.length - 1 === i
                              ? bank.bank
                              : bank.bank + ", "
                            : bank.bank
                        )
                      : ""}
                  </td>
                  <td className="p-5 border">
                    <div>
                      <input
                        value={otherBankNo[index]}
                        onChange={(e) => onChangeOtherBank(e, index, item)}
                        type="text"
                        id=""
                      />
                    </div>
                  </td>
                  <td className="p-5 border">
                    <div>
                      <input
                        type="text"
                        value={bankReff[index]}
                        onChange={(e) => onChangeBankReff(e, index, item)}
                        id=""
                      />
                    </div>
                  </td>
                  <td className="p-5 border">
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="w-full"
                            value={bankDate[index]}
                            onChange={(value) => onChangeBankDate(value, index)}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </td>
                  <td className="p-5 border">
                    <div className="flex gap-2 items-center">
                      <input
                        value={memo[index]}
                        className="disabled:bg-gray-200"
                        disabled
                        onChange={(e) => onChangeMemo(e, index)}
                        type="text"
                        name=""
                        id=""
                      />
                      <div
                        onClick={() => onClickSeeDetailMemo(memo[index])}
                        className="underline text-blue-400 cursor-pointer"
                      >
                        See detail
                      </div>
                    </div>
                  </td>
                  <td className="p-5 border">{item.name_preparer}</td>
                  <td className="p-5 border">
                    {item.pr_date.length > 0
                      ? dayjs(item.pr_date).format("MMM DD, YYYY")
                      : ""}
                  </td>
                  <td className="p-5 border">{item.journal_number}</td>
                  <td className="p-5 border">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          disabled
                          className="w-full"
                          value={cashOutDate[index]}
                          onChange={(value) =>
                            onChangeCashOutDate(value, index)
                          }
                          slotProps={{ textField: { size: "small" } }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </td>
                  <td className="p-5 border">
                    <div>
                      <input
                        onChange={() => onChangeChecked(item, index)}
                        name={`check_${item.receive_id}`}
                        type="checkbox"
                        checked={
                          checkBox.length > 0 &&
                          item.receive_id === checkBox[index].id &&
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
      <div className="w-[80%] max-[900px]:w-full flex justify-end mt-10 mb-10">
        <button
          onClick={onUpdate}
          disabled={loading ? true : false}
          className={`py-1 max-[415px]:w-full px-10 rounded-sm shadow-sm bg-[#0077b6] text-white `}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Update"
          )}
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
            href={`${apiExport}servlet/com.project.ccs.report.RptPvCodXLS?supplier=${supplier}&number=${number}&coaId=${srcAccount.value}`}
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
              className={`rounded-md border-0 bg-white  py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
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

export default Cod;
