import React, {useState} from 'react';
import LinkDisplay from "../../components/LinkDisplay/LinkDisplay";
import "./Management.css";
import "./Tutorial.css";
import "./Share.css";

import ManagementPanel from "./ManagementPanel";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";
import AddLinkPanel from "./AddLinkPanel";
import SocialPanel from "./SocialPanel";
import ThemeSwitcher from "./ThemeSwitcher";
import {FaChevronUp, FaLink} from "react-icons/fa";
import {BiSolidFlagCheckered} from "react-icons/bi";
import {PiShareNetworkBold} from "react-icons/pi";

const Management = () => {
    const {axiosInstance} = useAxios();
    const { setLinks, profile } = useLink();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [isLinkVisible, setIsLinkVisible] = useState(false);
    const nickname = profile.nickname;
    const shareURL = `http://localhost:3000/page/${nickname}`; // todo 도메인 변경
    
    const updateLink = async (updatedLink) => {
        console.log(updatedLink);
        const response = await axiosInstance.put(`/api/link`,updatedLink);
        const updatedData = response.data;
        setLinks(prevLinks =>
            prevLinks.map(link =>
                // 최신 데이터로 갱신
                link.id === updatedData.id ? updatedData : link
            )
        );
    };

    // URL 복사
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareURL);
        setIsLinkVisible(false);
    };


    const createLink = async (link) => {
        const response = await axiosInstance.post(`/api/link`,link);
        return response.data;
    }

    const deleteLink = async (id) => {
        await axiosInstance.delete(`/api/link/${id}`);
    }

    return (
        <div className="management-container">
            <div className="share-button-container">
                {/* 공유 버튼 */}
                {!isLinkVisible ? (
                    <button
                        onClick={() => setIsLinkVisible(true)}
                        className="share-btn top-right"
                    >
                        <PiShareNetworkBold/>
                    </button>
                ) : (
                    // 링크 표시
                    <div className="share-link-container">
                        <input
                            type="text"
                            value={shareURL}
                            readOnly
                            className="share-link-input"
                        />
                        <button onClick={copyToClipboard} className="copy-btn">
                            <FaLink/> 복사
                        </button>
                        <button
                            onClick={() => setIsLinkVisible(false)}
                            className="close-btn"
                        >
                            닫기
                        </button>
                    </div>
                )}
            </div>

            <div className="management-panel">
                <SocialPanel/>
                <ThemeSwitcher/>
                {/* 링크 Create 패널 */}
                <AddLinkPanel
                    updateLink={updateLink}
                    createLink={createLink}/>
                {/* 메인 링크 관리 패널*/}
                <ManagementPanel
                    updateLink={updateLink}
                    deleteLink={deleteLink}
                />
            </div>

            {/* 디스플레이 패널 */}
            <div className="display-panel">
                <LinkDisplay/>
            </div>

            {/* 팝업 버튼 */}
            <button
                className="popup-toggle-button"
                onClick={() => setIsPopupOpen(true)}
            >
                <FaChevronUp/>
            </button>

            {/* 팝업 컴포넌트 */}
            {isPopupOpen && (
                <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <LinkDisplay/>
                    </div>
                </div>
            )}

            {/* 튜토리얼 관리 모달 */}
        </div>

    );

};
export default Management;

