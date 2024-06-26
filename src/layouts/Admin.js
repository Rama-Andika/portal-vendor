//import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SidebarComponent from "../components/SidebarComponent";
import { useStateContext } from "../contexts/ContextProvider";
import PrivateRoute from "../routes/PrivateRoute";

const Admin = ({ children }) => {
  const { activeMenu, screenSize, setActiveMenu } = useStateContext();
  return (
    <div className="flex relative">
      {activeMenu ? (
        screenSize > 645 ? (
          <SidebarComponent width="w-[260px]" />
        ) : (
          <div className="absolute w-full bg-half-transparent h-full z-[9999]">
            <SidebarComponent width="w-[260px]" />
          </div>
        )
      ) : (
        <SidebarComponent width="w-0" />
      )}

      <Navbar>
        <PrivateRoute />
      </Navbar>

      {/* <Footer /> */}
    </div>
  );
};

export default Admin;
