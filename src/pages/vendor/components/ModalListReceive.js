import { Backdrop, Fade, Modal } from "@mui/material";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useEffect, useState } from "react";
import accountingNumber from "../../../components/functions/AccountingNumber";
import dayjs from "dayjs";

const api = process.env.REACT_APP_BASEURL;
const ModalListReceive = ({ open, setIsOpen, vendorId, handleSelect }) => {
  const { screenSize } = useStateContext();
  const [data, setData] = useState([]);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${api}api/portal-vendor/receives?vendor_id=${vendorId}`
          );

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const result = await response.json();
          if (result && result.data) {
            setData(result.data);
          }
        } catch (error) {
          setData([]);
        }
      };

      fetchData();
    }
  }, [open]);

  if (!open) return null;
  return (
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
            className={`rounded-md border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] h-[400px] overflow-y-auto z-[999999]  ${
              screenSize <= 1087 ? "w-[90%]" : "w-fit"
            }`}
          >
            <div className="text-[20px] mb-5 font-semibold ">List Incoming</div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="  whitespace-nowrap text-sm">
                  <tr className="text-left">
                    <th className="p-2">Action</th>
                    <th className="p-2">Nomor Invoice</th>
                    <th className="p-2">Nomor Incoming</th>
                    <th className="p-2">Nomor PO</th>
                    <th className="p-2">Tanggal Incoming</th>
                    <th className="p-2 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length === 0 && (
                    <tr>
                      <td className="p-2 text-center" colSpan={6}>
                        Tidak ada data yang ditemukan, silahkan menghubungi admin
                      </td>
                    </tr>
                  )}
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 text-blue-400 cursor-pointer">
                        <div onClick={() => handleSelect(item)}>select</div>
                      </td>
                      <td className="p-2">{item.nomorInvoice}</td>
                      <td className="p-2">{item.nomorReceive}</td>
                      <td className="p-2">{item.nomorPurchase}</td>
                      <td className="p-2 whitespace-nowrap">
                        {item.date
                          ? dayjs(item.date).format("DD MMMM YYYY")
                          : ""}
                      </td>
                      <td className="p-2 text-right">
                        {accountingNumber(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalListReceive;
