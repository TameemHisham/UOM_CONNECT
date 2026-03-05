import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { getUserGroups } from "../api/groups";
import { getToken, clearToken } from "../utils/auth";
import "./ProfilePage.css"

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([]);


    useEffect(() => {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }
    

        getCurrentUser(token)
          .then((data) => setUser(data.user))
          .catch(() => {
            // clearToken();
            navigate("/login");
          });
    

        getUserGroups(token)
          .then((data) => setGroups(data || []))
          .catch(console.error);
    }, [navigate]);


    const groupClicked = (id) => {
        navigate("/chat", {
            state: {
                groupId: id
            }
        });
    };


    // For pop up edit profile menu
    const [modal, setModal] = useState(null);


    const openModal = (type) => {
        setModal(type);
    };


    const closeModal = () => {
        setModal(null);
    };


    const handleLogout = () => {
        clearToken();
        navigate("/login");
    };
    

    return (
        <div className="background-container">
            <div className="profile-container">
                <Link to="/chat">
                    <svg
                        className="return-icon"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b2c91"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>    
                </Link>

                <div className="profile-image">{getInitials(user?.sub)}</div>
                <h1 className="full-name">{user?.sub}</h1>

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

                <p className="uni-email">{user?.email}</p>

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
                    {groups.map((group) => {
                        return (
                            <button className="study-group" onClick={() => groupClicked(group.id)}>{group.name}</button>
                        )
                    })}
                </div>

                <div className="buttons-container">
                    <button 
                        className="edit-profile-button" 
                        onClick={() => openModal("create")}
                    >
                    Edit Profile
                    </button>

                    <button 
                        className="sign-out-button" 
                        onClick={handleLogout}
                    >
                    Sign Out
                    </button>
                </div>
            </div>
        
            {modal && (
                <div className="overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modalTitle">
                            Edit Profile Details
                        </h3>

                        <input
                            className="modalInput"
                            placeholder="e.g. hello"
                            autofocus
                        />

                        <div className="modalBtns">
                            <button 
                                className="modalCancel" 
                                onClick={closeModal}
                            >
                            Cancel
                            </button>

                            <button 
                            className="modalConfirm"
                            >
                            Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;