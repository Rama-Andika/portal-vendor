
//import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SidebarComponent from "../components/SidebarComponent";
import { useStateContext } from "../contexts/ContextProvider";
import PrivateRoute from "../routes/PrivateRoute";

const Admin = ({ children }) => {
  const { activeMenu, screenSize, setActiveMenu } = useStateContext();
  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {activeMenu ? (
        screenSize < 768 ? (
          <div
            className="bg-half-transparent absolute w-full sidebar-index h-full"
            onClick={() => setActiveMenu(false)}
          >
            <div
              className="float-left duration-1000 w-72 ease-in-out transition-all dark:bg-secondary-dark-bg bg-white h-full"
              onClick={() => setActiveMenu(false)}
            >
              <SidebarComponent />
            </div>
          </div>
        ) : (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <SidebarComponent />
          </div>
        )
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <SidebarComponent />
        </div>
      )}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
          activeMenu ? "md:ml-72 " : "flex-2"
        }`}
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>

        <div>{<PrivateRoute />}</div>

        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Admin;
