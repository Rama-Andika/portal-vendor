import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import { useStateContext } from "../contexts/ContextProvider";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const api = process.env.REACT_APP_BASEURL;

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

const NavbarAdmin = () => {
  const unsplashimg = {
    src: "https://source.unsplash.com/1600x900/?random",
    alt: "random unsplash image",
  };
  const { setActiveMenu, screenSize, setScreenSize } = useStateContext();
  const [dropdown, setDropdown] = useState(false);

  const dropDownSection = useRef();
  const [name,setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(`${api}api/portal-vendor/admin/login`,{
      method: "POST",
      body: JSON.stringify({
        id: Cookies.get("admin_id")
      })
    }).then((response) => response.json())
    .then((res) => {
      if(res.data.length > 0){
        const data = res.data[0]
        setName(data.username)
      }
      
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize]);

  const onClickDropdown = () => {
    setDropdown((prevDropdown) => !prevDropdown);
  };

  const logout = () => {
    Cookies.remove("admin_token");
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

    navigate("/admin");
  };

  return (
    <div
      className="flex p-2 md:mx-6 gap-5 z-[99]"
      onClick={() => dropdown && setDropdown(false)}
    >
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="#0077b6"
        icon={<AiOutlineMenu />}
      />
      <div
        onClick={onClickDropdown}
        className="flex relative cursor-pointer z-[20]"
      >
        <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg relative">
          <img
            src={unsplashimg.src}
            alt="avatar"
            className="rounded-full w-8 h-8"
          />
          <p>
            <span className="text-gray-400 text-14">Hi, {name} </span>{" "}
            {/* <span className="text-gray-400 font-bold ml-1 text-14">Rama</span> */}
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>
        {dropdown && (
          <div
            ref={dropDownSection}
            className="absolute top-[40px] right-0 "
          >
            <div className="bg-white shadow-md py-2">
              <div className="">
                <div
                  onClick={logout}
                  className="text-gray-400 text-14 py-2 px-5 "
                >
                  Logout
                </div>
              
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarAdmin;
