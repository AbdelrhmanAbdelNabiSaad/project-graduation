import { useState } from "react";
import { useEffect } from "react"; 
import './DashboardUser.css';
import Sidebar from "../Sidebar/Sidebar";
import InfoDashboard from "../InfoDashboard/InfoDashboard";



function DashboardUser() {
    return (
        <>
            <div className="row">
                <Sidebar />
                <InfoDashboard />
           </div>
        </>
    )
}

export default DashboardUser;