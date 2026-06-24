import { useState } from "react";
import { useEffect } from "react"; 
import './Solution.css';
import icon from '../../assets/icon.svg'
import iconXmark from '../../assets/icon-xmark.svg';
import iconSolution from '../../assets/icon-sol.svg'


function Solution() {
    return (
      <>
        <div className="pt-[100px] pb-[100px]">
          <div className=" container mx-auto ">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="the-problem sr-card p-5 rounded-xl w-full lg:w-1/4">
                <img src={icon} alt="Icon" className="mb-3" />
                <h3
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  The Problem
                </h3>
                <div className="info flex flex-row gap-2 my-4">
                  <img src={iconXmark} alt="" />
                  <p className="text-gray-500">
                    Manual CV screening takes up to 60% of recruiter time.
                  </p>
                </div>
                <div className="info flex flex-row gap-2 my-4">
                  <img src={iconXmark} alt="" />
                  <p className="text-gray-500">
                    Unconscious bias leads to missing top-tier diverse talent..
                  </p>
                </div>
                <div className="info flex flex-row gap-2 my-4">
                  <img src={iconXmark} alt="" />
                  <p className="text-gray-500">
                    Inaccurate keyword matching excludes qualified applicants.
                  </p>
                </div>
              </div>
              <div className="the-solution sr-card  p-5 rounded-xl w-full lg:w-3/4">
                <img src={iconSolution} alt="Icon Solution" />
                <h3
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our Solution
                </h3>
                <p className="text-base">
                  We built an intelligent engine that understands human context,
                  not just keywords.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 mt-15 gap-3">
                  <div
                    className="sr-card p-8 text-start relative"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <h3
                      className="font-bold text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      AI CV Parsing
                    </h3>
                    <p className="text-gray-400 leading-5">
                      Extraction of skills and experience with semantic
                      understanding.
                    </p>
                  </div>
                  <div
                    className="sr-card p-8 text-start relative"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <h3
                      className="font-bold text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Smart Matching
                    </h3>
                    <p className="text-gray-400 leading-5">
                      Neural networks that predict job-fit based on cultural
                      alignment.
                    </p>
                  </div>
                  <div
                    className="sr-card p-8 text-start relative"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                  >
                    <h3
                      className="font-bold text-2xl"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Ranked Lists
                    </h3>
                    <p className="text-gray-400 leading-5">
                      Instant prioritization of candidates who match your exact
                      needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Solution;