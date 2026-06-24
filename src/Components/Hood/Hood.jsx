import { useState } from "react";
import { useEffect } from "react"; 
import './Hood.css';
import tech from '../../assets/asp.svg'
import tech2 from '../../assets/react-2.svg'
import tech3 from '../../assets/sql.svg'
import tech4 from '../../assets/openai.svg'


function Hood() {
    return (
      <>
        <div className="container mx-auto py-[100px] text-center">
          <h2 className="text-3xl font-bold" style={{color: 'var(--text-primary)'}}>The Engine Under The Hood</h2>
          <p className="mt-3 text-gray-500">
            Built with enterprise-grade technology for speed and security.
          </p>
          <div className="mt-5 flex flex-col md:flex-row justify-center items-center gap-5">
            <div className="tech">
              <img src={tech} className="mx-auto" alt="" />
              <h4 className="text-xl text-gray-500 mt-2">ASP.NET CORE</h4>
            </div>
            <div className="tech">
              <img src={tech2} className="mx-auto" alt="" />
              <h4 className="text-xl text-gray-500 mt-2">REACT</h4>
            </div>
            <div className="tech">
              <img src={tech3} className="mx-auto" alt="" />
              <h4 className="text-xl text-gray-500 mt-2">SQL SERVER</h4>
            </div>
            <div className="tech">
              <img src={tech4} className="mx-auto" alt="" />
              <h4 className="text-xl text-gray-500 mt-2">OPENAI</h4>
            </div>
          </div>
        </div>
      </>
    );
}

export default Hood;