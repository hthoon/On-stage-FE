import React, { useEffect, userState } from 'react';
import { useNavigate } from "react-router-dom";
import {  useAxios } from "../../context/AxiosContext";
import Cookies from "js-cookie";

function Login() {
    const { axiosInstance } = useAxios();
    const navigate = useNavigate();
    
    const handleLogout = async() => {

        const refreshToken = Cookies.get('refresh');
        
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

    return (

        <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>Login Page</h1>
            <ul>
                <li>
                    <a href="http://localhost:8080/oauth2/authorization/google">구글 로그인</a>
                </li>
                <li>
                    <a href="http://localhost:8080/oauth2/authorization/naver">네이버 로그인</a>
                </li>
                <li>
                    <a href="http://localhost:8080/oauth2/authorization/kakao">카카오 로그인</a>
                </li>
                <li>
                    <a href="http://localhost:8080/oauth2/authorization/github">깃허브 로그인</a>
                </li>
            </ul>
            <div>
                <button onClick={handleLogout}>로그아웃</button>
            </div>
            
        </div>

    );
}

export default Login;