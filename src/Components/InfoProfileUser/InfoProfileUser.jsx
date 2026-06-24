import { useCallback, useState } from "react";
import { useEffect } from "react";
import user from "../../assets/user.png";
import icon from "../../assets/icon-check-user.png";
import locationIcon from "../../assets/location.png";
import iconAI from "../../assets/icon-ai.png";
import iconEmail from "../../assets/iconEmail.png";
import iconLink from "../../assets/iconLink.png";
import iconGrap from "../../assets/icon-grap.png";
import iconUpload from "../../assets/icon-download.png";
import ChangePassword from "../ChangePassword/ChangePassword";

function InfoProfileUser({ uploadCV }) {
  const [profile, setProfile] = useState({
    name: "Abdelrhman Saad",
    jobTitle: "Full Stack Developer",
    location: "Egypt, Cairo",
    email: "abdelrhmansaad127@gmail.com",
    linkedin: "Abdelrhman Saad",
    portfolio: "Portfoliome.com",
  });
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleAvailabilityChange = useCallback(() => {
    setIsAvailable((prev) => !prev);
  });

  const handleEditProfile = useCallback(() => {
    setDraft(profile);
    setIsEditing(true);
  }, [profile]);

  const handleSave = useCallback(() => {
    setProfile(draft);
    setIsEditing(false);
  }, [draft]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDraftChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleUploadCV = function (e) {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploaded CV: ", file.name);
    }
    uploadCV(file);
  };

  return (
    <>
      <div className="space-y-4 w-full lg:w-1/4">
        <div className="sr-card rounded-xl shadow p-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={user}
                className="w-24 h-24 rounded-full object-cover"
                alt=""
              />
              <img
                src={icon}
                className="absolute bottom-0 right-0 w-6"
                alt=""
              />
            </div>
          </div>
          {isEditing ? (
            <>
              <div className="mt-4 space-y-2">
                {[
                  "name",
                  "jobTitle",
                  "location",
                  "email",
                  "linkedin",
                  "portfolio",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field}
                    value={draft[field]}
                    onChange={handleDraftChange}
                    className="w-full p-2 border border-solid border-gray-200 focus:border-2 duration-300 outline-none text-sm focus:borer-green-500 hover:cursor-pointer"
                  />
                ))}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSave}
                    className="w-1/2 justify-center py-2 px-5 btn-primary font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-1/2 py-2 px-5 mx-auto block bg-white border border-solid btn-ghost font-bold rounded-lg hover:bg-green-600 hover:text-white duration-300 hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mt-3">
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {profile.name}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {profile.jobTitle}
                </p>
                <p>
                  {/* <img src={locationIcon} className="w-4" alt="" /> */}
                  {profile.location}
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <div
                  className="w-16 h-16 rounded-full border-4  flex items-center justify-center text-sm font-bold "
                  style={{
                    borderColor: "var(--text-brand)",
                    color: "var(--text-brand)",
                  }}
                >
                  100%
                </div>
              </div>
              <div className="mt-4 text-center w-full btn-outline py-2 rounded-full text-sm flex justify-center items-center gap-2">
                <img src={iconAI} alt="" className="w-4" /> AI Optimized Profile
              </div>
              <button
                onClick={handleEditProfile}
                className="mt-4 w-full border py-2 rounded btn-primary justify-center font-bold hover:cursor-pointer  duration-300"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
        <div className="sr-card mt-2 p-4 shadow flex justify-between items-center">
          <div>
            <h4
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Avaliability
            </h4>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Open To Work
            </p>
          </div>
          <input type="checkbox" className="w-10 h-5 accent-blue-800" />
        </div>
        <div className="sr-card rounded-xl shadow p-4">
          <h2
            className="uppercase text-sm mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Contact
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <img src={iconEmail} className="w-5" />
              <span style={{ color: "var(--text-secondary" }}>
                {profile.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img src={iconLink} className="w-5" />
              <span style={{ color: "var(--text-secondary" }}>
                {profile.linkedin}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img src={iconGrap} className="w-5" />
              <span style={{ color: "var(--text-secondary" }}>
                {profile.portfolio}
              </span>
            </div>
          </div>
        </div>
        <div className="">
          <label className="cursor-pointer btn-primary w-full flex text-center justify-center items-center gap-2">
            <img src={iconUpload} alt="" className="w-6" />
            <span className="text-lg font-medium text-center">
              {cvFile ? cvFile.name : "Upload cv"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUploadCV}
              className="hidden"
            />
          </label>
        </div>
        <div className="">
          <button
            onClick={() => setShowChangePassword(true)}
            className="cursor-pointer flex w-full justify-center items-center gap-2 btn-ghost font-medium text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Change Password
          </button>
        </div>
      </div>
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}

export default InfoProfileUser;