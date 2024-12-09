import React, { useEffect, useState } from 'react';
import "./LinkDisplay.css";
import { useLink } from "../../context/LinkContext";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { SlSocialSpotify, SlSocialYoutube } from "react-icons/sl";
import { FaXTwitter } from "react-icons/fa6";
import { CiStar, CiShare1 } from "react-icons/ci";
import { sortLinksByPrevId } from "../../utils/sortLinks";
import { mapServiceTypeToIcon, mapServiceTypeToKorean } from "../../utils/AnalysisURL";
import {MdVerified} from "react-icons/md";


const LinkDisplay = () => {
    const { links, socialLink, theme, profile } = useLink();
    const [background, setBackground] = useState("");
    const [isManagementPage, setIsManagementPage] = useState(false);
    const sortedLinks = sortLinksByPrevId(links);
    const [expandedLinkId, setExpandedLinkId] = useState(null);
    const VERIFIED = "VERIFIED"

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

    const socialIcons = {
        instagram: <FaInstagram />,
        youtube: <SlSocialYoutube />,
        x: <FaXTwitter />,
        spotify: <SlSocialSpotify />,
        github: <FaGithub />,
    };

    useEffect(() => {
        // Check if we're on the management page
        setIsManagementPage(window.location.pathname.includes("/management"));

        if (theme.backgroundImage) {
            setBackground(theme.backgroundImage); // backgroundImage가 있을 때만 설정
        } else {
            setBackground("https://s3-on-stage.s3.ap-northeast-2.amazonaws.com/backgroundImages/20.png"); // 배경이 없다면 빈 문자열 설정
        }
    }, [theme]);

    return (
        <div className="linktree-container">
            <div
                className="linktree-background" style={{ backgroundImage: `url(${background})` }}>
                <div className="linktree-share">
                    <h6 className="linktree-share-icon"><CiStar /></h6>
                    <h6 className="linktree-share-icon"><CiShare1 /></h6>
                </div>

                {/*프로필 섹션*/}
                <div className="profile-container">
                    <img src={profile.profileImage} alt="Profile" className="profile-image" />
                </div>

                <h5 className="linktree-name">{profile.nickname}  {profile.verified === VERIFIED  && <MdVerified  className="profile-verified-icon" />}</h5>

                <h6 className="linktree-description"> {profile.description} </h6>

                {/*메인 섹션*/}
                <div className="linktree-content">
                    <div className={`linktree-links`}>
                        {sortedLinks
                            .filter((link) => link.active) // 활성화된 링크만 필터링
                            .map((link, index) => (
                                link.blockType === "MUSIC" ? (
                                    // For MUSIC block type, directly render the music iframe without the linktree-button wrapper
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
                                            ...(link.blockType === "BLANK"
                                                ? { "--contentHeight": `${link.padding}px` } // padding 값을 --contentHeight 변수에 반영
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
                                                            <div className="linktree-detail-item">
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
                            >
                                {socialIcons[platform] || platform}
                            </a>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default LinkDisplay;
