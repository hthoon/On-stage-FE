import React, { useRef, useState } from "react";
import "./SocialPanel.css";
import AddSocialLinkModal from "./AddSocialLinkModal";
import { useLink } from "../../context/LinkContext";
import { FaInstagram, FaYoutube, FaTwitter, FaSpotify, FaGithub } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Tooltip from "../../components/tooltip/Tooltip";
import { GrEdit } from "react-icons/gr";
import ProfileImageModal from "./ProfileImageModal";
import { useAxios } from "../../context/AxiosContext";

// EditableField 컴포넌트로 contentEditable 처리
const EditableField = ({ field, value, onSave, children }) => {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleFocus = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (ref.current) {
                const element = ref.current;
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(element);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus();
            }
        }, 0);
    };

    const handleBlur = (e) => {
        setIsEditing(false);
        onSave(field, e.target.textContent.trim());
    };

    return (
        <div className={`editable-field ${field} ${isEditing ? "editing" : ""}`}>
            <span
                ref={ref}
                contentEditable
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        e.target.blur();
                    }
                }}
            >
                {children || value}
            </span>
            {!isEditing && (
                <Tooltip text={`${field === "nickname" ? "블록 이름" : "설명"} 바꾸기`}>
                    <GrEdit className="edit-icon" onClick={handleFocus}/>
                </Tooltip>
            )}
        </div>
    );
};

const SocialPanel = ({runTutorial, steps}) => {
    const { axiosInstance } = useAxios();
    const { socialLink, setSocialLink, profile, setProfile } = useLink();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const socialPlatforms = [
        { name: "Instagram", icon: <FaInstagram />, key: "instagram" },
        { name: "YouTube", icon: <FaYoutube />, key: "youtube" },
        { name: "X (Twitter)", icon: <FaTwitter />, key: "x" },
        { name: "Spotify", icon: <FaSpotify />, key: "spotify" },
        { name: "GitHub", icon: <FaGithub />, key: "github" },
    ];

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // 공통된 API 호출 로직
    const updateProfileField = async (field, newValue) => {
        try {
            const response = await axiosInstance.patch(`/api/user`, null, {
                params: { field, value: newValue },
            });
            if (response.status === 200) {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    [field]: newValue, // 업데이트된 값을 반영
                }));
                console.log(`${field} updated successfully:`, newValue);
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`${field} 업데이트 중 오류가 발생했습니다.`);
        }
    };

    const handleImageSave = async (newImageFile) => {
        try {
            const formData = new FormData();
            formData.append("profileImage", newImageFile);

            const response = await axiosInstance.patch(`/api/user/profile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                const updatedProfile = response.data; // 서버에서 반환된 새로운 프로필 정보
                setProfile(updatedProfile); // 상태 업데이트
                console.log("Image updated successfully:", updatedProfile.image);
            }
        } catch (error) {
            console.error("Error updating image:", error);
            alert("이미지 업데이트 중 오류가 발생했습니다.");
        }
    };



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
                    />
                </div>
                <div className="social-panel-description">
                    <EditableField
                        field="description"
                        value={profile.description}
                        onSave={updateProfileField}
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
                    <IoMdAddCircle className="social-icon-add-btn" onClick={handleOpenModal} />
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
                    currentImage={profile.image}
                    onClose={() => setIsImageModalOpen(false)}
                    onSave={handleImageSave} // 저장 시 호출
                />
            )}
        </div>
    );
};

export default SocialPanel;
