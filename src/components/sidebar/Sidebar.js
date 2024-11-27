import React, { useState } from "react";
import "./Sidebar.css";
import {BsBarChart, BsGear, BsHouse, BsLayoutSidebar, BsLink} from "react-icons/bs";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            {/* 토글 버튼 */}
                <BsLayoutSidebar className="sidebar-toggle" onClick={toggleSidebar} />

            {/* 사이드바 */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-empty-space" />
                <div className="sidebar-menu">
                    <div className="sidebar-menu-item"><a href="/">홈</a></div>
                    <div className="sidebar-menu-item"><a href="/management">링크</a></div>
                    <div className="sidebar-menu-item"><a href="#services">분석</a></div>
                    <div className="sidebar-menu-item"><a href="#services">아티스트정보</a></div>
                    <div className="sidebar-menu-item"><a href="#services">공연정보</a></div>
                    <div className="sidebar-menu-item"><a href="#contact">설정</a></div>
                </div>

                {/* 회원 이미지 */}
                <div className="sidebar-profile" onClick={toggleModal}>
                    <img
                        src="https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg" // 대체할 프로필 이미지 URL
                        alt="Profile"
                        className="profile-image"

                    />
                    <h4>Winter</h4>
                </div>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>회원 정보</h3>
                        <p>여기에 회원 정보를 표시할 수 있습니다.</p>
                        <button onClick={toggleModal}>닫기</button>
                    </div>
                </div>
            )}

            {/* 하단바 */}
            <div className="bottom-nav">
                <a href="/" className="bottom-nav-item">
                    <BsHouse/>
                    <span>홈</span>
                </a>
                <a href="/management" className="bottom-nav-item">
                    <BsLink/>
                    <span>링크</span>
                </a>
                <a href="#services" className="bottom-nav-item">
                    <BsBarChart/>
                    <span>분석</span>
                </a>
                <a href="/info" className="bottom-nav-item">
                    <BsBarChart/>
                    <span>아티스트정보</span>
                </a>
                <a href="#info" className="bottom-nav-item">
                    <BsBarChart/>
                    <span>공연정보</span>
                </a>
                <a href="#contact" className="bottom-nav-item">
                    <BsGear/>
                    <span>설정</span>
                </a>
            </div>
        </>
    );
};

export default Sidebar;
