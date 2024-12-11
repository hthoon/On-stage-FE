import React, {useEffect, useState} from 'react';
import "./LinkDisplay.css";
import {useLink} from "../../context/LinkContext";
import {FaGithub, FaInstagram} from "react-icons/fa";
import {SlSocialSpotify, SlSocialYoutube} from "react-icons/sl";
import {FaXTwitter} from "react-icons/fa6";
import {CiStar} from "react-icons/ci";
import {sortLinksByPrevId} from "../../utils/sortLinks";
import {mapServiceTypeToIcon, mapServiceTypeToKorean} from "../../utils/AnalysisURL";
import {MdVerified} from "react-icons/md";
import {HiChevronLeft, HiDotsHorizontal} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";
import axios from 'axios';
import {PuffLoader} from "react-spinners";

const LinkDisplay = () => {
    const {links, socialLink, theme, profile, isLoading} = useLink();
    const [background, setBackground] = useState("");
    const [isManagementPage, setIsManagementPage] = useState(false);
    const sortedLinks = sortLinksByPrevId(links);
    const [expandedLinkId, setExpandedLinkId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const VERIFIED = "VERIFIED"

    const handleToggleExpand = (id) => {
        setExpandedLinkId((prevId) => (prevId === id ? null : id));
    };

    const getSpotifyEmbedUrl = (url) => {
        if (!url.includes("open.spotify.com")) return null;

        const parts = url.split("/");
        const type = parts[3];
        const id = parts[4]?.split("?")[0];
        return `https://open.spotify.com/embed/${type}/${id}`;
    };

    const socialIcons = {
        instagram: <FaInstagram/>,
        youtube: <SlSocialYoutube/>,
        x: <FaXTwitter/>,
        spotify: <SlSocialSpotify/>,
        github: <FaGithub/>,
    };

    useEffect(() => {
        setIsManagementPage(window.location.pathname.includes("/management"));
        console.log(theme);
        if (theme.backgroundImage) {
            setBackground(theme.backgroundImage);
        } else {
            setBackground(null);
        }

        // 페이지 조회 기록
        if (profile.username) {
            recordPageView(profile.username);
        }

    }, [theme, profile.username]);

    // 페이지 조회 이벤트 기록
    const recordPageView = async (username) => {
        try {
            const ipResponse = await axios.get('/api/analytics/get-ip');
            const ipAddress = ipResponse.data;
            await axios.post('/api/analytics/page', {ipAddress, username});
        } catch (error) {
            console.error("Error recording page view:", error);
        }
    };

    // 링크 클릭 이벤트 기록
    const recordLinkClick = async (username, linkId) => {
        try {
            await axios.post('/api/analytics/link', {username, linkId});
        } catch (error) {
            console.error("Error recording link click:", error);
        }
    };

    // 소셜 링크 클릭 이벤트 기록
    const recordSocialLinkClick = async (username, socialLinkType) => {
        try {
            await axios.post('/api/analytics/socialLink', {username, socialLinkType});
        } catch (error) {
            console.error("Error recording social link click:", error);
        }
    };

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    return (
        <div className="linktree-container">
            {isLoading ? (
                <div className="loading-container">
                    <PuffLoader color="#8089ff" size={100}/>
                </div>
            ) : (
                <div
                    className={isManagementPage ? "linktree-background-management" : "linktree-background-visit"}
                    style={{
                        backgroundImage: background ? `url(${background})` : undefined,
                        backgroundColor: background ? undefined : theme.backgroundColor || 'var(--backgroundColor)',
                    }}
                >
                    <div className={isManagementPage ? "linktree-share" : "linktree-share-visit"}>
                        <h6 className="linktree-share-icon-star" style={{color: theme.iconColor || 'var(--iconColor)'}}>
                            <CiStar/>
                        </h6>
                        <h6 className="linktree-share-icon" style={{color: theme.iconColor || 'var(--iconColor)'}}>
                            <HiDotsHorizontal onClick={toggleModal}/></h6>
                    </div>

                    {/*프로필 섹션*/}
                    <div className="profile-container">
                        <img src={profile.profileImage} alt="Profile" className="profile-image"/>
                    </div>

                    <h5 className="linktree-name"
                        style={{color: theme.profileColor || 'var(--profileColor)'}}>{profile.nickname} {profile.verified === VERIFIED &&
                        <MdVerified className="profile-verified-icon"/>}</h5>

                    <h6 className="linktree-description"
                        style={{color: theme.profileColor || 'var(--profileColor)'}}> {profile.description} </h6>

                    {/*메인 섹션*/}
                    <div className={isManagementPage ? "linktree-content" : "linktree-content-visit"}>
                        <div className={`linktree-links`}>
                            {sortedLinks
                                .filter((link) => link.active) // 활성화된 링크만 필터링
                                .map((link, index) => (
                                    link.blockType === "MUSIC" ? (

                                        <div
                                            key={index}
                                            className="linktree-details" // Directly render the details without the button wrapper
                                        >
                                            {link.url && (
                                                <iframe
                                                    src={getSpotifyEmbedUrl(link.url)}
                                                    className="linktree-spotify-embed"
                                                    allow="encrypted-media"
                                                ></iframe>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            key={index}
                                            rel="noopener noreferrer"
                                            className={`linktree-button ${expandedLinkId === link.id ? "expanded" : ""} ${
                                                link.blockType === "BLANK" ? "blank-transparent" : ""
                                            } ${link.blockType === "FOLDER" && !link.details.length ? (isManagementPage ? "folder-transparent-management" : "folder-transparent-visitor") : ""}`}
                                            style={{

                                                color: theme.fontColor || 'var(--fontColor)',
                                                borderRadius: theme.borderRadius || 'var(--borderRadius)',
                                                background: theme.buttonColor || 'var(--buttonColor)',

                                                ...(link.blockType === "BLANK"
                                                    ? {"--contentHeight": `${link.padding}px`} // padding 값을 --contentHeight 변수에 반영
                                                    : {}),
                                            }}
                                            onClick={() => handleToggleExpand(link.id)}
                                        >
                                            <p className="linktree-detail-title">{link.title}</p>
                                            {expandedLinkId === link.id && (
                                                <div
                                                    className="linktree-details"
                                                    onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                                                >
                                                    {(() => {
                                                        if (link.blockType === "MUSIC" && link.url) {
                                                            const spotifyEmbedUrl = getSpotifyEmbedUrl(link.url);

                                                            return spotifyEmbedUrl ? (
                                                                <iframe
                                                                    src={spotifyEmbedUrl}
                                                                    className="linktree-spotify-embed-main"
                                                                    allow="encrypted-media"
                                                                ></iframe>
                                                            ) : (
                                                                <div className="linktree-detail-item" style={{
                                                                    borderRadius: theme.borderRadius || 'var(--borderRadius)'
                                                                }}>
                                                                    <p>Unable to embed this music link.</p>
                                                                </div>
                                                            );
                                                        } else {
                                                            const spotifyDetail = link.details.find(detail =>
                                                                detail.url.includes("spotify.com")
                                                            );

                                                            const spotifyEmbedUrl = spotifyDetail
                                                                ? getSpotifyEmbedUrl(spotifyDetail.url)
                                                                : null;

                                                            return (
                                                                <>
                                                                    {spotifyEmbedUrl && (
                                                                        <iframe
                                                                            src={spotifyEmbedUrl}
                                                                            className="linktree-spotify-embed"
                                                                            allow="encrypted-media"
                                                                        ></iframe>
                                                                    )}
                                                                    {link.details.map((detail, detailIndex) => (
                                                                        <div
                                                                            key={detailIndex}
                                                                            onClick={() => {
                                                                                recordLinkClick(profile.username, link.id); // 링크 클릭 기록
                                                                                window.open(detail.url, "_blank", "noopener,noreferrer"); // 링크 열기
                                                                            }}
                                                                            className="linktree-detail-item"
                                                                            style={{borderRadius: theme.borderRadius || 'var(--borderRadius)'}}>
                                                <span className="linktree-service-icon"
                                                      style={{color: theme.fontColor || 'var(--fontColor)'}}>
                                                    {mapServiceTypeToIcon(detail.platform)}
                                                </span>
                                                                            <p className="linktree-detail-platform-title"
                                                                               style={{color: theme.fontColor || 'var(--fontColor)'}}>
                                                                                {mapServiceTypeToKorean(detail.platform)}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}


                        </div>
                    </div>

                    {/*소셜 섹션*/}
                    <div className="linktree-socials">
                        {Object.entries(socialLink)
                            .filter(([platform, url]) => platform !== "username" && url)
                            .map(([platform, url]) => (
                                <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon"
                                    onClick={() => recordSocialLinkClick(profile.username, platform)} // 소셜 링크 클릭 기록
                                    style={{color: theme.iconColor || 'var(--iconColor)'}}
                                >
                                    {socialIcons[platform] || platform}
                                </a>
                            ))}
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="link-display-modal-overlay" onClick={toggleModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="detail-modal-close-btn-container">
                                    <HiChevronLeft className="modal-close-btn" onClick={toggleModal}/>
                                    <h2 className="detail-modal-title">{profile.nickname}</h2>
                                    <IoMdClose className="modal-close-btn" onClick={toggleModal}/>
                                </div>
                                <div className="profile-container">
                                    <img src={profile.profileImage} alt="Profile" className="profile-image"/>
                                </div>

                                <div className="link-display-url-section">
                                    <input type="text" value={`on.stage/${profile.nickname}`} readOnly
                                           className="link-display-url"/>
                                </div>

                                <div className="LinkDisplay-modal-button-container">
                                    <button onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("URL이 복사되었습니다!");
                                    }}>링크 복사하기
                                    </button>
                                    <button onClick={() => window.open("/artist-events", "_blank")}>공연 정보</button>
                                    <button onClick={() => window.open(`/news/${profile.nickname}`, "_blank")}>아티스트 소식
                                    </button>
                                </div>
                                <button className="link-display-join-button" onClick={() => window.open("/")}>당신도 이런
                                    페이지를 만들고 싶다면?
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default LinkDisplay;
