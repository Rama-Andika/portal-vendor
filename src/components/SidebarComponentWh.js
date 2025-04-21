import React, { useEffect } from "react";
import { SiShopware } from "react-icons/si";
import { linksWh } from "../data/dummy";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from "flowbite-react";
import { FaBuilding } from "react-icons/fa";
import { HiCash } from "react-icons/hi";
import { TbBuildingCommunity } from "react-icons/tb";
import { MdMonitor } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";

const SidebarComponentWh = ({ width }) => {
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
    <div
      className={`border-r min-h-screen max-[646px]:h-full ${width} shadow-md overflow-y-auto pb-10 z-10 bg-white relative shrink-0 transition-all ease-in-out duration-200`}
    >
      <div
        onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)}
        className="absolute top-2 right-2 shadow-md p-2 rounded-full text-xs cursor-pointer"
      >
        X
      </div>
      <div className="flex items-center py-[20px] px-[24px] justify-between">
        <div className="flex items-center gap-[10px]">
          <Link
            onClick={handleCloseSidebar}
            className="items-center gap-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <SiShopware />{" "}
            <span className="text-[16px] w-[222px] overflow-ellipsis overflow-hidden">
              PT KARYA PRIMA UNGGULAN
            </span>
          </Link>
        </div>
      </div>
      <div className="text-[15px]">
        <Sidebar aria-label="Sidebar with multi-level dropdown example ">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Collapse
                label="Payment Monitor"
                icon={MdMonitor}
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
                    vendor
                  </span>
                </NavLink>
                {/* <NavLink
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
                </NavLink> */}
              </Sidebar.Collapse>
              <Sidebar.Collapse label="Vendor" icon={TbBuildingCommunity} open>
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
              <NavLink
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#0077b6" : "",
                })}
                to="/admin/third-party-company/settlement"
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div className="ms-[-30px] flex items-center gap-3 ">
                  <div className="text-[24px]">
                    <LiaFileInvoiceSolid />
                  </div>
                  <div>Edufund</div>
                </div>
              </NavLink>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </div>
  );
};

export default SidebarComponentWh;
