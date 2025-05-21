import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      value,
      onChange,
      type = "text",
      name = "",
      id = "",
      className = undefined,
      accept = ""
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        id={id}
        accept={accept}
        className={`w-full !h-[40px] border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] ${className}`}
      />
    );
  }
);

export default Input;
