import dayjs from "dayjs";
import React from "react";
import { FaRegEdit, FaRegSave } from "react-icons/fa";
import { MdOutlineCancel, MdOutlineDelete } from "react-icons/md";
import accountingNumber from "../../../../components/functions/AccountingNumber";
import Select from "react-select";

const TableInvoice = React.memo(
  ({
    data,
    setData,
    inputNomorInvoiceRef,
    addMode = false,
    invoices = [],
    vendorType,
    optionLokasi,
    onClickSave,
    onClickCancel,
    onClickEdit,
    onClickDelete,
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
    return (
      <table>
        <thead className="bg-[#305496] text-white ">
          <tr>
            <td className="w-[80px] min-w-[80px] max-w-[80px] text-start p-2 rounded-tl-md">
              Action
            </td>
            {vendorType !== "Beli Putus" && (
              <td className="w-[250px] min-w-[250px] max-w-[250px] text-start p-2">
                Lokasi
              </td>
            )}
            <td className="w-[250px] min-w-[250px] max-w-[250px] text-start p-2">
              Nomor Invoice
            </td>
            {vendorType !== "Beli Putus" && (
              <>
                <td className="w-[250px] min-w-[150px] max-w-[150px] text-start p-2">
                  Start Date
                </td>
                <td className="w-[250px] min-w-[150px] max-w-[150px] text-start p-2">
                  End Date
                </td>
              </>
            )}

            {vendorType === "Beli Putus" && (
              <td className="!w-[180px] !min-w-[150px] !max-w-[150px] text-start p-2">
                Tanggal Invoice
              </td>
            )}

            <td className="w-[150px] min-w-[150px] max-w-[150px] text-start p-2 rounded-tr-md">
              Nilai Invoice
            </td>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 &&
            invoices.map((invoice, i) =>
              !invoice.editMode ? (
                <tr key={i}>
                  <td className="p-2">
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
                  {vendorType !== "Beli Putus" && (
                    <td className="p-2">
                      <div>{invoice.lokasi?.label}</div>
                    </td>
                  )}

                  <td className="p-2">
                    <div>{invoice.nomorInvoice}</div>
                  </td>

                  {vendorType !== "Beli Putus" && (
                    <>
                      <td className="p-2">
                        <div>
                          {dayjs(invoice.startDate).format("DD MMMM, YYYY")}
                        </div>
                      </td>
                      <td className="w-[250px] min-w-[250px] max-w-[250px] text-start p-2">
                        <div>
                          {dayjs(invoice.endDate).format("DD MMMM, YYYY")}
                        </div>
                      </td>
                    </>
                  )}

                  {vendorType === "Beli Putus" && (
                    <td className="p-2">
                      <div>
                        {dayjs(invoice.tanggalInvoice).format("DD MMMM, YYYY")}
                      </div>
                    </td>
                  )}

                  <td className="p-2">
                    <div>{accountingNumber(invoice.nilaiInvoice)}</div>
                  </td>
                </tr>
              ) : (
                <tr key={i}>
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

                  {vendorType !== "Beli Putus" && (
                    <>
                      <td className="p-2">
                        <input
                          type="date"
                          className="border-gray-400 rounded-sm h-[38px] w-full"
                          value={data.startDate}
                          onChange={(e) =>
                            setData({ ...data, startDate: e.target.value })
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          className="border-gray-400 rounded-sm h-[38px] w-full"
                          value={data.endDate}
                          onChange={(e) =>
                            setData({ ...data, endDate: e.target.value })
                          }
                        />
                      </td>
                    </>
                  )}

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
                      onKeyUp={(e) => e.code === "Enter" && onClickSave(i)}
                    />
                  </td>
                </tr>
              )
            )}

          {addMode && (
            <tr>
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

              {vendorType !== "Beli Putus" && (
                <>
                  <td className="p-2">
                    <input
                      type="date"
                      className="border-gray-400 rounded-sm h-[38px] w-full"
                      value={data.startDate}
                      onChange={(e) =>
                        setData({ ...data, startDate: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      className="border-gray-400 rounded-sm h-[38px] w-full"
                      value={data.endDate}
                      onChange={(e) =>
                        setData({ ...data, endDate: e.target.value })
                      }
                    />
                  </td>
                </>
              )}

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
                  onKeyUp={(e) => e.code === "Enter" && onClickSave()}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
);

export default TableInvoice;
