import { useState, useEffect } from "react";
import axios from "axios";

const BASE = "https://jooobs.runasp.net";

export default function SkillsDetails() {
  const [userSkills, setUserSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserSkills();
    fetchAllSkills();
  }, []);

  // GET /api/UserSkills — بدون userId في الـ path
  async function fetchUserSkills() {
    try {
      const res = await axios.get(`${BASE}/api/UserSkills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data || res.data || [];
      setUserSkills(Array.isArray(raw) ? raw : []);
    } catch (e) {
      console.warn("fetchUserSkills error:", e?.response?.data);
    }
  }

  // GET /api/skills — جيب كل الـ skills في النظام
  async function fetchAllSkills() {
    setFetching(true);
    try {
      const res = await axios.get(`${BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: 1, pageSize: 100 },
      });
      const raw = res.data?.data || res.data || [];
      setAllSkills(Array.isArray(raw) ? raw : []);
    } catch (e) {
      console.warn("fetchAllSkills error:", e?.response?.data);
      setAllSkills([]);
    } finally {
      setFetching(false);
    }
  }

  // POST /api/UserSkills/{skillId} — skillId في الـ path
  async function handleAddSkill() {
    if (!selectedId) {
      setError("Please select a skill.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        `${BASE}/api/UserSkills/${selectedId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status < 400) {
        setSuccess(`Skill "${selectedName}" added! ✅`);
        setSelectedId("");
        setSelectedName("");
        setShowForm(false);
        await fetchUserSkills();
      }
    } catch (e) {
      const errData = e.response?.data;
      let msg = "Failed to add skill.";
      if (typeof errData?.errors === "string") msg = errData.errors;
      else if (errData?.message) msg = errData.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // DELETE /api/UserSkills/{skillId} — skillId في الـ path
  async function handleRemoveSkill(skillId, skillName) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${BASE}/api/UserSkills/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Removed "${skillName}".`);
      await fetchUserSkills();
    } catch {
      setError("Failed to remove skill.");
    } finally {
      setLoading(false);
    }
  }

  // فلتر الـ skills اللي اتضافت بالفعل
  const availableToAdd = allSkills.filter(
    (s) => !userSkills.find((us) => (us.skillId || us.id) === (s.skillId || s.id))
  );

  return (
    <div className="sr-card p-4 rounded-xl m-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-bold">Skills</h4>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className=" font-bold cursor-pointer duration-300"
            style={{ color: "var(--text-brand)" }}
          >
            + Add Skill
          </button>
        )}
      </div>

      {error && (
        <div className="p-2 mb-3 text-red-900 bg-red-100 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-2 mb-3 text-green-900 bg-green-100 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="flex gap-2 mb-4">
          {fetching ? (
            <p className="text-sm text-gray-400 py-2">Loading skills...</p>
          ) : availableToAdd.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">
              No more skills available to add.
            </p>
          ) : (
            <select
              value={selectedId}
              onChange={(e) => {
                const s = allSkills.find(
                  (sk) => (sk.skillId || sk.id) === e.target.value,
                );
                setSelectedId(e.target.value);
                setSelectedName(s?.skillName || s?.name || "");
              }}
              className="flex-1 border p-2 rounded-xl outline-none text-sm "
              autoFocus
            >
              <option value="" style={{ color: "var(--text-primary)" }}>
                -- Select a skill --
              </option>
              {availableToAdd.map((s) => (
                <option
                  style={{ color: "var(--text-brand)" }}
                  key={s.skillId || s.id}
                  value={s.skillId || s.id}
                >
                  {s.skillName || s.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleAddSkill}
            disabled={loading || !selectedId}
            className="btn-primary text-white px-3 rounded  cursor-pointer duration-300 disabled:opacity-60 text-sm font-bold"
          >
            {loading ? "..." : "Add"}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setError("");
              setSelectedId("");
            }}
            className="btn-ghost px-3 rounded text-white font-bold  cursor-pointer duration-300 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* User Skills */}
      <div className="flex flex-wrap gap-2">
        {userSkills.length === 0 && !showForm && (
          <p className="text-sm text-gray-400 italic">No skills added yet.</p>
        )}
        {userSkills.map((skill) => (
          <span
            key={skill.skillId || skill.id}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
          >
            {skill.skillName || skill.name}
            <button
              onClick={() =>
                handleRemoveSkill(
                  skill.skillId || skill.id,
                  skill.skillName || skill.name,
                )
              }
              disabled={loading}
              className="ml-1 text-green-600 hover:text-red-500 font-bold leading-none cursor-pointer disabled:opacity-60"
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
