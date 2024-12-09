import React from 'react';
import "./Login.css";
import {FaUser} from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import {SiNaver} from "react-icons/si";
import {RiKakaoTalkFill} from "react-icons/ri";
import login from "../../assets/loginbutton/login.jpg";

function Login() {

    const handleOAuth = (provider) => {
        return `http://localhost:8080/oauth2/authorization/${provider}`;
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                {/*<img className="login-image-placeholder" src={login} alt="login"/>*/}

            </div>
            <div className="login-right">
                <FaUser className="login-icon"/>
                <h1>로그인</h1>
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
