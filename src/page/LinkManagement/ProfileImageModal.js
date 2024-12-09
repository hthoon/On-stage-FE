import React, {useState} from "react";
import "./ProfileImageModal.css";
import {HiCamera, HiChevronLeft} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";
import {base64ToBlob} from "../../utils/BlobConverter";

const ProfileImageModal = ({currentImage, onClose, onSave}) => {
    const [image, setImage] = useState(currentImage);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const {axiosInstance} = useAxios();
    const {setProfile} = useLink();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setFile(file);
        };
        reader.readAsDataURL(file);
    };

    // API 호출: 이미지 업로드
    const handleImageSave = async () => {
        const blob = base64ToBlob(image, "image/jpeg");
        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const response = await axiosInstance.patch(`/api/user/profile`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
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
        finally {
            onClose();
        }
    };

    // const handleSave = () => {
    //     handleImageSave(); // 부모 컴포넌트에 이미지 저장 요청
    //
    // };

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
                    <button className="management-detail-submit-button" onClick={handleImageSave}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileImageModal;
