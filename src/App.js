import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/vendor/Registration";
import LoginWh from "./pages/LoginWh";
import VendorAndNonVendor from "./pages/admin/VendorAndNonVendor";
import Cod from "./pages/admin/Cod";
import Profile from "./pages/vendor/Profile";
import UploadFile from "./pages/vendor/UploadFile";
import InvoiceRecords from "./pages/vendor/InvoiceRecords";
import VendorRegistrationList from "./pages/admin/VendorRegistrationList";
import VendorList from "./pages/admin/VendorList";
import PendingTask from "./pages/admin/PendingTask";
import ListingPenagihan from "./pages/admin/ListingPenagihan";
import Penagihan from "./pages/vendor/penagihan/Penagihan";
import Monitoring from "./pages/vendor/Monitoring";
import EdtPenagihan from "./pages/vendor/penagihan/EdtPenagihan";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Login />} />
          <Route path="/wh-smith" element={<LoginWh />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="vendor/profile" element={<Profile />} />
          <Route path="vendor/invoice/upload-invoice" element={<UploadFile />} />
          <Route path="vendor/invoice/records" element={<InvoiceRecords />} />
          <Route path="vendor/penagihan" element={<Penagihan />} />
          <Route path="vendor/penagihan/edit/:id" element={<EdtPenagihan />} />
          <Route path="vendor/monitoring" element={<Monitoring />} />
          <Route path="admin/vendor-&-non-vendor" element={<VendorAndNonVendor />} />
          <Route path="admin/cod" element={<Cod />} />
          <Route path="admin/vendor/registration-list" element={<VendorRegistrationList />} />
          <Route path="admin/vendor/vendor-list" element={<VendorList />} />
          <Route path="admin/vendor/pending-task" element={<PendingTask />} />
          <Route path="admin/vendor/listing-penagihan" element={<ListingPenagihan />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
