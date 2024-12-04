import React, {useState, useEffect} from "react";
import "./Management.css";
import "./DetailModal.css";
import {HiChevronLeft, HiPlus} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import {getDomainType, mapServiceTypeToKorean, mapServiceTypeToIcon} from "../../utils/AnalysisURL";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";
import {LuTrash2} from "react-icons/lu";
import {FiEdit3} from "react-icons/fi";
import Tooltip from "../../components/tooltip/Tooltip";
import {useSpotify} from "../../context/SpotifyContext";

const DetailManagement = ({updateLink, handleDeleteLink, handleToggleLink, link, musicBlock}) => {
    const {axiosInstance} = useAxios();
    const { setLinks } = useLink();
    const [linkId, setLinkId] = useState(link.id);
    const [details, setDetails] = useState(link.details || []); // 로컬 상태로 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputURL, setInputURL] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [translatedServiceType, setTranslatedServiceType] = useState("");
    const [serviceIcon, setServiceIcon] = useState("");
    const [isValidURL, setIsValidURL] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const CREATE = "create";
    const UPDATE = "update";
    const [mode, setMode] = useState(CREATE);
    const [selectedDetail, setSelectedDetail] = useState(null); // 수정할 detail
    const [padding, setPadding] = useState(link.padding); // 여백 크기
    const [isSaving, setIsSaving] = useState(false);

    const openModal = (detail = null) => {
        setIsModalOpen(true);
        if (detail) {
            // 수정 모드 초기화
            setMode(UPDATE);
            setSelectedDetail(detail);
            setInputURL(detail.url);
            setServiceType(detail.type);
            setTranslatedServiceType(mapServiceTypeToKorean(detail.type));
            setIsValidURL(true);
        } else {
            // 생성 모드 초기화
            setMode(CREATE);
            setSelectedDetail(null);
            setInputURL("");
            setServiceType("");
            setTranslatedServiceType("");
            setIsValidURL(false);
            console.log(mode);
        }
    };

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
        } else {
            document.body.style.overflow = ""; // 모달이 닫히면 스크롤 복구
        }
        setLinkId(link.id);
    }, [isModalOpen]);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const updatedLink = {
                ...link,
                padding,
            };

            await updateLink(updatedLink);

            alert("설정이 저장되었습니다!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("설정 저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // URL 변경 시 자동 분석
    const handleInputChange = (event) => {
        const url = event.target.value;
        setInputURL(url);
        const type = getDomainType(url);
        setServiceType(type);
        setTranslatedServiceType(mapServiceTypeToKorean(type));
        setServiceIcon(mapServiceTypeToIcon(type));
        setIsValidURL(type !== "INVALID" && type !== "NULL");
    };

    const handleDeleteDetail = async (detailId) => {
        try {
            await axiosInstance.delete(`/api/link-detail/${detailId}`)
            setDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== detailId));
            setLinks((prevLinks) =>
                prevLinks.map((item) =>
                    item.id === link.id
                        ? {...item, details: item.details.filter((detail) => detail.id !== detailId)}
                        : item
                )
            );
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const updatePadding = (newPadding) => {
        setLinks((prevLinks) =>
            prevLinks.map((item) =>
                item.id === link.id ? { ...item, padding: newPadding } : item // 현재 링크의 padding 값만 변경
            )
        );
    };

    const handleSave = async () => {
        if (!isValidURL || isSubmitting || !link?.id) return;
        setIsSubmitting(true);
        try {
            if (mode === CREATE) {
                // 생성 모드
                const response = await axiosInstance.post(`/api/link-detail/${linkId}`, {
                    url: inputURL,
                    platform: serviceType,
                });

                const newDetail = response.data;
                setDetails((prevDetails) => [...prevDetails, newDetail]);
                setLinks((prevLinks) =>
                    prevLinks.map((item) =>
                        item.id === link.id
                            ? {...item, details: [...item.details, newDetail]}
                            : item
                    )
                );
            } else if (mode === UPDATE && selectedDetail) {
                // 수정 모드
                const response = await axiosInstance.put("/api/link-detail", {
                    url: inputURL,
                    platform: serviceType,
                    id: selectedDetail.id,
                });

                const updatedDetail = response.data;
                setDetails((prevDetails) =>
                    prevDetails.map((detail) =>
                        detail.id === updatedDetail.id ? updatedDetail : detail
                    )
                );
                setLinks((prevLinks) =>
                    prevLinks.map((item) =>
                        item.id === link.id ? {
                            ...item, details: item.details.map((detail) =>
                                detail.id === updatedDetail.id ? updatedDetail : detail),
                        } : item)
                );
            }
            closeModal();
        } catch (error) {
            console.error("Error saving link detail:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="link-details">
            <div className="link-control-container">
                <p className="link-details-message">다양한 서비스 링크를 제공해보세요!</p>
                <div className="link-control-button-container">
                <button
                    onClick={() => handleDeleteLink(link)}
                    className="detail-trash-button"
                >
                    <LuTrash2/>
                </button>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={link.active}
                        onChange={() => handleToggleLink(link)}
                    />
                    <span className="slider"></span>
                </label>
                </div>
            </div>

            {details.length === 0 ? (
                <p></p>
            ) : (
                details.map((detail, index) => (
                    <div key={index} className="link-details-list">
                        <div className="link-details-platform">
                        <span className="service-icon">
                            {mapServiceTypeToIcon(detail.platform)}
                        </span>
                            <p className="service-platform">{mapServiceTypeToKorean(detail.platform)}</p>
                        </div>
                        <div>
                            <Tooltip text="URL 변경">
                                <button
                                    onClick={() => openModal(detail)}
                                    className="detail-trash-button "
                                >
                                    <FiEdit3/>
                                </button>
                            </Tooltip>
                            <button
                                onClick={() => handleDeleteDetail(detail.id)}
                                className="detail-trash-button"
                            >
                                <LuTrash2/>
                            </button>
                        </div>

                    </div>
                ))
            )}

            {link.blockType === "BLANK" ? (
                <div className="blank-link-options">
                    <p>여백 크기 설정</p>
                    <input
                        type="range"
                        value={link.padding}
                        onChange={(e) => updatePadding(Number(e.target.value))}
                        min={0}
                        max={50}
                        className="theme-border-radius-slider"
                    />
                    <p>{link.padding}px</p>
                    <button
                        className="management-add-service-button"
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                    >
                        {isSaving ? "저장 중..." : "저장"}
                    </button>
                </div>
            ) : link.blockType === "FOLDER" ? (
                <div>
                    <button className="management-add-service-button" onClick={() => openModal()}>
                        <HiPlus className="add-link-icon"/> URL 추가
                    </button>
                </div>
            ) : link.blockType === "MUSIC" ? (
                <div className="music-block">
                    {musicBlock ? (
                        <div className="track-info">
                            <img src={musicBlock.albumCover} alt="Album Cover" className="add-link-album-cover"/>
                            <p className="add-link-music-info-title">{musicBlock.title}</p>
                            <p className="add-link-music-info">아티스트: {musicBlock.artist}</p>
                            <p className="add-link-music-info">앨범: {musicBlock.album}</p>
                        </div>
                    ) : (
                        <p>Spotify URL 정보가 없습니다.</p> // Fallback text if musicBlock is null
                    )}
                </div>
            ) : null}

            {/* 모달 창 */}
            {isModalOpen && (
                <div className={`modal-overlay ${isModalOpen ? "open" : ""}`}>
                    <div className={`detail-modal-content ${isModalOpen ? "open" : ""}`}>
                        <div className="detail-modal-close-btn-container">
                            <HiChevronLeft className="modal-close-btn" onClick={closeModal}/>
                            <h2 className="detail-modal-title">
                                {mode === CREATE ? "URL 추가" : "URL 수정"}
                            </h2>
                            <IoMdClose className="modal-close-btn" onClick={closeModal}/>
                        </div>
                        <div className="detail-modal-body">
                            <div className="details-border-line"></div>
                            <input
                                type="text"
                                placeholder="URL"
                                className="detail-modal-input"
                                value={inputURL}
                                onChange={handleInputChange}/>
                            {serviceType && (
                                <p className="service-type-result">
                                    {serviceIcon}
                                </p>
                            )}
                            <p>URL을 입력해주세요. <br/> On-Stage는 다양한 플랫폼을 지원합니다.</p>
                        </div>
                        <button
                            type="submit"
                            className={`management-detail-submit-button ${isValidURL ? "" : "disabled-button"}`}
                            disabled={!isValidURL || isSubmitting}
                            onClick={handleSave}>
                            {isSubmitting ? "저장 중..." : isValidURL ? mode === CREATE ? "추가" : "수정" : "URL을 확인하세요"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default DetailManagement;
