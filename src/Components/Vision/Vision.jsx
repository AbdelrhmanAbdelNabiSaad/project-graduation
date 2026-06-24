import { useState } from "react";
import { useEffect } from "react"; 
import './Vision.css';



function Vision() {
    return (
      <>
        <div className="container mx-auto pt-[100px] pb-[100px]">
          <div className="content sr-card p-[50px] rounded-2xl  w-full md:w-[70%] mx-auto text-center">
            <h1
              className="font-bold text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Our Vision
            </h1>
            <p
              className="leading-7 mt-5"
              style={{ color: "var(--text-secondary)" }}
            >
              "To create a world where recruitment is no longer a friction
              point, but a seamless bridge that connects every human's unique
              talent to the purpose that fits them best."
            </p>
            <div
              className="w-[120px] mx-auto h-[3px] mt-10"
              style={{ background: "var(--gradient-brand)" }}
            ></div>
          </div>
        </div>
      </>
    );
}

export default Vision;