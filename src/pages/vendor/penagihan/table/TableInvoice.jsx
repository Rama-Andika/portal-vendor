import dayjs from "dayjs";
import React from "react";
import { FaRegEdit, FaRegSave } from "react-icons/fa";
import { MdOutlineCancel, MdOutlineDelete } from "react-icons/md";
import accountingNumber from "../../../../components/functions/AccountingNumber";
import Select from "react-select";
import { toast, Toaster } from "sonner";
import GetBase64 from "../../../../components/functions/GetBase64";

const apiExport = process.env.REACT_APP_EXPORT_URL;

const TableInvoice = React.memo(
  ({
    data,
    setData,
    inputNomorInvoiceRef = null,
    addMode = false,
    invoices = [],
    invoiceFiles = [],
    invoiceFilesUploaded = [],
    setInvoiceFiles,
    pajakFilesUploaded = [],
    pajakFiles = [],
    setPajakFiles,
    vendorType,
    optionLokasi,
    onClickSave,
    onClickCancel,
    onClickEdit,
    onClickDelete,
    activeStep = 0,
  }) => {
    const customeStyles = {
      control: (baseStyles) => ({
        ...baseStyles,
        height: "32.5px",
        fontSize: "14px",
      }),
      menu: (baseStyles) => ({
        ...baseStyles,
        fontSize: "14px",
      }),
      option: (baseStyles, state) => ({
        ...baseStyles,
        fontSize: "14px",
        backgroundColor: state.isSelected
          ? "#569cb8"
          : state.isFocused && "#caf0f8",
      }),
    };

    const onChangeNilaiInvoice = (e) => {
      let nilai = e.target.value;
      if (isNaN(parseFloat(nilai)) || parseFloat(nilai) < 0) {
        nilai = 0;
        setData({ ...data, nilaiInvoice: "" });
      } else {
        setData({ ...data, nilaiInvoice: nilai });
      }
    };

    const onChangeNomorSeriFakturPajak = (e) => {
      const { value } = e.target;
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

        setData({ ...data, nomerSeriFakturPajak: nilai });
      } catch (err) {
        return setData({ ...data, nomerSeriFakturPajak: "" });
      }
    };

    const onChangeInvoiceFile = (e, index) => {
      if (e.target.files[0] !== undefined) {
        const file = e.target.files[0];
        if (file.size <= 2000000) {
          GetBase64(file)
            .then((result) => {
              const isExists = invoiceFiles.some((_, i) => i === index);

              if (isExists) {
                setInvoiceFiles((prev) =>
                  prev.map((invoice, i) =>
                    i === index
                      ? { ...invoice, base64: result, name: file.name }
                      : invoice
                  )
                );
              } else {
                setInvoiceFiles([
                  ...invoiceFiles,
                  { base64: result, name: file.name },
                ]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          toast.error("Maksimal ukuran file adalah 2mb");
          return;
        }
      }
    };

    const onChangePajakFile = (e, index) => {
      if (e.target.files[0] !== undefined) {
        const file = e.target.files[0];
        if (file.size <= 2000000) {
          GetBase64(file)
            .then((result) => {
              const isExists = pajakFiles.some((_, i) => i === index);

              if (isExists) {
                setPajakFiles((prev) =>
                  prev.map((pajak, i) =>
                    i === index
                      ? { ...pajak, base64: result, name: file.name }
                      : pajak
                  )
                );
              } else {
                setPajakFiles([
                  ...pajakFiles,
                  { base64: result, name: file.name },
                ]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          toast.error("Maksimal ukuran file adalah 2mb");
          return;
        }
      }
    };

    return (
      <>
        <Toaster richColors position="top-center" />
        <table>
          <thead className="bg-[#305496] text-white ">
            <tr>
              {activeStep !== 2 && (
                <td className="w-[80px] min-w-[80px] max-w-[80px] text-center p-2 rounded-tl-md">
                  Action
                </td>
              )}
              {vendorType === "Beli Putus" && (
                <>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] text-center p-2">
                    Nomor PO
                  </td>
                  <td className="!w-[180px] !min-w-[150px] !max-w-[150px] text-center p-2">
                    Tanggal PO
                  </td>
                </>
              )}
              {vendorType !== "Beli Putus" && (
                <td className="w-[250px] min-w-[250px] max-w-[250px] text-center p-2">
                  Lokasi
                </td>
              )}
              <td className="w-[250px] min-w-[250px] max-w-[250px] text-center p-2">
                Nomor Invoice
              </td>
              {vendorType === "Beli Putus" && (
                <td className="!w-[180px] !min-w-[150px] !max-w-[150px] text-center p-2">
                  Tanggal Invoice
                </td>
              )}

              <td className="w-[150px] min-w-[150px] max-w-[150px] text-center p-2">
                Nilai Invoice
              </td>

              <td
                className={`w-[250px] min-w-[250px] max-w-[250px] text-center p-2 ${
                  activeStep !== 2 && "rounded-tr-md"
                }  `}
              >
                Nomor Seri Faktur Pajak
              </td>

              {vendorType !== "Beli Putus" && activeStep === 2 && (
                <>
                  <td className="w-[250px] min-w-[250px] max-w-[250px] text-center p-2">
                    Invoice File
                  </td>
                  <td className="w-[250px] min-w-[250px] max-w-[250px] text-center p-2 rounded-tr-md">
                    Faktur Pajak FIle
                  </td>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 &&
              invoices.map((invoice, i) =>
                !invoice.editMode ? (
                  <tr key={i}>
                    {activeStep !== 2 && (
                      <td className="p-2 ">
                        <div className="flex gap-1">
                          <FaRegEdit
                            className="text-sky-600 cursor-pointer"
                            onClick={() => onClickEdit(invoice, i)}
                          />
                          <MdOutlineDelete
                            className="text-red-600 cursor-pointer"
                            onClick={() => onClickDelete(i)}
                          />
                        </div>
                      </td>
                    )}

                    {vendorType === "Beli Putus" && (
                      <>
                        <td className="p-2 align-top">
                          <div>{invoice.nomorPo}</div>
                        </td>
                        <td className="p-2">
                          <div>
                            {dayjs(invoice.datePo).format("DD MMMM, YYYY")}
                          </div>
                        </td>
                      </>
                    )}

                    {vendorType !== "Beli Putus" && (
                      <td className="p-2 align-top">
                        <div>{invoice.lokasi?.label}</div>
                      </td>
                    )}

                    <td className="p-2 align-top">
                      <div>{invoice.nomorInvoice}</div>
                    </td>

                    {vendorType === "Beli Putus" && (
                      <td className="p-2">
                        <div>
                          {dayjs(invoice.tanggalInvoice).format(
                            "DD MMMM, YYYY"
                          )}
                        </div>
                      </td>
                    )}

                    <td className="p-2 align-top">
                      <div className="text-right">
                        {accountingNumber(invoice.nilaiInvoice)}
                      </div>
                    </td>

                    <td className="p-2 align-top">
                      <div>{invoice.nomerSeriFakturPajak}</div>
                    </td>

                    {vendorType !== "Beli Putus" && activeStep === 2 && (
                      <>
                        <td className=" p-2 align-top">
                          <div className="flex flex-col gap-2 w-[150px]">
                            <label
                              htmlFor={`invoiceFile${i}`}
                              className="cursor-pointer border rounded-md py-2 px-3 bg-[#fff2cc] text-center"
                            >
                              Browse File
                            </label>
                            <input
                              className="hidden"
                              type="file"
                              name={`invoiceFile${i}`}
                              id={`invoiceFile${i}`}
                              accept="image/*, .pdf"
                              onChange={(e) => onChangeInvoiceFile(e, i)}
                            />
                            {invoiceFiles[i] !== undefined ? (
                              <p className="mt-3 text-sm">
                                {invoiceFiles[i]?.name}
                              </p>
                            ) : (
                              invoiceFilesUploaded[i] && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${invoiceFilesUploaded[i]}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )
                            )}
                          </div>
                        </td>
                        <td className=" p-2 align-top">
                          <div className="flex flex-col gap-2 w-[150px]">
                            <label
                              htmlFor={`pajakFile${i}`}
                              className="cursor-pointer border rounded-md py-2 px-3 bg-[#fff2cc] text-center"
                            >
                              Browse File
                            </label>
                            <input
                              className="hidden"
                              type="file"
                              name={`pajakFile${i}`}
                              id={`pajakFile${i}`}
                              accept="image/*, .pdf"
                              onChange={(e) => onChangePajakFile(e, i)}
                            />
                            {pajakFiles[i] !== undefined ? (
                              <p className="mt-3 text-sm">
                                {pajakFiles[i]?.name}
                              </p>
                            ) : (
                              pajakFilesUploaded[i] && (
                                <a
                                  href={`${apiExport}fin/transactionact/view_portal_file.jsp?file=${pajakFilesUploaded[i]}`}
                                  target="_blank"
                                  className="underline cursor-pointer text-blue-500"
                                  rel="noreferrer"
                                >
                                  File terupload
                                </a>
                              )
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ) : (
                  <tr key={i}>
                    {activeStep !== 2 && (
                      <td className="p-2">
                        <div className="flex gap-1">
                          <FaRegSave
                            className="text-sky-600 cursor-pointer"
                            onClick={() => onClickSave(i)}
                          />
                          <MdOutlineCancel
                            className="text-red-600 cursor-pointer"
                            onClick={onClickCancel}
                          />
                        </div>
                      </td>
                    )}

                    {vendorType === "Beli Putus" && (
                      <>
                        <td className="p-2">
                          <input
                            type="text"
                            className="border-gray-400 rounded-sm h-[38px] w-full"
                            value={data.nomorPo}
                            onChange={(e) =>
                              setData({
                                ...data,
                                nomorPo: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="date"
                            className="border-gray-400 rounded-sm h-[38px] w-full"
                            value={data.datePo}
                            onChange={(e) =>
                              setData({
                                ...data,
                                datePo: e.target.value,
                              })
                            }
                          />
                        </td>
                      </>
                    )}

                    {vendorType !== "Beli Putus" && (
                      <td className="p-2">
                        <Select
                          value={data.lokasi}
                          menuPlacement="auto"
                          menuPortalTarget={document.body}
                          onChange={(item) =>
                            setData({ ...data, lokasi: item })
                          }
                          className="whitespace-nowrap"
                          options={optionLokasi}
                          noOptionsMessage={() => "Data not found"}
                          styles={customeStyles}
                          required
                        />
                      </td>
                    )}
                    <td className="p-2">
                      <input
                        ref={inputNomorInvoiceRef}
                        autoFocus
                        type="text"
                        className="border-gray-400 rounded-sm h-[38px] w-full"
                        value={data.nomorInvoice}
                        onChange={(e) =>
                          setData({ ...data, nomorInvoice: e.target.value })
                        }
                      />
                    </td>

                    {vendorType === "Beli Putus" && (
                      <td className="p-2">
                        <input
                          type="date"
                          className="border-gray-400 rounded-sm h-[38px] w-full"
                          value={data.tanggalInvoice}
                          onChange={(e) =>
                            setData({
                              ...data,
                              tanggalInvoice: e.target.value,
                            })
                          }
                        />
                      </td>
                    )}

                    <td className="p-2">
                      <input
                        type="number"
                        className="border-gray-400 rounded-sm h-[38px] w-full"
                        value={data.nilaiInvoice}
                        onChange={onChangeNilaiInvoice}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        maxLength={19}
                        className="border border-gray-400 rounded-sm h-[38px] w-full"
                        value={data.nomerSeriFakturPajak}
                        onChange={onChangeNomorSeriFakturPajak}
                        onKeyUp={(e) => e.code === "Enter" && onClickSave(i)}
                      />
                    </td>
                  </tr>
                )
              )}

            {addMode && activeStep !== 2 && (
              <tr>
                {activeStep !== 2 && (
                  <td className="p-2">
                    <div className="flex gap-1">
                      <FaRegSave
                        className="text-sky-600 cursor-pointer"
                        onClick={() => onClickSave()}
                      />
                      <MdOutlineCancel
                        className="text-red-600 cursor-pointer"
                        onClick={onClickCancel}
                      />
                    </div>
                  </td>
                )}

                {vendorType === "Beli Putus" && (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border-gray-400 rounded-sm h-[38px] w-full"
                        value={data.nomorPo}
                        onChange={(e) =>
                          setData({
                            ...data,
                            nomorPo: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="date"
                        className="border-gray-400 rounded-sm h-[38px] w-full"
                        value={data.datePo}
                        onChange={(e) =>
                          setData({
                            ...data,
                            datePo: e.target.value,
                          })
                        }
                      />
                    </td>
                  </>
                )}

                {vendorType !== "Beli Putus" && (
                  <td className="p-2">
                    <Select
                      value={data.lokasi}
                      menuPlacement="auto"
                      menuPortalTarget={document.body}
                      onChange={(item) => setData({ ...data, lokasi: item })}
                      className="whitespace-nowrap"
                      options={optionLokasi}
                      noOptionsMessage={() => "Data not found"}
                      styles={customeStyles}
                      required
                    />
                  </td>
                )}
                <td className="p-2">
                  <input
                    ref={inputNomorInvoiceRef}
                    autoFocus
                    type="text"
                    className="border-gray-400 rounded-sm h-[38px] w-full"
                    value={data.nomorInvoice}
                    onChange={(e) =>
                      setData({ ...data, nomorInvoice: e.target.value })
                    }
                  />
                </td>

                {vendorType === "Beli Putus" && (
                  <td className="p-2">
                    <input
                      type="date"
                      className="border-gray-400 rounded-sm h-[38px] w-full"
                      value={data.tanggalInvoice}
                      onChange={(e) =>
                        setData({ ...data, tanggalInvoice: e.target.value })
                      }
                    />
                  </td>
                )}
                <td className="p-2">
                  <input
                    type="number"
                    className="border-gray-400 rounded-sm h-[38px] w-full"
                    value={data.nilaiInvoice}
                    onChange={onChangeNilaiInvoice}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    maxLength={19}
                    className="border border-gray-400 rounded-sm h-[38px] w-full"
                    value={data.nomerSeriFakturPajak}
                    onChange={onChangeNomorSeriFakturPajak}
                    onKeyUp={(e) => e.code === "Enter" && onClickSave()}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </>
    );
  }
);

export default TableInvoice;
