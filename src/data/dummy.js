import React from "react";

import { FiShoppingBag } from "react-icons/fi";
import { PiMonitorLight } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { HiCash } from "react-icons/hi";
import {LiaFileInvoiceSolid} from 'react-icons/lia'
// import { MdOutlineShoppingBag } from "react-icons/md";
// import { BiBasket } from "react-icons/bi";
// import { FiUsers } from "react-icons/fi";

export const links = [
  {
    title: "Company",
    name: "registration",
    icon: FiShoppingBag,
    links: [{ name: "profile" }],
  },
  {
    title: "Invoice",
    name: "invoice",
    icon: LiaFileInvoiceSolid,
    links: [{ name2:"invoice", name: "upload invoice" }, {name2:"invoice", name: "records" }],
  },
  // {
  //   title: "Products",
  //   name: "products",
  //   icon: <MdOutlineShoppingBag />,
  //   links: [],
  // },
  // {
  //   title: "Orders",
  //   name: "orders",
  //   icon: <BiBasket />,
  //   links: [],
  // },
  // {
  //   title: "Customers",
  //   name: "customers",
  //   icon: <FiUsers />,
  //   links: [],
  // },
];

export const linksWh = [
  {
    title: "Payment Monitor",
    name: "payment",
    icon: PiMonitorLight,
    links: [
      { name: "vendor & non vendor", icon: <FaBuilding /> },
      { name: "COD", icon: <HiCash /> },
    ],
  },
  {
    title: "Vendor",
    name: "vendor",
    icon: PiMonitorLight,
    links: [
      { name2:'vendor', name: "registration list", icon: <FaBuilding /> },
      { name2:'vendor', name: "vendor list", icon: <HiCash /> },
    ],
  },
  // {
  //   title: "Products",
  //   name: "products",
  //   icon: <MdOutlineShoppingBag />,
  //   links: [],
  // },
  // {
  //   title: "Orders",
  //   name: "orders",
  //   icon: <BiBasket />,
  //   links: [],
  // },
  // {
  //   title: "Customers",
  //   name: "customers",
  //   icon: <FiUsers />,
  //   links: [],
  // },
];
