import React, { useState} from "react";
import "./SocialPanel.css";
import AddSocialLinkModal from "./AddSocialLinkModal";
import { useLink } from "../../context/LinkContext";
import { IoMdAddCircle } from "react-icons/io";
import ProfileImageModal from "./ProfileImageModal";
import { useAxios } from "../../context/AxiosContext";
import {socialPlatforms} from "../../utils/AnalysisURL";
import EditableField from "../../components/EditableField";
import {updateProfileField} from "../../utils/UpdateProfileField";

const SocialPanel = ( ) => {
    const { axiosInstance } = useAxios();
    const { socialLink, setSocialLink, profile, setProfile } = useLink();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div>
            <div>
                <img
                    src={profile.profileImage} // 기본 이미지
                    alt="Profile"
                    className="social-panel-profile-image"
                    onClick={() => setIsImageModalOpen(true)}
                />
                <div className="social-panel-name">
                    <EditableField
                        field="nickname"
                        value={profile.nickname}
                        onSave={updateProfileField}
                        isVerified={profile.verified === "VERIFIED"}
                        setProfile={setProfile}
                        axiosInstance={axiosInstance}
                    />
                </div>
                <div className="social-panel-description">
                    <EditableField
                        field="description"
                        value={profile.description}
                        onSave={updateProfileField}
                        setProfile={setProfile}
                        axiosInstance={axiosInstance}
                    />
                </div>
            </div>

            <div className="social-panel">
                <div className="social-icons-container">
                    {socialPlatforms.map((platform) => (
                        <div
                            key={platform.key}
                            className={`social-icon ${socialLink[platform.key] ? "active" : "inactive"}`}
                        >
                            {platform.icon}
                        </div>
                    ))}
                    <IoMdAddCircle className="social-icon-add-btn" onClick={handleOpenModal}/>
                </div>
            </div>

            {isModalOpen && (
                <AddSocialLinkModal
                    socialLink={socialLink}
                    setSocialLink={setSocialLink}
                    onClose={handleCloseModal}
                />
            )}

            {isImageModalOpen && (
                <ProfileImageModal
                    currentImage={profile.profileImage}
                    onClose={() => setIsImageModalOpen(false)}
                    // onSave={handleImageSave} // 저장 시 호출
                />
            )}
        </div>
    );
};
export default SocialPanel;
