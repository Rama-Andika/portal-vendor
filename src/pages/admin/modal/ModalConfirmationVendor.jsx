import { Backdrop, Fade, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";

const api = process.env.REACT_APP_BASEURL;

const ModalConfirmationVendor = ({
  open,
  setOpen,
  code,
  screenSize,
  onClick,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [vendor, setVendor] = useState(undefined);
  const [message, setMessage] = useState("");

  const getVendor = async () => {
    try {
      if (code !== undefined && code.length > 0) {
        const response = await fetch(`${api}api/vendor`, {
          method: "POST",
          body: JSON.stringify({
            code: code,
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        if (result.data.length > 0) {
          const { data } = result;
          setVendor(data[0]);

          const text = ` Terdapat vendor kode '${code}' dengan nama ${data[0].name}.\n`;

          setMessage(text);
        } else {
          setMessage(` Belum ada vendor dengan kode '${code}.'\n`);
        }
      } else {
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) {
      getVendor();
    }
  }, [open]);

  console.log(code);

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
            className={`rounded-md border-0 bg-white py-5 px-7 absolute top-[50%] left-1/2 translate-x-[-50%] translate-y-[-50%] overflow-y-auto z-[999999]  ${
              screenSize <= 548 ? "w-[90%]" : "w-fit"
            }`}
          >
            <div className="flex justify-center items-center max-[915px]:flex-col gap-2">
              <div>
                <IoWarning className="w-[120px] h-[120px] text-yellow-300" />
              </div>
              <div>
                <div className="text-[20px] mb-5 font-semibold ">
                  Konfirmasi
                </div>
                <div className="text-[16px]font-semibold whitespace-pre-line">
                  {code !== undefined ? message : ""}
                  Apakah anda yakin ingin melanjutkan proses ini? proses ini
                  akan membuat vendor baru jika kode dikosongkan atau kode yang
                  sudah dimasukkan ternyata belum ada pada backoffice,
                  sebaliknya sistem akan mengubah data vendor yang sudah ada
                  sebelumnya.
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="border py-2 px-3 rounded-md"
                onClick={handleClose}
              >
                No
              </button>
              <button
                type="button"
                className="bg-red-500 border py-2 px-3 rounded-md text-white"
                onClick={onClick}
              >
                Yes
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ModalConfirmationVendor;
