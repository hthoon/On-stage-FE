import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Cookies from 'js-cookie';


// Context 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트: 로그인 상태와 관련된 값을 전역에서 관리
export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const accessToken = Cookies.get('access');
        setLoggedIn(!!accessToken);
    }, [location]); // 페이지가 변경될 때마다 로그인 상태 확인

    return (
        <AuthContext.Provider value={{ loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// 로그인 상태를 사용할 수 있는 훅
export const useAuth = () => useContext(AuthContext);
