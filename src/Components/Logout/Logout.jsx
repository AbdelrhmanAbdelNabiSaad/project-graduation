import { useState } from "react";
import { useEffect } from "react"; 
import './Logout.css';
import axios from "axios";



function Logout() {
    const token = localStorage.getItem('token');

    return axios.post("https://jooobs.runasp.net/api/Auth/logout", {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export default Logout;