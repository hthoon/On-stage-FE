import React, { useState } from "react";
import "./SocialPanel.css";
import { HiChevronLeft } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useAxios } from "../../context/AxiosContext";

const AddSocialLinkModal = ({ socialLink, setSocialLink, onClose }) => {
    const { axiosInstance } = useAxios();

    const [formData, setFormData] = useState({
        instagram: socialLink.instagram || "",
        youtube: socialLink.youtube || "",
        x: socialLink.x || "",
        spotify: socialLink.spotify || "",
        github: socialLink.github || "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const urlPatterns = {
        instagram: "instagram.com",
        youtube: "youtube.com/@",
        x: "x.com", // 또는 "x.com"
        spotify: "spotify.com",
        github: "github.com",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (value && !value.includes(urlPatterns[name])) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `${name}의 URL 형식이 올바르지 않습니다.`,
            }));
        } else {
            setErrors((prevErrors) => {
                const { [name]: _, ...rest } = prevErrors; // 오류 제거
                return rest;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (value && !value.includes(urlPatterns[key])) {
                newErrors[key] = `${key}의 URL 형식이 올바르지 않습니다.`;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post(`/api/social-link`, {
                userId: socialLink.userId,
                ...formData,
            });
            setSocialLink(response.data);
            onClose();
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        } finally {
            setLoading(false);
        }
    };

    // 버튼 비활성화 조건: 로딩 중이거나 오류가 있거나 모든 필드가 비어있는 경우
    const isSubmitDisabled =
        loading || Object.keys(errors).length > 0 || Object.values(formData).every((value) => !value);

    // 버튼 텍스트 설정: 오류가 있으면 첫 번째 오류 메시지를, 아니면 기본 텍스트를 표시
    const buttonText =
        loading
            ? "저장 중..."
            : Object.values(errors)[0] || "저장";

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="detail-modal-close-btn-container">
                    <HiChevronLeft className="modal-close-btn" onClick={onClose} />
                    <h2 className="detail-modal-title">소셜 링크 추가</h2>
                    <IoMdClose className="modal-close-btn" onClick={onClose} />
                </div>
                <div className="details-border-line"></div>

                <form onSubmit={handleSubmit}>
                    {Object.entries(formData).map(([platform, value]) => (
                        <div className="form-group" key={platform}>
                            <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                            <input
                                type="url"
                                name={platform}
                                value={value}
                                onChange={handleChange}
                                placeholder={`${platform} URL`}
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`management-detail-submit-button ${loading ? "loading" : ""}`}
                        disabled={isSubmitDisabled}
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSocialLinkModal;
