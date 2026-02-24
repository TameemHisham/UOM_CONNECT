import { useNavigate } from "react-router-dom";
// import { clearToken } from "../utils/auth";
import "./ProfilePage.css"

function ProfilePage() {
    const userInfo = {
        fullName: "Book C.",
        initials: "BC",
        email: "napat.chollabud@student.manchester.ac.uk",
        groups: ["COMP16412", "COMP11120", "COMP13212", "COMP11212", "COMP11212", "COMP11212", "COMP11212", "COMP11212"]
    }

    const navigate = useNavigate();

    const handleLogout = () => {
        // clearToken();
        navigate("/login");
    };


    return (
        <div className="background-container">
            <div className="profile-container">
                <div className="profile-image">{userInfo.initials}</div>
                <h1 className="full-name">{userInfo.fullName}</h1>

                <div className="contact-info-header">
                    <svg
                        className="profile-icon"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b2c91" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                        <path d="M18 21v-2a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v2"></path>
                    </svg>
                    Contact Information
                </div>

                <div className="uni-email-header">
                    <svg
                        className="hat-icon"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b2c91"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 10L12 5L2 10L12 15L22 10z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        <path d="M22 10v6" />
                    </svg>
                    University Email
                </div>

                <p className="uni-email">{userInfo.email}</p>

                <div className="study-groups-header">
                    <svg
                        className="chat-icon"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b2c91"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M7.9 20L3 22l1.5-4.5c-1.1-1.3-1.8-3-1.8-4.8 0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1 0-1.9-.2-2.8-.5z" />
                    </svg>
                    Study Groups
                </div>

                <div className="study-groups-container">
                    {userInfo.groups.map((group) => {
                        return (
                            <button className="study-group">{group}</button>
                        )
                    })}
                </div>

                <div className="buttons-container">
                    <button className="edit-profile-button">Edit Profile</button>
                    <button className="sign-out-button" onClick={handleLogout}>Sign Out</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;