import './LayoutUser.css';
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import HeaderUser from "../HeaderUser/HeaderUser";

function LayoutUser() {
  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <HeaderUser />
      <div style={{ paddingTop: "4rem" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default LayoutUser;
