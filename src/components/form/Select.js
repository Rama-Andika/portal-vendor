import React from "react";

const Select = ({
  name = "",
  id = "",
  value,
  onChange,
  className = undefined,
  children,
}) => {
  return (
    <select
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className={`w-full border border-slate-300 rounded-sm focus:border focus:border-[#0077b6] ${className} `}
    >
      {children}
    </select>
  );
};

export default Select;
