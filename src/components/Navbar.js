import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import { useStateContext } from "../contexts/ContextProvider";
import { BiSolidUpArrow } from "react-icons/bi";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
    />
    {icon}
  </button>
);

const Navbar = () => {
  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };
  const { setActiveMenu, screenSize, setScreenSize } = useStateContext();
  const [dropdown, setDropdown] = useState(false);

  const dropDownSection = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const onClickDropdown = () => {
    if (!dropdown) {
      dropDownSection.current.classList.remove("hidden");
    } else {
      dropDownSection.current.classList.add("hidden");
    }

    setDropdown((prevDropdown) => !prevDropdown);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("vendor_id");
    toast.success("Logout Successfully", {
      duration: 4000,
      position: "top-right",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    navigate("/");
  };

  return (
    <div className="flex p-2 md:mx-6 relative gap-5 z-[99]">
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="#0077b6"
        icon={<AiOutlineMenu />}
      />
      <div
        onClick={onClickDropdown}
        className="flex absolute left-16 cursor-pointer z-[20]"
      >
        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg relative">
          <img
            src={unsplashimg.src}
            alt="avatar"
            className="rounded-full w-8 h-8"
          />
          <p>
            <span className="text-gray-400 text-14">Hi, </span>{" "}
            {/* <span className="text-gray-400 font-bold ml-1 text-14">Rama</span> */}
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />

          <div
            ref={dropDownSection}
            className="absolute bottom-[-40px] right-0 hidden"
          >
            <div className="flex flex-col items-center">
              <div className="text-[20px] text-white contrast-100">
                <BiSolidUpArrow />
              </div>
              <div
                onClick={logout}
                className="text-gray-400 text-14 py-2 px-5 bg-white drop-shadow-lg  mt-[-7px]"
              >
                <div>logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
