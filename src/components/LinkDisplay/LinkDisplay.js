import React, {useState} from 'react';
import "./LinkDisplay.css";
import {useLink} from "../../context/LinkContext";
import {FaInstagram} from "react-icons/fa";
import {SlSocialSpotify} from "react-icons/sl";
import {PiTiktokLogo} from "react-icons/pi";
import {FaXTwitter} from "react-icons/fa6";
import {CiStar, CiShare1} from "react-icons/ci";
import {sortLinksByPrevId} from "../../utils/sortLinks";
import {mapServiceTypeToIcon, mapServiceTypeToKorean} from "../../utils/AnalysisURL";

const LinkDisplay = () => {
    const backgroundImage = "https://images.pexels.com/photos/3518623/pexels-photo-3518623.jpeg?cs=srgb&dl=pexels-steve-3518623.jpg&fm=jpg";
    const profileImage = "https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg";
    const {links} = useLink();
    const sortedLinks = sortLinksByPrevId(links);
    const [expandedLinkId, setExpandedLinkId] = useState(null);


    const handleToggleExpand = (id) => {
        setExpandedLinkId((prevId) => (prevId === id ? null : id));
    };

    const getSpotifyEmbedUrl = (url) => {
        if (!url.includes("open.spotify.com")) return null;

        const parts = url.split("/");
        const type = parts[3]; // e.g., "track", "playlist", etc.
        const id = parts[4]?.split("?")[0]; // Extract ID without query params

        return `https://open.spotify.com/embed/${type}/${id}`;
    };



    return (
        <div className="linktree-container">
            <div
                className="linktree-background" style={{backgroundImage: `url(${backgroundImage})`,}}>
                <div className="linktree-share">
                    <h6 className="linktree-share-icon"><CiStar/></h6>
                    <h6 className="linktree-share-icon"><CiShare1/></h6>
                </div>

                {/*프로필 섹션*/}
                <div className="profile-container">
                    <img src={profileImage} alt="Profile" className="profile-image"/>
                </div>

                <h5 className="linktree-name">Winter</h5>
                <h6 className="linktree-description"> 카리나는요? </h6>

                {/*메인 섹션*/}
                <div className="linktree-content">

                    <div className={`linktree-links`}>
                        {sortedLinks
                            .filter((link) => link.active) // 활성화된 링크만 필터링
                            .map((link, index) => (
                                <div
                                    key={index}
                                    rel="noopener noreferrer"
                                    className={`linktree-button ${expandedLinkId === link.id ? "expanded" : ""}`}
                                    onClick={() => handleToggleExpand(link.id)}
                                >
                                    <p className="linktree-detail-title">{link.title}</p>
                                    {expandedLinkId === link.id && (
                                        <div
                                            className="linktree-details"
                                            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                                        >
                                            {(() => {
                                                // 스포티파이 URL 검색
                                                const spotifyDetail = link.details.find(detail =>
                                                    detail.url.includes("spotify.com")
                                                );

                                                // 스포티파이 임베드 URL 생성
                                                const spotifyEmbedUrl = spotifyDetail
                                                    ? getSpotifyEmbedUrl(spotifyDetail.url)
                                                    : null;

                                                return (
                                                    <>
                                                        {/* 스포티파이 플레이어 */}
                                                        {spotifyEmbedUrl && (
                                                            <iframe
                                                                src={spotifyEmbedUrl}
                                                                className="linktree-spotify-embed"
                                                                allow="encrypted-media"
                                                            ></iframe>
                                                        )}
                                                        {/* 다른 세부 정보 */}
                                                        {link.details.map((detail, detailIndex) => (
                                                            <div
                                                                key={detailIndex}
                                                                onClick={() => window.open(detail.url, "_blank", "noopener,noreferrer")}
                                                                className="linktree-detail-item"
                                                            >
                                                                <span className="linktree-service-icon">
                                                                    {mapServiceTypeToIcon(detail.platform)}
                                                                </span>
                                                                <p>
                                                                    {mapServiceTypeToKorean(detail.platform)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                </div>
                {/*소셜 섹션*/}
                <div className="linktree-socials">
                    <a href="https://example.com/" target="_blank" rel="noopener noreferrer"
                       className="social-icon">
                        <FaInstagram/>
                    </a>
                    <a href="https://example.com/" target="_blank" rel="noopener noreferrer"
                       className="social-icon">
                        <SlSocialSpotify/>
                    </a>
                    <a href="https://example.com/" target="_blank" rel="noopener noreferrer"
                       className="social-icon">
                        <FaXTwitter/>
                    </a>
                    <a href="https://example.com/" target="_blank" rel="noopener noreferrer"
                       className="social-icon">
                        <PiTiktokLogo/>
                    </a>

                </div>
            </div>
        </div>
    );
};
export default LinkDisplay;
