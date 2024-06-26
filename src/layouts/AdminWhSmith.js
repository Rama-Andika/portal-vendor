import Footer from "../components/Footer";
import NavbarAdmin from "../components/NavbarAdmin";
import SidebarComponentWh from "../components/SidebarComponentWh";
import { useStateContext } from "../contexts/ContextProvider";
import PrivateRouteAdmin from "../routes/PrivateRouteAdmin";

const AdminWhSmith = ({ children }) => {
  const { activeMenu, screenSize } = useStateContext();
  return (
    <div className="flex relative">
      {activeMenu ? (
        screenSize > 645 ? (
          <SidebarComponentWh width="w-[260px]" />
        ) : (
          <div className="absolute w-full bg-half-transparent h-full z-[9999]">
            <SidebarComponentWh width="w-[260px]" />
          </div>
        )
      ) : (
        <SidebarComponentWh width="w-0" />
      )}

      <NavbarAdmin>
        <PrivateRouteAdmin />
      </NavbarAdmin>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminWhSmith;
