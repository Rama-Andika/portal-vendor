import NavbarAdmin from "../components/NavbarAdmin";
import SidebarComponentAdmin from "../components/SidebarComponentAdmin";
import { useStateContext } from "../contexts/ContextProvider";
import PrivateRouteAdmin from "../routes/PrivateRouteAdmin";

const AdminWhSmith = ({ children }) => {
  const { activeMenu, screenSize } = useStateContext();
  return (
    <div className="flex relative">
      {activeMenu ? (
        screenSize > 645 ? (
          <SidebarComponentAdmin width="w-[260px]" />
        ) : (
          <div className="absolute w-full bg-half-transparent h-full z-[9999]">
            <SidebarComponentAdmin width="w-[260px]" />
          </div>
        )
      ) : (
        <SidebarComponentAdmin width="w-0" />
      )}

      <NavbarAdmin>
        <PrivateRouteAdmin />
      </NavbarAdmin>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminWhSmith;
