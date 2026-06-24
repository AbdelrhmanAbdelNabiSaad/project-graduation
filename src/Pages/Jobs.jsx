import FilterationJob from "../Components/FilterationJob/FilterationJob";
import CardJobs from "../Components/cardJobs/cardJobs";

export default function Jobs() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <FilterationJob />
      <CardJobs />
    </div>
  );
}
