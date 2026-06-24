import { useCallback, useState } from "react";
import { useEffect } from "react"; 
import './AboutDetails.css';
import iconEdit from  '../../assets/iconEdit.svg';



function AboutDetails({ cvData }) {
    const staticText =
      "Passionate UX Designer with 7+ years of experience building accessible enterprise software. I specialize in translating complex user needs into intuitive, seamless digital experiences. My background in psychology allows me to bring a unique perspective to user research and interaction design. Currently looking for opportunities to lead design systems in a mission-driven organization.";
;

    const [text, setText] = useState(staticText);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(text);

    const handleEdit = useCallback(() => {
        setDraft(text);
        setIsEditing(true);
    }, [text])

    const handleSave = useCallback(() => {
        setText(draft)
        setIsEditing(false);
    }, [draft])

    const handleCancel = useCallback(() => {
        setIsEditing(false);
    }, []);

    useEffect(() => {
      if (cvData?.about) {
        setText(cvData.about);
      } else {
          setText(staticText);
      }
    }, [cvData]);


    return (
      <>
        <div className="sr-card rounded-xl p-4 m-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>About Me</h4>
            <img src={iconEdit} onClick={handleEdit} role="button" className="cursor-pointer" alt="" />
          </div>

          {isEditing ? (
            <>
              <textarea
                className="w-full mb-2 outline-none border border-solid border-gray-200 p-2 rounded-lg"
                rows={5}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
              />

              <div className="flex gap-2 items-center">
                <button onClick={handleSave} className="py-2 px-4 text-white btn-primary rounded-lg  duration-300 hover:cursor-pointer">
                  Save
                </button>
                <button onClick={handleCancel} className="py-2 px-4 text-white btn-ghost rounded-lg  duration-300 hover:cursor-pointer">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">{text}</p>
            </>
                )}
                
        </div>
      </>
    );
}

export default AboutDetails;