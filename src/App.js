import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/vendor/Registration";
import LoginWh from "./pages/LoginWh";
import VendorAndNonVendor from "./pages/admin/VendorAndNonVendor";
import Cod from "./pages/admin/Cod";
import Profile from "./pages/vendor/Profile";
import VendorRegistrationList from "./pages/admin/VendorRegistrationList";
import VendorList from "./pages/admin/VendorList";
import PendingTask from "./pages/admin/PendingTask";
import ListingPenagihan from "./pages/admin/ListingPenagihan";
import Penagihan from "./pages/vendor/penagihan/Penagihan";
import Monitoring from "./pages/vendor/Monitoring";
import EdtPenagihan from "./pages/vendor/penagihan/EdtPenagihan";
import { Toaster } from "react-hot-toast";
import AdminWhSmith from "./layouts/AdminWhSmith";
import Admin from "./layouts/Admin";
import { Worker } from "@react-pdf-viewer/core";
import VendorEdit from "./pages/admin/VendorEdit";

function App() {
  return (
    <>
      <Toaster />
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <BrowserRouter basename={"/portal-vendor"}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Admin />}>
              <Route path="vendor/profile" element={<Profile />} />
              <Route path="vendor/penagihan" element={<Penagihan />} />
              <Route
                path="vendor/penagihan/edit/:id"
                element={<EdtPenagihan />}
              />
              <Route path="vendor/monitoring" element={<Monitoring />} />
            </Route>

            <Route path="/admin" element={<LoginWh />} />
            <Route path="/registration" element={<Registration />} />

            <Route element={<AdminWhSmith />}>
              <Route
                path="admin/vendor-&-non-vendor"
                element={<VendorAndNonVendor />}
              />
              <Route path="admin/cod" element={<Cod />} />
              <Route
                path="admin/vendor/registration-list"
                element={<VendorRegistrationList />}
              />
              <Route path="admin/vendor/vendor-list" element={<VendorList />} />
              <Route
                path="admin/vendor/pending-task"
                element={<PendingTask />}
              />
              <Route
                path="admin/vendor/listing-penagihan"
                element={<ListingPenagihan />}
              />
              <Route path="admin/vendor/edit" element={<VendorEdit />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Worker>
    </>
  );
}

export default App;
