import React from "react";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from "flowbite-react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";

const SidebarComponent = () => {
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
              to="/"
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
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarComponent;
