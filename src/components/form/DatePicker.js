import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React from "react";

const DatePickerComponent = ({ className = undefined, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          className={`w-full ${className}`}
          value={value}
          onChange={onChange}
          slotProps={{ textField: { size: "small" } }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
