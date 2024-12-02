import React, { useEffect, userState } from 'react';
import { useNavigate } from "react-router-dom";
import { getCookie, useAxios } from "../../context/AxiosContext";
import LoginButton from "../../components/button/LoginButton"
import naver_button from "../../assets/loginbutton/naver_button.png"
import kakao_button from "../../assets/loginbutton/kakao_button.png"
import google_button from "../../assets/loginbutton/google_button.svg"
import "./Login.css";

function Login() {
    const { axiosInstance } = useAxios();
    const navigate = useNavigate();

    const handleOAuth = (provider) => {
        return `http://localhost:8080/oauth2/authorization/${provider}`
    }

    const handleLogout = async() => {

        try {
            await axiosInstance.post('/logout', null, {
            });
            navigate('/login');
        } catch (error) {
            console.error('logout error', error)
        }
    }

    const handleResponseToken = async () => {

        try {
            axiosInstance.get('/tokentest', null);
        } catch (error) {
            console.error('token error', error);
        }
    }

    const handleReissueToken = async () => {

        try {
            axiosInstance.post('/api/auth/reissue', null);
        } catch (error) {
            console.error('reissue error', error);
        }
    }


    return (
        <div>
            <div className="login-container">
                <h1> 로그인 </h1>
                <LoginButton
                    src={google_button}
                    alt="GoogleLogin"
                    authLink={handleOAuth('google')}
                />
                <LoginButton
                    src={naver_button}
                    alt="NaverLogin"
                    authLink={handleOAuth('naver')}
                />
                <LoginButton
                    src={kakao_button}
                    alt="KakaoLogin"
                    authLink={handleOAuth('kakao')}
                />
                <LoginButton
                    src='src'//{github_button}
                    alt="GithubLogin"
                    authLink={handleOAuth('google')}
                />


                <div className="user-login-logo text-center mb-5">

                    <button onClick={handleLogout}>로그아웃</button>
                </div>
                <div>
                    <button onClick={handleResponseToken}>토큰 전달</button>
                </div>
                <div>
                    <button onClick={handleReissueToken}>토큰 재발급</button>
                </div>

            </div>
        </div>

    );
}

export default Login;