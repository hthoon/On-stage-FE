import React, { useState, useEffect } from "react";
import "./Management.css";
import "./DetailModal.css";
import { HiChevronLeft, HiPlus } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import {getDomainType, mapServiceTypeToKorean} from "../../utils/AnalysisURL";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";

const DetailManagement = ({ link }) => {
    const {axiosInstance} = useAxios();
    const [details, setDetails] = useState(link.details || []); // 로컬 상태로 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputURL, setInputURL] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [translatedServiceType, setTranslatedServiceType] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { links, setLinks } = useLink();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setInputURL("");
        setServiceType("");
        setTranslatedServiceType("");
        setIsValidURL(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden"; // 모달이 열리면 스크롤 방지
        }
        else {
            document.body.style.overflow = ""; // 모달이 닫히면 스크롤 복구
        }
    }, [isModalOpen]);

    // URL 변경 시 자동 분석
    const handleInputChange = (event) => {
        const url = event.target.value;
        setInputURL(url);
        const type = getDomainType(url);
        setServiceType(type);
        setTranslatedServiceType(mapServiceTypeToKorean(type));
        setIsValidURL(type !== "INVALID" && type !== "NULL");
    };

    const handleAddLinkDetail = async () => {
        if (!isValidURL || isSubmitting) return; // 유효하지 않거나 요청 중이면 무시
        setIsSubmitting(true);

        try {
            const linkId = link.id;
            const response = await axiosInstance.post(`/api/link-detail/${linkId}`, {
                url: inputURL,
                type: serviceType
            });

            const newDetail = response.data; // 추가된 detail 데이터
            setDetails((prevDetails) => [...prevDetails, newDetail]); // 로컬 업데이트

            // LinkContext의 links 업데이트
            setLinks((prevLinks) =>
                prevLinks.map((item) =>
                    item.id === linkId
                        ? { ...item, details: [...item.details, newDetail] } // 현재 링크의 details만 업데이트
                        : item
                )
            );

            closeModal(); // 모달 닫기
        }
        catch (error) {
            console.error("Error adding link detail:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="link-details">
            <p className="link-details-message-title">Link</p>
            <p className="link-details-message">방문자에게 다양한 서비스 링크를 제공해보세요!</p>
            {details.length === 0 ? (
                <p>No details available for this link.</p>
            ) : (
                details.map((detail, index) => (
                    <div key={index} className="link-details-list">
                        <p>{detail.url}</p>
                    </div>
                ))
            )}
            <div>
                <button
                    className="management-add-service-button"
                    onClick={openModal}
                >
                    <HiPlus className="add-link-icon" /> 서비스 추가
                </button>
            </div>

            {/* 모달 창 */}
            {isModalOpen && (
                <div className={`modal-overlay ${isModalOpen ? "open" : ""}`}>
                    <div className={`detail-modal-content ${isModalOpen ? "open" : ""}`}>
                        <div className="detail-modal-close-btn-container">
                            <HiChevronLeft className="modal-close-btn" onClick={closeModal} />
                            <h2 className="detail-modal-title">서비스 추가</h2>
                            <IoMdClose className="modal-close-btn" onClick={closeModal} />
                        </div>
                        <div className="detail-modal-body">
                            <div className="details-border-line"></div>
                            <input
                                type="text"
                                placeholder="URL"
                                className="detail-modal-input"
                                value={inputURL}
                                onChange={handleInputChange}
                            />
                            {serviceType && (
                                <p className="service-type-result">
                                    {translatedServiceType}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`management-detail-submit-button ${
                                isValidURL ? "" : "disabled-button"
                            }`}
                            disabled={!isValidURL || isSubmitting}
                            onClick={handleAddLinkDetail}
                        >
                            {isSubmitting ? "추가 중..." : isValidURL ? "추가" : "URL을 확인하세요"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DetailManagement;
