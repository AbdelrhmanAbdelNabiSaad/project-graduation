import { useState, useEffect } from "react";

const emptyExp = {
  title: "",
  company: "",
  period: "",
};

function ExperienceDetails({ cvData }) {
  const staticExp = [
    {
      title: "UX Designer",
      company: "TechFlow",
      period: "2020 - Present",
    },
  ];

  const [exp, setExp] = useState(staticExp);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyExp);

  useEffect(() => {
    if (cvData?.experience) {
      setExp(cvData.experience);
    }
  }, [cvData]);

  const handleAdd = () => {
    setForm(emptyExp);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.company.trim()) return;

    setExp((prev) => [...prev, form]);
    setShowForm(false);
  };

  return (
    <div className="sr-card p-4 m-4 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>Experience</h4>

        <button
          onClick={handleAdd}
          className=" font-bold cursor-pointer px-3 py-1 rounded" style={{color: 'var(--text-brand)'}}
        >
          + Add
        </button>
      </div>

      {/* الفورم */}
      {showForm && (
        <div className="p-3 rounded mb-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded outline-none border-gray-300"
          />

          <input
            type="text"
            name="company"
            placeholder="Company *"
            value={form.company}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded outline-none border-gray-300"
          />

          <input
            type="text"
            name="period"
            placeholder="Period"
            value={form.period}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded outline-none border-gray-300"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className=" text-white px-3 py-1 rounded btn-primary hover:cursor-pointer duration-300"
            >
              Save
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost px-3 py-1 rounded hover:cursor-pointer duration-300 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* عرض البيانات */}
      {exp.map((e, index) => (
        <div key={index} className="mb-3">
          <h5 className="text-lg font-bold" style={{color: 'var(--text-primary)'}}>
            <span className="text-xl" style={{color: 'var(--text-secondary)'}}>{index + 1}. </span>
            {e.title}
          </h5>
          <p className="" style={{color: 'var(--text-secondary)'}}>{e.company}</p>
          <p className="" style={{color: 'var(--text-secondary)'}}>{e.period}</p>
        </div>
      ))}
    </div>
  );
}

export default ExperienceDetails;
