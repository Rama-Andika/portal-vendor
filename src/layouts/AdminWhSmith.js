
import Footer from "../components/Footer";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarComponentWh from "../components/SidebarComponentWh";
import { useStateContext } from "../contexts/ContextProvider";
import PrivateRouteAdmin from "../routes/PrivateRouteAdmin";

const AdminWhSmith = ({ children }) => {
  const { activeMenu, screenSize } = useStateContext();
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {activeMenu ? (
        screenSize < 768 ? (
          <div
            className="bg-half-transparent absolute w-full sidebar-index h-full"
          
          >
            <div
              className="float-left duration-1000 w-72 ease-in-out transition-all dark:bg-secondary-dark-bg bg-white h-full"

            >
              <SidebarComponentWh />
            </div>
          </div>
        ) : (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <SidebarComponentWh />
          </div>
        )
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <SidebarComponentWh />
        </div>
      )}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full z-50 ${
          activeMenu ? "md:ml-72 " : "flex-2"
        }`}
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <NavbarAdmin />
        </div>

        <div><PrivateRouteAdmin /></div>

        <Footer className="mt-[280px] items-end" />
      </div>
    </div>
  );
};

export default AdminWhSmith;
