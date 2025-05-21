import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import NavbarAdmin from "../../components/NavbarAdmin";
import Input from "../../components/form/Input";
import DatePickerComponent from "../../components/form/DatePicker";
import Select from "../../components/form/Select";
import ReactSelect from "react-select";
import ButtonSearch from "../../components/button/ButtonSearch";
import { Td, Th } from "../../components/Table";
import ButtonUpload from "../../components/button/ButtonUpload";
import dayjs from "dayjs";
import { Backdrop, CircularProgress, Pagination } from "@mui/material";
import { toast } from "sonner";
import GetBase64 from "../../components/functions/GetBase64";

const api = process.env.REACT_APP_BASEURL;
const apiExport = process.env.REACT_APP_EXPORT_URL;
const urlDownloadDocument = `${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?zipName=DOCUMENT`;
const urlDownloadDocumentSettlement = `${apiExport}fin/transactionact/portalvendorinvoicedownload.jsp?zipName=SETTLEMENT`;

const optionsStatus = ["Outstanding", "Settled"];

const Label = ({ children, htmlFor }) => {
  return (
    <label className="!w-[122px] min-w-[122px]" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

const ButtonSave = ({ onClick, className = undefined }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-[#0077B6] rounded-[5px] px-[8px] py-[2px] ${className} `}
    >
      Save
    </button>
  );
};

const ButtonEdit = ({ className = undefined, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-[#0077B6] rounded-[5px] px-[8px] py-[2px] ${className} `}
    >
      Edit
    </button>
  );
};

const ButtonCancel = ({ className = undefined, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`text-white bg-[#D62828] rounded-[5px] px-[8px] py-[2px] ${className} `}
    >
      cancel
    </button>
  );
};

const ThirdPartyCompany = ({ type = "settlement" }) => {
  const { screenSize } = useStateContext();

  // State
  const [searchParameters, setSearchParameters] = useState({
    prNumber: "",
    startDate: dayjs(new Date()),
    endDate: dayjs(new Date()),
    status: optionsStatus[0].toLowerCase(),
    vendor: { value: "0", label: "All" },
  });
  const [loading, setLoading] = useState(false);
  const [optionVendors, setOptionVendors] = useState({ value: "", label: "" });
  const [bankpoPayments, setBankpoPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [start, setStart] = useState(0);
  const [documentName, setDocumentName] = useState("");
  const [documentSettlementName, setDocumentSettlementName] = useState("");
  const [data, setData] = useState({
    bankpoPaymentId: null,
    settlementFile: null,
    documentFile: null,
    uploadSettlementDate: null,
    uploadDocumentDate: null,
  });

  // Ref
  const documentInputRefs = useRef([]);
  const documentSettlementInputRefs = useRef([]);

  const fetchData = async (parameter = new Object()) => {
    try {
      parameter["number"] = searchParameters.prNumber;
      parameter["start_date"] = dayjs(searchParameters.startDate).format(
        "YYYY-MM-DD"
      );
      parameter["end_date"] = dayjs(searchParameters.endDate).format(
        "YYYY-MM-DD"
      );
      parameter["vendorId"] = searchParameters.vendor.value;

      if (searchParameters.status === "outstanding") {
        parameter["status"] = "Ready To Paid";
      } else {
        parameter["status"] = "Paid";
      }
      setLoading(true);
      const response = await fetch(
        `${api}api/portal-vendor/payment-monitor/vendor-non-vendor`,
        {
          method: "POST",
          body: JSON.stringify(parameter),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      setTotal(result.total);
      setCount(Math.ceil(result.total / result.limit));
      setLimit(result.limit);
      const bankpoPaymentsNew = result.data.map((item) => ({
        ...item,
        isEdit: false,
      }));
      setBankpoPayments(bankpoPaymentsNew);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onChangePagination = useCallback((value) => {
    let parameter = {};
    let limitTemp = limit;

    if (value > page) {
      limitTemp = limitTemp * value - limit;
      parameter = { start: limitTemp };
    } else {
      limitTemp = limitTemp * value - limit;
      parameter = { start: limitTemp };
    }

    setStart(limitTemp);
    fetchData(parameter);
    setPage(value);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setStart(0);
    setPage(1);
    fetchData();
  };

  const handleChangeDocument = (e, id) => {
    const file = e.target.files[0];
    if (file && file.size <= 2000000) {
      setDocumentName(file.name);
      const currentDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

      GetBase64(e.target.files[0])
        .then((result) => {
          setData({
            ...data,
            bankpoPaymentId: id,
            documentFile: result,
            uploadDocumentDate: currentDate,
          });
        })
        .catch((err) => {
          setData({
            ...data,
            bankpoPaymentId: null,
            documentFile: null,
            uploadDocumentDate: null,
          });
        });
    } else {
      toast.error("max file size is 2 mb");
    }
  };

  const handleChangeDocumentSettlement = (e, id) => {
    const file = e.target.files[0];
    if (file && file.size <= 2000000) {
      setDocumentSettlementName(file.name);
      const currentDate = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

      GetBase64(e.target.files[0])
        .then((result) => {
          setData({
            ...data,
            bankpoPaymentId: id,
            settlementFile: result,
            uploadSettlementDate: currentDate,
          });
        })
        .catch((err) => {
          setData({
            ...data,
            bankpoPaymentId: null,
            settlementFile: null,
            uploadSettlementDate: null,
          });
        });
    } else {
      toast.error("max file size is 2 mb");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let dataNew = null;
      if (type === "admin") {
        dataNew = {
          bankpoPaymentId: data.bankpoPaymentId,
          documentFile: data.documentFile,
          uploadDocumentDate: data.uploadDocumentDate,
        };
      } else {
        dataNew = {
          bankpoPaymentId: data.bankpoPaymentId,
          settlementFile: data.settlementFile,
          uploadSettlementDate: data.uploadSettlementDate,
        };
      }

      const response = await fetch(
        `${api}api/portal-vendor/third-party-company`,
        {
          method: "POST",
          body: JSON.stringify(dataNew),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      fetchData();
      toast.success("save success!");
    } catch (error) {
      toast.error("save failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}api/portal-vendor/list/oxyvendor`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        const optionVendorsNew = result.data.map((d) => ({
          value: d.id,
          label: d.name,
        }));
        optionVendorsNew.unshift({ value: "0", label: "All" });

        setOptionVendors(optionVendorsNew);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchVendor();
  }, []);

  useEffect(() => {
    setDocumentSettlementName("");
    setDocumentName("");
  }, [bankpoPayments]);

  return (
    <>
      <NavbarAdmin
        className={`${type === "admin" ? "hidden" : ""}`}
        title="PT KARYA PRIMA UNGGULAN"
      ></NavbarAdmin>
      <div
        className={`py-[16px] px-[26px] font-roboto ${
          type === "admin" ? "mt-20" : ""
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="lg:w-[692px] flex flex-col gap-5"
        >
          <div className="flex max-sm:flex-col lg:items-center gap-1">
            <Label htmlFor="prNumber">PR Number</Label>
            <Input
              name="prNumber"
              value={searchParameters.prNumber}
              onChange={(e) =>
                setSearchParameters({
                  ...searchParameters,
                  prNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="flex max-sm:flex-col lg:items-center gap-1">
            <Label htmlFor="prNumber">Date</Label>
            <DatePickerComponent
              value={searchParameters.startDate}
              onChange={(value) =>
                setSearchParameters({ ...searchParameters, startDate: value })
              }
            />
            <p className="text-center text-slate-400">to</p>
            <DatePickerComponent
              value={searchParameters.endDate}
              onChange={(value) =>
                setSearchParameters({ ...searchParameters, endDate: value })
              }
            />
          </div>
          <div className="flex max-sm:flex-col lg:items-center gap-1">
            <Label htmlFor="prNumber">Status</Label>
            <Select
              value={searchParameters.status}
              onChange={(e) =>
                setSearchParameters({
                  ...searchParameters,
                  status: e.target.value,
                })
              }
            >
              {optionsStatus.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex max-sm:flex-col lg:items-center gap-1">
            <Label htmlFor="prNumber">Vendor</Label>
            <ReactSelect
              className="w-full"
              value={searchParameters.vendor}
              options={optionVendors}
              onChange={(value) =>
                setSearchParameters({ ...searchParameters, vendor: value })
              }
            />
          </div>
          <div className="flex justify-end">
            <ButtonSearch type="submit" />
          </div>
        </form>
        <div className="overflow-auto mt-[94px]">
          <table className="text-[14px]">
            <thead>
              <tr className="h-[40px]">
                <Th>Date</Th>
                <Th className="!w-[280px] !min-w-[280px]">Vendor</Th>
                <Th className="!w-[280px] !min-w-[280px]">PR Number</Th>
                <Th className="!w-[280px] !min-w-[280px]">
                  Document{" "}
                  <span className="text-[7px]">(PDF, ZIP, RAR) max 2 mb</span>
                </Th>
                <Th className="!w-[280px] !min-w-[280px]">
                  Date upload document
                </Th>
                <Th className="!w-[280px] !min-w-[280px]">
                  Settlement <span className="text-[7px]">max 2 mb</span>
                </Th>
                <Th className="!w-[280px] !min-w-[280px]">
                  Date upload settlement
                </Th>
                <Th className="!w-[280px] !min-w-[280px]">Action</Th>
              </tr>
            </thead>
            <tbody>
              {bankpoPayments.map((item) =>
                !item.isEdit ? (
                  <tr
                    key={item.bankpo_payment_id}
                    className="text-center h-[40px]"
                  >
                    <Td>
                      {item.tanggal_tt
                        ? dayjs(item.tanggal_tt).format("DD MMMM, YYYY")
                        : ""}
                    </Td>
                    <Td>{item.supplier ?? ""}</Td>
                    <Td>{item.pr_number ?? ""}</Td>
                    <Td>
                      <a
                        href={`${urlDownloadDocument}&name=BANKPO_PAYMENT_DOCUMENT_${item.bankpo_payment_id}&bankpo_payment_id=${item.bankpo_payment_id}`}
                        target="_blank"
                        className="cursor-pointer text-blue-500"
                      >
                        Download file
                      </a>
                    </Td>
                    <Td>
                      {item.upload_document_date
                        ? dayjs(item.upload_document_date).format(
                            "DD MMMM, YYYY"
                          )
                        : ""}
                    </Td>
                    <Td>
                      <a
                        href={`${urlDownloadDocumentSettlement}&name=BANKPO_PAYMENT_SETTLEMENT_${item.bankpo_payment_id}&bankpo_payment_id=${item.bankpo_payment_id}`}
                        target="_blank"
                        className="cursor-pointer text-blue-500"
                      >
                        Download file
                      </a>
                    </Td>
                    <Td>
                      {item.upload_settlement_date
                        ? dayjs(item.upload_settlement_date).format(
                            "DD MMMM, YYYY"
                          )
                        : ""}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-center gap-1">
                        <ButtonEdit
                          onClick={() => {
                            setBankpoPayments((prev) =>
                              prev.map((po) =>
                                po.bankpo_payment_id === item.bankpo_payment_id
                                  ? { ...po, isEdit: true }
                                  : { ...po, isEdit: false }
                              )
                            );
                          }}
                        />
                      </div>
                    </Td>
                  </tr>
                ) : (
                  <tr
                    key={item.bankpo_payment_id}
                    className="text-center h-[40px]"
                  >
                    <Td>
                      {item.tanggal_tt
                        ? dayjs(item.tanggal_tt).format("DD MMMM, YYYY")
                        : ""}
                    </Td>
                    <Td>{item.supplier ?? ""}</Td>
                    <Td>{item.pr_number ?? ""}</Td>
                    <Td>
                      {type === "admin" ? (
                        <>
                          <div className="flex flex-col gap-1 items-center py-[7px]">
                            <ButtonUpload
                              onClick={() =>
                                documentInputRefs.current[
                                  item.bankpo_payment_id
                                ].click()
                              }
                              className="w-[80px]"
                            />
                            <span>{documentName}</span>
                          </div>

                          <Input
                            ref={(el) =>
                              (documentInputRefs.current[
                                item.bankpo_payment_id
                              ] = el)
                            }
                            accept=".zip,.rar,.pdf"
                            onChange={(e) =>
                              handleChangeDocument(e, item.bankpo_payment_id)
                            }
                            className="hidden"
                            type="file"
                          />
                        </>
                      ) : (
                        <a
                          href={`${urlDownloadDocument}&name=BANKPO_PAYMENT_DOCUMENT_${item.bankpo_payment_id}&bankpo_payment_id=${item.bankpo_payment_id}`}
                          target="_blank"
                          className="cursor-pointer text-blue-500"
                        >
                          Download file
                        </a>
                      )}
                    </Td>
                    <Td>
                      {item.upload_document_date
                        ? dayjs(item.upload_document_date).format(
                            "DD MMMM, YYYY"
                          )
                        : ""}
                    </Td>
                    <Td>
                      {type === "admin" ? (
                        <a
                          href={`${urlDownloadDocumentSettlement}&name=BANKPO_PAYMENT_SETTLEMENT_${item.bankpo_payment_id}&bankpo_payment_id=${item.bankpo_payment_id}`}
                          target="_blank"
                          className="cursor-pointer text-blue-500"
                        >
                          Download file
                        </a>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1 items-center py-[7px]">
                            <ButtonUpload
                              onClick={() =>
                                documentSettlementInputRefs.current[
                                  item.bankpo_payment_id
                                ].click()
                              }
                              className="w-[80px]"
                            />
                            <span>{documentSettlementName}</span>
                          </div>

                          <Input
                            ref={(el) =>
                              (documentSettlementInputRefs.current[
                                item.bankpo_payment_id
                              ] = el)
                            }
                            accept=".zip,.rar,.pdf"
                            onChange={(e) =>
                              handleChangeDocumentSettlement(
                                e,
                                item.bankpo_payment_id
                              )
                            }
                            className="hidden"
                            type="file"
                          />
                        </>
                      )}
                    </Td>
                    <Td>
                      {item.upload_settlement_date
                        ? dayjs(item.upload_settlement_date).format(
                            "DD MMMM, YYYY"
                          )
                        : ""}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-center gap-1">
                        <ButtonSave onClick={handleSave} />
                        <ButtonCancel
                          onClick={() => {
                            setBankpoPayments((prev) =>
                              prev.map((po) =>
                                po.bankpo_payment_id === item.bankpo_payment_id
                                  ? { ...po, isEdit: false }
                                  : po
                              )
                            );
                          }}
                        />
                      </div>
                    </Td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        {bankpoPayments.length > 0 && (
          <div className="mt-10">
            <div>Total: {total}</div>
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
      </div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 9999999999,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ThirdPartyCompany;
