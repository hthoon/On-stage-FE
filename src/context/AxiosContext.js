import axios from "axios";
import {createContext, useContext} from "react";
import {jwtDecode} from "jwt-decode";

// 쿠키 읽어오기
export const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

export const getValue = (key) => {
    const decodedToken = jwtDecode(getCookie('access'));

    return decodedToken[key] || null;
}

const AxiosContext = createContext();
export const useAxios = () => useContext(AxiosContext);
export const AxiosContextProvider = ({children}) => {


    // Axios 인스턴스 설정
    // 쿠키를 허용하여 서버에서의 Refresh 토큰 검증에 사용한다.
    const axiosInstance = axios.create({
        baseURL: `${process.env.REACT_APP_SERVER_HOST}`,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });

    // 요청 인터셉터 설정
    // 쿠키의 Access 토큰을 헤더에 포함시켜 요청한다.
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = getCookie('access');

            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // // 응답 인터셉터 설정
    // axiosInstance.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //         const originalRequest = error.config;
    //         if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
    //             originalRequest._retry = true;
    //             try {
    //                 const { data } = await axiosInstance.post("/api/user/refresh", {
    //                     refresh_token: refreshToken,
    //                     access_token: accessToken,
    //                     userId: null
    //                 });
    //                 const newAccessToken = data.access_token;
    //                 updateTokens(newAccessToken, refreshToken);
    //                 originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    //                 return axiosInstance(originalRequest);
    //             } catch (err) {
    //                 console.error("리프레시 토큰 만료:", err);
    //                 logout();
    //             }
    //         }
    //         return Promise.reject(error);
    //     }
    // );

    return (
        <AxiosContext.Provider value={{axiosInstance}}>
            {children}
        </AxiosContext.Provider>
    );
};