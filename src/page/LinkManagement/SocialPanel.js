import React, { useState } from "react";
import "./SocialPanel.css";
import AddSocialLinkModal from "./AddSocialLinkModal";
import { useLink } from "../../context/LinkContext";
import { FaInstagram, FaYoutube, FaTwitter, FaSpotify, FaGithub } from "react-icons/fa";
import {IoMdAddCircle} from "react-icons/io";

const SocialPanel = () => {
    const { socialLink, setSocialLink } = useLink();
    const profileImage = "https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg";
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const socialPlatforms = [
        { name: "Instagram", icon: <FaInstagram />, key: "instagram" },
        { name: "YouTube", icon: <FaYoutube />, key: "youtube" },
        { name: "X (Twitter)", icon: <FaTwitter />, key: "x" },
        { name: "Spotify", icon: <FaSpotify />, key: "spotify" },
        { name: "GitHub", icon: <FaGithub />, key: "github" },
    ];

    return (
        <div>
            <div>
                <img src={profileImage} alt="Profile" className="social-panel-profile-image" />
                <h5 className="social-panel-name">Winter</h5>
                <h6 className="social-panel-description">카리나는요?</h6>
            </div>

            <div className="social-panel">
                <div className="social-icons-container">
                    {socialPlatforms.map((platform) => (
                        <div
                            key={platform.key}
                            className={`social-icon ${
                                socialLink[platform.key] ? "active" : "inactive"
                            }`}
                        >
                            {platform.icon}
                        </div>
                    ))}
                    <IoMdAddCircle className={`social-icon-add-btn`} onClick={handleOpenModal} />
                </div>
            </div>

            {isModalOpen && (
                <AddSocialLinkModal
                    socialLink={socialLink}
                    setSocialLink={setSocialLink}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default SocialPanel;
