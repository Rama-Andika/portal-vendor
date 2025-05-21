export const Th = ({ className = undefined, children }) => {
  return (
    <th
      className={`border border-[#828282] bg-[#EAF4F4] !w-[170px] !min-w-[170px]  ${className}`}
    >
      {children}
    </th>
  );
};

export const Td = ({ className = undefined, onClick, children }) => {
  return (
    <td onClick={onClick} className={`border border-[#828282] ${className}`}>
      {children}
    </td>
  );
};
