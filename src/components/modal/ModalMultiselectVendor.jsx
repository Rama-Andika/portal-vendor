import { Backdrop, Fade, Modal } from "@mui/material";
import React from "react";

const ModalMultiselectVendor = ({open, setOpen, handleOpen, handleClose}) => {
  return (
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
        <div></div>
      </Fade>
    </Modal>
  );
};

export default ModalMultiselectVendor;
