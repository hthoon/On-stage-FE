import React, {useState} from "react";
import "./Sidebar.css";
import {BsBarChart, BsGear, BsHouse, BsLayoutSidebar, BsLink} from "react-icons/bs";
import {MdOutlineContactSupport} from "react-icons/md";
import {FiUser} from "react-icons/fi";
import {ImCoinDollar} from "react-icons/im";

import {TbLogout2} from "react-icons/tb";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const profileImage = "https://www.kstarfashion.com/news/photo/202405/215563_131233_4152.jpg";

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            {/* 토글 버튼 */}
            <BsLayoutSidebar className="sidebar-toggle" onClick={toggleSidebar}/>

            {/* 사이드바 */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-empty-space"/>
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
                        src={profileImage}
                        alt="Profile"
                        className="profile-image"

                    />
                    <h4>Winter</h4>
                </div>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div
                    className={`profile-modal-overlay ${isModalOpen ? "show" : ""}`}
                    onClick={toggleModal}
                >
                    <div
                        className={`profile-modal-content ${isModalOpen ? "show" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-modal-container">
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="modal-profile-image"
                            />
                            <div className="profile-modal-text-container">
                            <h3>Winter</h3>
                            <h5>onstage.winter</h5>
                            </div>
                        </div>
                        <div className="profile-modal-button-container">
                            <h4>Account</h4>
                            <div className="profile-modal-button"><FiUser className="profile-modal-icon"/> 마이페이지 </div>
                            <div className="profile-modal-button"><MdOutlineContactSupport className="profile-modal-icon"/> 고객지원 </div>
                            <div className="profile-modal-button"><ImCoinDollar className="profile-modal-icon"/> 요금 정책</div>
                            <h4/>
                            <h4/>
                            <div className="profile-modal-button"><TbLogout2 className="profile-modal-icon"/> 로그아웃</div>
                        </div>
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
