import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteAdmin = () => {
  const token = Cookies.get("admin_token");

  if (!token) {
    return <Navigate to="/admin" />;
  }

  return <Outlet/>;
};

export default PrivateRouteAdmin;
