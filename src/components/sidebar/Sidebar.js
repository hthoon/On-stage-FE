import React, { useState } from "react";
import "./Sidebar.css";
import {BsBarChart, BsGear, BsHouse, BsLayoutSidebar, BsLink} from "react-icons/bs";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* 토글 버튼 */}
                <BsLayoutSidebar className="sidebar-toggle" onClick={toggleSidebar} />

            {/* 사이드바 */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-empty-space" />
                <div className="sidebar-menu">
                    <div className="sidebar-menu-item"><a href="#home">홈</a></div>
                    <div className="sidebar-menu-item"><a href="#about">링크</a></div>
                    <div className="sidebar-menu-item"><a href="#services">분석</a></div>
                    <div className="sidebar-menu-item"><a href="#contact">설정</a></div>
                </div>
            </div>

            {/* 하단바 */}
            <div className="bottom-nav">
                <a href="#home" className="bottom-nav-item">
                    <BsHouse />
                    <span>홈</span>
                </a>
                <a href="#about" className="bottom-nav-item">
                    <BsLink />
                    <span>링크</span>
                </a>
                <a href="#services" className="bottom-nav-item">
                    <BsBarChart />
                    <span>분석</span>
                </a>
                <a href="#contact" className="bottom-nav-item">
                    <BsGear />
                    <span>설정</span>
                </a>
            </div>
        </>
    );
};

export default Sidebar;
