import { useState } from "react";
import { useEffect } from "react"; 
import './CVDetails.css';
import AboutDetails from "../AboutDetails/AboutDetails";
import SkillsDetails from "../SkillsDetails/SkillsDetails";
import ExperienceDetails from "../ExperienceDetails/ExperienceDetails";
import EducationDetails from "../EducationDetails/EducationDetails";
import CvUserMatch from "../CVUserMatch/CVUserMatch";


function CvDetails({ cvData }) {
  return (
    <>
          <div className=" w-full lg:w-3/4 ">
              <CvUserMatch cvData={cvData} />
        <AboutDetails cvData={cvData} />
              <SkillsDetails cvData={cvData} />
              <ExperienceDetails cvData={cvData} />
        <EducationDetails cvData={cvData} />
        
      </div>
    </>
  );
}

export default CvDetails;