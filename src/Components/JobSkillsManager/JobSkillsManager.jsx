import { useState, useEffect } from "react";
import "./JobSkillsManager.css";
import axios from "axios";

const BASE = "https://jooobs.runasp.net";

function JobSkillsManager({ jobId, onSkillsAdded, onClose }) {
  const [jobSkills, setJobSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [selectedSkillName, setSelectedSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSkills, setFetchingSkills] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobSkills();
    fetchAllSkills();
  }, [jobId]);

  async function fetchJobSkills() {
    try {
      const res = await axios.get(`${BASE}/api/jobs/${jobId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data || res.data || [];
      // normalize: الـ backend بيرجع skillId/skillName
      const normalized = (Array.isArray(raw) ? raw : []).map((s) => ({
        id: s.skillId || s.id,
        name: s.skillName || s.name,
      }));
      setJobSkills(normalized);
    } catch {
      setJobSkills([]);
    }
  }

  async function fetchAllSkills() {
    setFetchingSkills(true);
    try {
      const res = await axios.get(`${BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, pageSize: 100 },
      });
      const raw = res.data?.data || res.data?.items || res.data || [];
      // normalize: الـ backend بيرجع skillId/skillName
      const normalized = (Array.isArray(raw) ? raw : []).map((s) => ({
        id: s.skillId || s.id,
        name: s.skillName || s.name,
      }));
      setAllSkills(normalized);
    } catch (e) {
      console.warn("fetchAllSkills error:", e?.response?.status);
      setAllSkills([]);
    } finally {
      setFetchingSkills(false);
    }
  }

  async function handleAddSkill() {
    if (!selectedSkillId) {
      setError("Please select a skill from the list.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        `${BASE}/api/jobs/${jobId}/skills`,
        null,
        {
          params: { skillId: selectedSkillId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status < 400) {
        setSuccess(`Skill "${selectedSkillName}" added successfully! ✅`);
        setSelectedSkillId("");
        setSelectedSkillName("");
        await fetchJobSkills();
        if (onSkillsAdded) onSkillsAdded();
      }
    } catch (e) {
      const errData = e.response?.data;
      let msg = "Failed to add skill.";
      if (typeof errData?.errors === "string") msg = errData.errors;
      else if (typeof errData?.errors === "object" && errData?.errors !== null)
        msg = Object.values(errData.errors).flat().join(", ");
      else if (errData?.message) msg = errData.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveSkill(skillId, skillName) {
    if (!window.confirm(`Remove "${skillName}"?`)) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${BASE}/api/jobs/${jobId}/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Skill "${skillName}" removed.`);
      await fetchJobSkills();
      if (onSkillsAdded) onSkillsAdded();
    } catch {
      setError("Failed to remove skill.");
    } finally {
      setLoading(false);
    }
  }

  const availableToAdd = allSkills.filter(
    (s) => !jobSkills.find((js) => js.id === s.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="sr-card rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Manage Job Skills</h2>
          <button
            onClick={onClose}
            className="btn-outline text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Add at least one skill before publishing this job.
        </p>

        {error && (
          <div className="p-3 mb-3 text-red-900 bg-red-100 rounded-lg text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 mb-3 text-green-900 bg-green-100 rounded-lg text-sm">{success}</div>
        )}

        {/* Add Skill */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Select a Skill to Add:
          </label>
          {fetchingSkills ? (
            <p className="text-sm text-gray-400">Loading skills...</p>
          ) : allSkills.length === 0 ? (
            <p className="text-sm text-red-500">
              No skills found. Please add skills first.
            </p>
          ) : availableToAdd.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">
              ✅ All available skills have been added to this job.
            </p>
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedSkillId}
                onChange={(e) => {
                  const skill = allSkills.find((s) => s.id === e.target.value);
                  setSelectedSkillId(e.target.value);
                  setSelectedSkillName(skill?.name || "");
                  setError("");
                }}
                className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:border-green-500 outline-none bg-none"
              >
                <option value="">-- Choose a skill --</option>
                {availableToAdd.map((skill) => (
                  <option key={skill.id} value={skill.id} className="" style={{color: 'var(--text-brand)'}}>
                    {skill.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                disabled={loading || !selectedSkillId}
                className="py-2 px-4 btn-primary text-white text-sm font-bold rounded-xl hover:bg-green-700 duration-300 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          )}
        </div>

        {/* Current Skills */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Current Skills ({jobSkills.length}):
          </label>
          {jobSkills.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {jobSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold py-1 px-3 rounded-full"
                >
                  {skill.name}
                  <button
                    onClick={() => handleRemoveSkill(skill.id, skill.name)}
                    disabled={loading}
                    className="ml-1 text-green-600 hover:text-red-500 font-bold text-sm leading-none cursor-pointer disabled:opacity-60"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 btn-ghost text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 duration-300 cursor-pointer"
          >
            Close
          </button>
          {jobSkills.length > 0 && (
            <button
              onClick={onClose}
              className="px-4 py-2 btn-accent text-white text-sm font-bold rounded-lg hover:bg-green-700 duration-300 cursor-pointer"
            >
              Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobSkillsManager;
