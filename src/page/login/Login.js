import React, {useEffect, useState} from 'react';
import "./Login.css";
import {FaUser} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {SiNaver} from "react-icons/si";
import {RiGithubFill, RiKakaoTalkFill} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {PuffLoader} from "react-spinners";

function Login() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 로그인 상태 판단 -> 액세스 토큰이 존재하는가?
        // 존재할 경우, 로그인 페이지로 접근 시 /management로 리다이렉트
        const refreshToken = Cookies.get("access");
        console.log(refreshToken);
        if (refreshToken) {
            navigate("/management");
        }
    }, []);

    const handleOAuth = (provider) => {
        setIsLoading(true);
        return process.env.REACT_APP_SERVER_HOST + `/oauth2/authorization/${provider}`;
    };

    return (
        <div className="login-wrapper">
            {isLoading &&
                <div className="login-loading-container">
                    <PuffLoader color="#8089ff" size={100}/>
                </div>
            }
            <div className="login-right">
                <FaUser className="login-icon"/>
                <h1>당신의 모든 것을 하나의 <span className="highlight-gradient">링크</span>에</h1>
                <button
                    className="login-custom-button"
                    onClick={() => (window.location.href = handleOAuth('google'))}>
                    <FcGoogle className="login-platform-icon-google"/> 구글로 로그인
                </button>
                <button
                    className="login-custom-button"
                    onClick={() => (window.location.href = handleOAuth('naver'))}>
                    <SiNaver className="login-platform-icon-naver"/>네이버로 로그인
                </button>
                <button
                    className="login-custom-button"
                    onClick={() => (window.location.href = handleOAuth('kakao'))}>
                    <RiKakaoTalkFill className="login-platform-icon-kakao"/>카카오로 로그인
                </button>
                <button
                    className="login-custom-button"
                    onClick={() => (window.location.href = handleOAuth('github'))}>
                    <RiGithubFill className="login-platform-icon-github"/>깃허브로 로그인
                </button>
                <div className="login-forgot-button-container">
                    <button className="login-forgot-btn">
                        계정을 잃어버리셨나요?
                    </button>
                </div>

            </div>

        </div>

    );
}

export default Login;
