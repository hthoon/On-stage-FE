import React, {useState} from "react";
import "./Sidebar.css";
import {BsBarChart, BsGear, BsHouse, BsLayoutSidebar, BsLink, BsSpeaker} from "react-icons/bs";
import {MdOutlineContactSupport} from "react-icons/md";
import {FiUser} from "react-icons/fi";
import {ImCoinDollar} from "react-icons/im";

import {TbLogout2} from "react-icons/tb";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import { useAxios} from "../../context/AxiosContext";
import Cookies from "js-cookie";
import {FaStaylinked} from "react-icons/fa";
import {SiGoogleanalytics} from "react-icons/si";
import {LuMusic4} from "react-icons/lu";
import {RiSettings4Fill} from "react-icons/ri";
import {useLink} from "../../context/LinkContext";
import {PiSidebarSimpleBold} from "react-icons/pi";

const Sidebar = () => {
    const { loggedIn } = useAuth();
    const { axiosInstance } = useAxios();
    const { profile } = useLink();
    const location = useLocation();
    const navigate = useNavigate();
    const isVisitPage = location.pathname.startsWith('/page/');
    const whitelistPaths = ['/', '/login', '/signup', '/logout', '/main'];
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);


    if (whitelistPaths.includes(location.pathname) || isVisitPage) {
        return null;
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const logout = async() => {

        const refreshToken = Cookies.get('refresh');
        Cookies.remove('username');

        try {
            await axiosInstance.post('/logout', null, {
                withCredentials:true,
                headers: {
                    'Authorization': refreshToken
                }
            });

            navigate('/');

        } catch (error) {
            console.error('logout error', error)
        }
    }

    const login = () => {
        navigate("/login")
    }

    return (
        <>
            {/* 토글 버튼 */}
            <PiSidebarSimpleBold className="sidebar-toggle" onClick={toggleSidebar}/>

            {/* 사이드바 */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-empty-space"/>
                <div className="sidebar-menu">
                    <div className="sidebar-menu-item"><FaStaylinked /><a href="/management">링크 관리</a></div>
                    <div className="sidebar-menu-item"><SiGoogleanalytics /><a href="/analytics">분석</a></div>
                    <div className="sidebar-menu-item"><LuMusic4 /><a href="/news">아티스트</a></div>
                    <div className="sidebar-menu-item"><BsSpeaker /><a href="#services">공연</a></div>
                    <div className="sidebar-menu-item"><RiSettings4Fill /><a href="#contact">설정</a></div>
                </div>

                {/* 회원 이미지 (로그인 상태에 따라 다르게 표시) */}
                {loggedIn ? (
                    <div className="sidebar-profile" onClick={toggleModal}>
                        <img src={profile.profileImage} alt="Profile" className="sidebar-profile-image" />
                        <h4>{profile.nickname}</h4>
                    </div>
                ) : (
                    <div className="sidebar-profile">
                        <button className="" onClick={login}>로그인</button>
                    </div>
                )}
            </div>

            {/* 모달 (로그인 상태에 따라 다르게 표시) */}
            {isModalOpen && loggedIn && (
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
                                src={profile.profileImage}
                                alt="Profile"
                                className="modal-profile-image"
                            />
                            <div className="profile-modal-text-container">
                                <h3>{profile.nickname}</h3>
                                <h5>onstage.{profile.nickname}</h5>
                            </div>
                        </div>

                        <div className="profile-modal-button-container">
                            <h4>Account</h4>
                            <div className="profile-modal-button"><FiUser className="profile-modal-icon" /> 마이페이지</div>
                            <div className="profile-modal-button"><MdOutlineContactSupport className="profile-modal-icon" /> 고객지원</div>
                            <div className="profile-modal-button"><ImCoinDollar className="profile-modal-icon" /> 요금 정책</div>
                            <h4 />
                            <h4 />
                            <div className="profile-modal-button" onClick={logout}>
                                <TbLogout2 className="profile-modal-icon" /> 로그아웃
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 하단바 */}
            <div className="bottom-nav">
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
