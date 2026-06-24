import { useState } from "react";
import { useEffect } from "react"; 
import './ProjectRecuitment.css';



function ProjectRecuitment() {
    return (
      <>
        <div className="container mx-auto flex flex-col justify-center items-center py-[100px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{color: 'var(--text-primary)'}}>Start your smart recruitment journey today</h1>
            <p className="mt-5" style={{color: 'var(--text-secondary)'}}>
              Join thousands of companies using AI to build high-performance
              teams.
            </p>
            <div className="buttons mt-6 flex flex-col lg:flex-row  items-center justify-center gap-3">
              <button className="btn-primary bg-green-600 py-4 px-7 text-white font-bold rounded-xl">
               Create Account
              </button>
              <button className="btn-outline py-4 px-7 text-white font-bold rounded-xl">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </>
    );
}

export default ProjectRecuitment;