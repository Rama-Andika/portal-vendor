import React from "react";

import { FiShoppingBag } from "react-icons/fi";
import { PiMonitorLight } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { HiCash } from "react-icons/hi";
import {LiaFileInvoiceSolid, LiaMoneyBillWaveAltSolid} from 'react-icons/lia'
import {PiBuildingsLight} from 'react-icons/pi'
import { MdPendingActions } from "react-icons/md";
import { RiBuilding2Line } from "react-icons/ri";
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
  {
    title: "Penagihan",
    name: "penagihan",
    icon: <LiaFileInvoiceSolid/>,
    links: [],
  },
  {
    title: "Monitoring",
    name: "monitoring",
    icon: <LiaFileInvoiceSolid/>,
    links: [],
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
    icon: PiBuildingsLight,
    links: [
      { name2:'vendor', name: "registration list", icon: <RiBuilding2Line /> },
      { name2:'vendor', name: "vendor list", icon: <HiCash /> },
      { name2:'vendor', name: "pending task", icon: <MdPendingActions /> },
      { name2:'vendor', name: "listing penagihan", icon: <LiaMoneyBillWaveAltSolid /> },

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
