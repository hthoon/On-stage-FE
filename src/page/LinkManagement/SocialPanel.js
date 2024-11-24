import React, {useState} from "react";
import "./SocialPanel.css";
import {useLink} from "../../context/LinkContext";

const SocialPanel = () => {
    const profileImage = "https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg";


    return (
        <div>
            <div>
                <img src={profileImage} alt="Profile" className="social-panel-profile-image"/>
                <h5 className="social-panel-name">Winter</h5>
                <h6 className="social-panel-description"> 카리나는요? </h6>
            </div>

            <div className="">

            </div>

        </div>
    );
};
export default SocialPanel;