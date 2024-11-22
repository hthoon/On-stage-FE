import React from 'react';
import "./LinkDisplay.css";
import {useLink} from "../../context/LinkContext";
import {FaInstagram} from "react-icons/fa";
import {SlSocialSpotify} from "react-icons/sl";
import {PiTiktokLogo} from "react-icons/pi";
import {FaXTwitter} from "react-icons/fa6";
import {CiStar, CiShare1} from "react-icons/ci";
import {sortLinksByPrevId} from "../../utils/sortLinks";

const LinkDisplay = () => {
    const backgroundImage = "https://images.pexels.com/photos/3518623/pexels-photo-3518623.jpeg?cs=srgb&dl=pexels-steve-3518623.jpg&fm=jpg";
    const profileImage = "https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg";
    const {links} = useLink();
    const sortedLinks = sortLinksByPrevId(links);

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
                    <div className="linktree-links">
                        {sortedLinks.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer"
                               className="linktree-button">
                                {link.title}
                            </a>))}
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
