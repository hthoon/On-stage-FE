import React, { useState } from "react";
import "./ProfileImageModal.css";
import {HiCamera, HiChevronLeft} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import {FaCamera} from "react-icons/fa";

const ProfileImageModal = ({ currentImage, onClose, onSave }) => {
    const [image, setImage] = useState(currentImage);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(image); // 부모 컴포넌트에 이미지 저장 요청
        onClose();
    };

    return (
        <div className="profile-image-modal">
            <div className="modal-content">
                <div className="detail-modal-close-btn-container">
                    <HiChevronLeft className="modal-close-btn" onClick={onClose}/>
                    <h2 className="detail-modal-title">
                        프로필 변경
                    </h2>
                    <IoMdClose className="modal-close-btn" onClick={onClose}/>
                </div>

                <div className="details-border-line"></div>

                <div className="profile-image-container">
                    <img src={image} alt="Profile Preview" className="profile-preview"/>
                    <label className="profile-upload-icon">
                        <HiCamera/>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{display: "none"}}
                        />
                    </label>
                </div>

                <div className="modal-actions">
                    <button className="management-detail-submit-button" onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileImageModal;
