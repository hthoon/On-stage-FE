import React, {useEffect, useRef, useState} from "react";
import "./SocialPanel.css";
import AddSocialLinkModal from "./AddSocialLinkModal";
import { useLink } from "../../context/LinkContext";
import { IoMdAddCircle } from "react-icons/io";
import Tooltip from "../../components/tooltip/Tooltip";
import { GrEdit } from "react-icons/gr";
import ProfileImageModal from "./ProfileImageModal";
import { useAxios } from "../../context/AxiosContext";
import {base64ToBlob} from "../../utils/BlobConverter";
import {socialPlatforms} from "../../utils/AnalysisURL";

const EditableField = ({ field, value, onSave, children }) => {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value); // 입력 값 관리

    const handleFocus = () => {
        setIsEditing(true);  // 편집 모드로 진입
        setTimeout(() => {   // setTimeout을 사용하여 렌더링 이후에 포커스를 설정
            if (ref.current) {
                const inputElement = ref.current;
                inputElement.focus();  // 입력 필드에 포커스를 설정

                // 커서를 끝으로 이동
                const length = inputElement.value.length;
                inputElement.setSelectionRange(length, length);  // 커서를 끝으로
            }
        }, 0);
    };

    const handleBlur = () => {
        setIsEditing(false);
        onSave(field, inputValue.trim());
    };

    const handleChange = (e) => {
        setInputValue(e.target.value); // 입력 값 업데이트
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur(); // 엔터 입력 시 포커스를 잃음
        }
    };

    const dynamicClass = `${field}-editing`;

    return (
        <div className={`editable-field ${dynamicClass} ${isEditing ? "editing" : ""}`}>
            {isEditing ? (
                <input
                    ref={ref}
                    value={inputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <span>{children || value}</span>
            )}
            {!isEditing && (
                <Tooltip text={`${field === "nickname" ? "블록 이름" : "설명"} 바꾸기`}>
                    <GrEdit className="edit-icon" onClick={handleFocus} />
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
            }

        } catch (error) {
            if (error.status !== 304) {
                console.error(error);
                alert(`업데이트 중 오류가 발생했습니다.`);
            }
        }
    };

// API 호출: 이미지 업로드
    const handleImageSave = async (newImageFile) => {
        const blob = base64ToBlob(newImageFile, "image/jpeg");
        const formData = new FormData();
        formData.append("profileImage", blob, "profile.jpg");

        try {
            const response = await axiosInstance.patch(`/api/user/profile`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                const updatedProfile = response.data;
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    profileImage: `${updatedProfile.profileImage}?t=${Date.now()}`,
                }));
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
                    currentImage={profile.profileImage}
                    onClose={() => setIsImageModalOpen(false)}
                    onSave={handleImageSave} // 저장 시 호출
                />
            )}
        </div>
    );
};
export default SocialPanel;
