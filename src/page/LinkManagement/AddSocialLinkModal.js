import React, { useState } from "react";
import "./SocialPanel.css";

const AddSocialLinkModal = ({ socialLink, setSocialLink, onClose }) => {
    const [formData, setFormData] = useState({
        instagram: socialLink.instagram || "",
        youtube: socialLink.youtube || "",
        x: socialLink.x || "",
        spotify: socialLink.spotify || "",
        github: socialLink.github || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSocialLink(formData); // 상위 컴포넌트에서 링크 업데이트
        onClose(); // 모달 닫기
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>소셜 링크 추가</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Instagram</label>
                        <input
                            type="url"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="Instagram URL"
                        />
                    </div>
                    <div className="form-group">
                        <label>YouTube</label>
                        <input
                            type="url"
                            name="youtube"
                            value={formData.youtube}
                            onChange={handleChange}
                            placeholder="YouTube URL"
                        />
                    </div>
                    <div className="form-group">
                        <label>X</label>
                        <input
                            type="url"
                            name="x"
                            value={formData.x}
                            onChange={handleChange}
                            placeholder="X (Twitter) URL"
                        />
                    </div>
                    <div className="form-group">
                        <label>Spotify</label>
                        <input
                            type="url"
                            name="spotify"
                            value={formData.spotify}
                            onChange={handleChange}
                            placeholder="Spotify URL"
                        />
                    </div>
                    <div className="form-group">
                        <label>GitHub</label>
                        <input
                            type="url"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="GitHub URL"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="modal-save-button">
                            저장
                        </button>
                        <button type="button" className="modal-cancel-button" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSocialLinkModal;
