import React, { useEffect, useState } from "react";
import { SiShopware } from "react-icons/si";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from "flowbite-react";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { FiShoppingBag } from "react-icons/fi";

const url = process.env.REACT_APP_BASEURL;

const SidebarComponent = ({ width }) => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [company, setCompany] = useState(undefined);

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text=md ";
  const normalLink =
    "flex items-center gap-3 pt-3 pl-[40px] pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray";

  useEffect(() => {
    const getCompany = async () => {
      try {
        const response = await fetch(`${url}api/company`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const result = await response.json();
        setCompany(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCompany();
  }, []);

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
            to="/admin"
            onClick={handleCloseSidebar}
            className="items-center gap-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
          >
            <span className="text-[16px] w-[222px] overflow-ellipsis overflow-hidden">
              {company ? company.name : ""}
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
                  to={`/vendor/profile`}
                  onClick={handleCloseSidebar}
                  className={({ isActive }) =>
                    isActive ? `${activeLink} bg-main-color` : normalLink
                  }
                >
                  Profile
                </NavLink>
              </Sidebar.Collapse>
              <NavLink
                to={`/vendor/penagihan `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? `${activeLink} bg-main-color` : normalLink
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
                to={`/vendor/monitoring `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? `${activeLink} bg-main-color` : normalLink
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
                to={`/vendor/kartuhutang `}
                onClick={handleCloseSidebar}
                className={({ isActive }) =>
                  isActive ? `${activeLink} bg-main-color` : normalLink
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
