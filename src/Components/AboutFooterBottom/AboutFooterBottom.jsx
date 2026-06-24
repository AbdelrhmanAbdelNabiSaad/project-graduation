import { useState } from "react";
import { useEffect } from "react"; 
import './AboutFooterBottom.css';



function AboutFooterBottom() {
    return (
      <>
        <div className="footer-bottom container mx-auto py-[50px]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="card">
              <h4 className="text-slate-800 text-2xl font-bold">
                SmartRecruit
              </h4>
              <p className="text-lg text-gray-500 my-2">
                Empowering the global workforce through intelligent, unbiased
                matching technology. Redefining the human- machine partnership
                in the talent economy.
              </p>
            </div>
            <div className="card">
              <h4 className="text-slate-800 text-2xl font-bold">Company</h4>
              <ul>
                <li className="text-lg text-gray-500 my-2">About Us</li>
                <li className="text-lg text-gray-500 my-2">Careers</li>
                <li className="text-lg text-gray-500 my-2">Press</li>
                <li className="text-lg text-gray-500 my-2">Our Culture</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-slate-800 text-2xl font-bold">Support</h4>
              <ul>
                <li className="text-lg text-gray-500 my-2">Help Center</li>
                <li className="text-lg text-gray-500 my-2">Contact</li>
                <li className="text-lg text-gray-500 my-2">Guides</li>
                <li className="text-lg text-gray-500 my-2">API Documentation</li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-slate-800 text-2xl font-bold">Legal</h4>
              <ul>
                <li className="text-lg text-gray-500 my-2">Privacy Policy</li>
                <li className="text-lg text-gray-500 my-2">Terms Of Services</li>
                <li className="text-lg text-gray-500 my-2">Cookies Policy</li>
                <li className="text-lg text-gray-500 my-2">Security Standards</li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
}

export default AboutFooterBottom;