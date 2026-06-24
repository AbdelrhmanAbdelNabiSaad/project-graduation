import { useState } from "react";
import { useEffect } from "react"; 
import './Mission.css';
import mission from '../../assets/Team working together.svg'

function Mission() {
    return (
      <>
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center py-[100px] gap-5">
          <div className="image w-full">
            <img src={mission} alt="Team Work" className="w-full h-[400px]" />
          </div>
          <div className="text">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-gray-500 leading-10">
              To simplify the complex journey of hiring and being hired. We
              believe every candidate deserves to be seen for their true
              potential, and every company deserves to find their next
              game-changer without the noise.
            </p>
            <p className="text-gray-500 leading-10">
              By automating the repetitive, we empower recruiters to focus on
              what matters most: <span className="font-bold" style={{color: 'var(--text-brand)'}}>Human Connection.</span>
            </p>
          </div>
        </div>
      </>
    );
}

export default Mission;