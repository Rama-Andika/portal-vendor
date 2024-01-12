import React, { useEffect } from "react";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";

import { linksWh } from "../data/dummy";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from "flowbite-react";
import { PiMonitorLight } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { HiCash } from "react-icons/hi";

const SidebarComponentWh = () => {
  const { activeMenu, setActiveMenu, screenSize, setOpenSidebar } =
    useStateContext();

  const handleCloseSidebar = (i) => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }

    // if (openSidebar.length > 0) {
    //   let arr;
    //   const list = openSidebar.map((item, index) => {
    //     if (i === index) {
    //       arr = item === false ? true : item;
    //     } else {S
    //       arr = item;
    //     }

    //     return arr;
    //   });

    //   console.log(list);
    // }
  };

  useEffect(() => {
    console.log("sidebar")
    if (linksWh.length > 0) {
      let arr;
      const list = linksWh.map((item, i) => {
        if (i === 1) {
          arr = true;
        } else {
          arr = false;
        }
        return arr;
      });

      setOpenSidebar(list);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text-white text=md ";
  const normalLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray";
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 relative">
      <div>
        <button
          type="button"
          onClick={() => setActiveMenu((prev) => !prev)}
          className="text-xl rounded-full pe-3 hover:bg-light-gray mt-4 block md:hidden dark:hover:bg-main-dark-bg absolute top-[-15px] right-[-10px]"
        >
          <MdOutlineCancel className="dark:text-white " />
        </button>
      </div>
      {activeMenu && (
        <>
          <div className="flex justify-between items-center ">
            <Link
              to="/admin"
              onClick={handleCloseSidebar}
              className="items-center gap-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <SiShopware />{" "}
              <span className="text-[16px] w-[222px] overflow-ellipsis overflow-hidden">
                PT KARYA PRIMA UNGGULAN
              </span>
            </Link>
          </div>
          <div className="mt-10 ml-[-20px]">
            <Sidebar aria-label="Sidebar with multi-level dropdown example ">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Collapse
                    label="Payment Monitor"
                    icon={PiMonitorLight}
                    open={false}
                  >
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/vendor-&-non-vendor`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <FaBuilding />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        vendor & non vendor
                      </span>
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/cod`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <HiCash />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        COD
                      </span>
                    </NavLink>
                  </Sidebar.Collapse>
                  <Sidebar.Collapse
                    label="Vendor"
                    icon={PiMonitorLight}
                    open
                  >
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/vendor/registration-list`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <FaBuilding />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        Registration List
                      </span>
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/vendor/vendor-list`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <HiCash />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        Vendor List
                      </span>
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/vendor/pending-task`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <HiCash />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        Pending Task
                      </span>
                    </NavLink>
                    <NavLink
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#0077b6" : "",
                      })}
                      to={`/admin/vendor/listing-penagihan`}
                      onClick={() => handleCloseSidebar()}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <HiCash />
                      <span className="capitalize whitespace-nowrap text-[14px]">
                        Listing Penagihan
                      </span>
                    </NavLink>
                  </Sidebar.Collapse>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarComponentWh;
