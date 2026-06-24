import './LayoutDashboard.css';
import HeaderUser from '../HeaderUser/HeaderUser';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { Outlet } from "react-router-dom";

function LayoutDashboard() {
  return (
    <div style={{ background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <HeaderUser />
      <div className="flex pt-16">
        <Sidebar />
        {/* Main content area offset for sidebar */}
        <main className="flex-1 sm:ml-64 min-h-[calc(100vh-4rem)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <div className="sm:ml-64">
        <Footer />
      </div>
    </div>
  );
}

export default LayoutDashboard;
