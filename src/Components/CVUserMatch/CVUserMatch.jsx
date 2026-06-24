import { useState } from "react";
import { useEffect } from "react"; 
import './CVUserMatch.css';



function CvUserMatch({ cvData }) {
    
  const [score, setScore] = useState(92);
  

    useEffect(() => {
        if (cvData?.matchScore) {
            setScore(cvData.matchScore);
        }
    }, [cvData]);

    return (
      <>
        <div className="sr-card p-4 rounded-xl m-4">
          <h4 className="text-xl font-bold">
            <span className="font-bold" style={{color: 'var(--text-brand)'}}>{score}%</span> Match
          </h4>
          <p className="text-lg" style={{color: 'var(--text-secondary)'}}>AI analyzed your CV</p>
        </div>
      </>
    );
}

export default CvUserMatch;