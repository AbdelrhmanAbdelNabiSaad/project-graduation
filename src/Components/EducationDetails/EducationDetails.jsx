import { useState, useEffect } from "react";

const emptyEdu = {
  university: "",
  degree: "",
  period: "",
};

export default function EducationDetails({ cvData }) {
  const staticEdu = [
    {
      university: "Stanford University",
      degree: "B.A Design",
      period: "2013-2017",
    },
  ];

  const [edu, setEdu] = useState(staticEdu);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyEdu);

  useEffect(() => {
    if (cvData?.education) {
      setEdu(cvData.education);
    }
  }, [cvData]);

  const handleAdd = () => {
    setForm(emptyEdu);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.university.trim() || !form.degree.trim()) return;

    setEdu((prev) => [...prev, form]);
    setShowForm(false);
  };

  return (
    <div className="sr-card p-4 m-4 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Education</h4>

        <button
          onClick={handleAdd}
          className="font-bold px-3 py-1 rounded cursor-pointer" style={{color: 'var(--text-brand)'}}
        >
          + Add
        </button>
      </div>

      {/* الفورم */}
      {showForm && (
        <div className=" p-3 rounded mb-4">
          <input
            type="text"
            name="university"
            placeholder="Enter University..."
            value={form.university}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-gray-300 rounded outline-none"
          />

          <input
            type="text"
            name="degree"
            placeholder="Degree *"
            value={form.degree}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-gray-300 rounded outline-none"
          />

          <input
            type="text"
            name="period"
            placeholder="Period"
            value={form.period}
            onChange={handleChange}
            className="w-full mb-2 p-2 border border-gray-300 rounded outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary text-white px-3 py-1 rounded  hover:cursor-pointer duration-300"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost text-white px-3 py-1 rounded hover:cursor-pointer duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* عرض البيانات */}
      {edu.map((e, i) => (
        <div key={i} className="mb-3">
          <h5 className="text-lg font-bold">{e.university}</h5>
          <p className="" style={{color: 'var(--text-secondary)'}}>{e.degree}</p>
          <span className="font-bold" style={{color: 'var(--text-brand)'}}>{e.period}</span>
        </div>
      ))}
    </div>
  );
}
