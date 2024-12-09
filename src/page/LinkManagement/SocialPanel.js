import React, { useRef, useState} from "react";
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
import {MdVerified} from "react-icons/md";

const EditableField = ({ field, value, onSave, children, isVerified }) => {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState("");

    // 입력 값 검증 함수
    const validate = (value) => {
        if (value.trim().length < 1) {
            return "한글자 정도는 입력하셔야죠";
        }

        if (value.trim().length > 20) {
            return "너무 길어요";
        }

        return ""; // 유효한 값이면 빈 문자열 반환
    };

    // 포커스 시 편집 모드로 전환
    const handleFocus = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (ref.current) {
                const inputElement = ref.current;
                inputElement.focus();
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
            }
        }, 0);
    };

    // 입력 값 변경 처리
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    // 엔터키 입력 시 포커스 해제
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    };

    // 블러 시 검증 및 저장 처리
    const handleBlur = () => {
        setIsEditing(false);

        const validationError = validate(inputValue.trim());
        if (validationError) {
            setError(validationError);
            alert(validationError); // 에러 메시지 알림
        } else {
            setError("");
            onSave(field, inputValue.trim()); // 저장
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

            {field === "nickname" && isVerified && !isEditing && <MdVerified  className="profile-verified-icon" />}
            {!isEditing && (
                <Tooltip text={`${field === "nickname" ? "블록 이름" : "설명"} 바꾸기`}>
                    <GrEdit className="edit-icon" onClick={handleFocus} />
                </Tooltip>
            )}
            {error && <div className="error-message">{error}</div>} {/* 오류 메시지 표시 */}
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
                    />
                </div>
                <div className="social-panel-description">
                    <EditableField
                        field="description"
                        value={profile.description}
                        onSave={updateProfileField}
                        profile={profile}
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
                    // onSave={handleImageSave} // 저장 시 호출
                />
            )}
        </div>
    );
};
export default SocialPanel;
