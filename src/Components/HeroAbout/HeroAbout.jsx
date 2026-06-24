import { useState } from "react";
import { useEffect } from "react";
import hero from "../../assets/hero-about.svg";
import "./HeroAbout.css";

function HeroAbout() {
  return (
    <>
      <div className="landing flex flex-col lg:flex-row justify-center items-center h-screen mt-50 lg:mt-0">
        <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center lg:gap-30">
          <div className="text w-[400px] max-w-full text-center lg:text-start">
            <h1 className="text-5xl font-bold">
              About
              <span style={{ color: "var(--text-brand)" }}> SmartRecruite</span>
            </h1>
            <p className="text-gray-500 my-3">
              A smarter way to connect talent with opportunity using AI. We're
              redefining the human-machine partnership in the talent economy.
            </p>
            <div className="buttons flex flex-col lg:flex-row  items-start justify-start gap-3">
              <button className="btn-primary py-4 px-7 text-white font-bold rounded-xl">
                Explore Platform
              </button>
              <button className="btn-outline py-4 px-7 text-white font-bold rounded-xl">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="image">
            <img src={hero} style={{ height: "500px" }} alt="Hero Image" />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroAbout;
