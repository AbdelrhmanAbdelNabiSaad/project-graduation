import { useState } from "react";
import CvDetails from "../Components/CVDetails/CVDetails";
import InfoProfileUser from "../Components/InfoProfileUser/InfoProfileUser";
import SkillsDetails from "../Components/SkillsDetails/SkillsDetails";
import axios from "axios";

export default function ProfileUser() {

    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const uploadCV = async function (file) {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');

            if (!token) {
                setError('You are not logged in. Please login first.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            // FIX: add Authorization header with Bearer token
            await axios.post(`https://jooobs.runasp.net/api/CV`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            // FIX: add Authorization header to GET request too
            const response = await axios.get('https://jooobs.runasp.net/api/CV', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            setCvData(response.data.data);

        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                setError('Session expired. Please login again.');
            } else {
                setError(error.response?.data?.message || 'Failed to upload CV. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <>
            {error && (
                <div className="p-4 mb-4 text-red-900 bg-red-100 rounded-lg mx-4 mt-4" role="alert">
                    {error}
                </div>
            )}
            {loading && (
                <div className="flex justify-center mt-4">
                    <span className="loader"></span>
                </div>
            )}
            <div className="row mt-20 md:mt-0">
                <InfoProfileUser uploadCV={uploadCV} />
                <CvDetails cvData={cvData} />
            </div>
        </>
    )
}
