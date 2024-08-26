import React from "react";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from "flowbite-react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";

const SidebarComponent = ({width}) => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text-white text=md ";
  const normalLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray";
  return (
    <div
      className={`border-r min-h-screen max-[646px]:h-full ${width} shadow-md overflow-y-auto pb-10 z-10 bg-white relative shrink-0 transition-all ease-in-out duration-200`}
    >
      <div onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} className="absolute top-2 right-2 shadow-md p-2 rounded-full text-xs cursor-pointer">
          X
      </div>
      <div className="flex items-center py-[20px] px-[24px] justify-between">
        <div className="flex items-center gap-[10px]">
          <Link
            to="/admin"
            onClick={handleCloseSidebar}
            className="items-center gap-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <SiShopware />{" "}
            <span className="text-[16px] w-[222px] overflow-ellipsis overflow-hidden">
              PT My Company
            </span>
          </Link>
        </div>
      </div>
      <div className="text-[15px]">
        <Sidebar aria-label="Sidebar with multi-level dropdown example ">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label="Company" icon={FiShoppingBag} open>
                <NavLink
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#0077b6" : "",
                  })}
                  to={`/vendor/profile`}
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  Profile
                </NavLink>
              </Sidebar.Collapse>
              <NavLink
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#0077b6" : "",
                })}
                to={`/vendor/penagihan `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div className="ms-[-30px] flex items-center gap-3 ">
                  <div className="text-[24px]">
                    <LiaFileInvoiceSolid />
                  </div>
                  <div>Penagihan</div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#0077b6" : "",
                })}
                to={`/vendor/monitoring `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div className="ms-[-30px] flex items-center gap-3 ">
                  <div className="text-[24px]">
                    <LiaFileInvoiceSolid />
                  </div>
                  <div>Monitoring</div>
                </div>
              </NavLink>
              <NavLink
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#0077b6" : "",
                })}
                to={`/vendor/kartuhutang `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div className="ms-[-30px] flex items-center gap-3 ">
                  <div className="text-[24px]">
                    <LiaFileInvoiceSolid />
                  </div>
                  <div>Kartu Hutang</div>
                </div>
              </NavLink>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </div>
  );
};

export default SidebarComponent;
