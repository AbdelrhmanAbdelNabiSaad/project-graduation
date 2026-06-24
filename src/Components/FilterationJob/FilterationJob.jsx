import { useCallback, useState } from "react";
import './FilterationJob.css';
import iconFilter from '../../assets/icon-filter.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faXmark } from "@fortawesome/free-solid-svg-icons";

function FilterationJob() {
  const jobArray = [
    { id: "fulltime", label: "Full-time", count: 120 },
    { id: "contract", label: "Contract", count: 34 },
    { id: "freelance", label: "Freelance", count: 12 },
  ];
  const locationArray = ["remote", "hybrid", "onsite"];

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(['UI Design', 'Figma']);
  const [matchinScore, setMatchingScore] = useState(70);
  const [jobType, setJobTypes] = useState({ fulltime: true, contract: false, freelance: false });
  const [location, setLocation] = useState({ remote: true, hybrid: true, onsite: true });
  const [collapsed, setCollapsed] = useState({ jobType: false, location: false });

  const handleResetAll = () => {
    setMatchingScore(70);
    setJobTypes({ fulltime: true, contract: false, freelance: false });
    setLocation({ remote: true, hybrid: true, onsite: true });
    setSkills(["UI Design", "Figma"]);
    setSkillInput("");
  };

  const handleAddSkill = useCallback(() => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput("");
    }
  }, [skillInput, skills]);

  const handleRemoveSkill = useCallback((skill) => {
    setSkills(prev => prev.filter(s => s !== skill));
  }, []);

  return (
    <div className="w-full md:w-72 flex-shrink-0 border-r min-h-screen p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-default)" }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h5 className="flex items-center gap-2 font-bold text-base" style={{ color: "var(--text-primary)" }}>
          <img src={iconFilter} alt="Filter" className="w-5 h-5" />
          Filters
        </h5>
        <button onClick={handleResetAll} className="text-xs font-bold" style={{ color: "var(--text-brand)" }}>
          Reset All
        </button>
      </div>

      {/* Match Score */}
      <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Matching Score</label>
          <span className="text-sm font-bold px-2 py-0.5 rounded-lg" style={{ background: "var(--bg-badge)", color: "var(--text-brand)" }}>
            {matchinScore}%
          </span>
        </div>
        <input type="range" min="0" max="100" value={matchinScore}
          onChange={e => setMatchingScore(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "var(--indigo-500)" }}
        />
        <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Job Type */}
      <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => setCollapsed(c => ({ ...c, jobType: !c.jobType }))}>
          <label className="text-sm font-bold cursor-pointer" style={{ color: "var(--text-primary)" }}>Job Type</label>
          <FontAwesomeIcon icon={faChevronUp} className="w-3 h-3 transition-transform duration-200"
            style={{ color: "var(--text-muted)", transform: collapsed.jobType ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
        {!collapsed.jobType && jobArray.map(item => (
          <div key={item.id} className="flex items-center justify-between mb-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" id={item.id} checked={jobType[item.id]}
                onChange={e => setJobTypes(prev => ({ ...prev, [e.target.id]: e.target.checked }))}
                className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "var(--indigo-500)" }} />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.label}</span>
            </label>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div className="flex justify-between items-center mb-3 cursor-pointer" onClick={() => setCollapsed(c => ({ ...c, location: !c.location }))}>
          <label className="text-sm font-bold cursor-pointer" style={{ color: "var(--text-primary)" }}>Location</label>
          <FontAwesomeIcon icon={faChevronUp} className="w-3 h-3 transition-transform duration-200"
            style={{ color: "var(--text-muted)", transform: collapsed.location ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
        {!collapsed.location && locationArray.map(loc => (
          <div key={loc} className="flex items-center gap-2.5 mb-2.5">
            <input type="checkbox" id={loc} checked={location[loc]}
              onChange={e => setLocation(prev => ({ ...prev, [e.target.id]: e.target.checked }))}
              className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "var(--indigo-500)" }} />
            <label htmlFor={loc} className="text-sm capitalize cursor-pointer" style={{ color: "var(--text-secondary)" }}>{loc}</label>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-bold mb-3 block" style={{ color: "var(--text-primary)" }}>Skills</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map(skill => (
            <span key={skill} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--bg-badge)", color: "var(--text-brand)" }}>
              {skill}
              <FontAwesomeIcon icon={faXmark} onClick={() => handleRemoveSkill(skill)}
                className="cursor-pointer hover:opacity-70 w-2.5 h-2.5" />
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Add a skill..." value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
            className="sr-input flex-1 text-sm py-2" />
          <button onClick={handleAddSkill} className="btn-primary px-3 py-2 rounded-xl text-base">+</button>
        </div>
      </div>
    </div>
  );
}

export default FilterationJob;
