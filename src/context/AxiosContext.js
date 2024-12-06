import axios from "axios";
import {createContext, useContext} from "react";
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";

const AxiosContext = createContext();
export const useAxios = () => useContext(AxiosContext);
export const AxiosContextProvider = ({children}) => {

    const navigate = useNavigate();

    // Axios 인스턴스 설정
    // 쿠키를 허용하여 서버에서의 Refresh 토큰 검증에 사용한다.
    const axiosInstance = axios.create({
        baseURL: `${process.env.REACT_APP_SERVER_HOST}`,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });

    // Request Interceptor
    // access 쿠키가 존재하면 인증 헤더를 포함한다.
    // access 쿠키가 존재하지 않으면, 백엔드에서 401에러를 응답하여 아래의 인터셉터가 발동한다.
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = Cookies.get('access');

            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    axiosInstance.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post('/api/auth/reissue', {}, {withCredentials: true});
                const newAccessToken = Cookies.get('access');

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosInstance({
                    ...originalRequest,
                    withCredentials: true,
                });

            } catch (reissueError) {
                Cookies.remove('access');
                Cookies.remove('refresh');
                alert('로그인이 필요합니다!');
                navigate('/login');
            }
        }
        return Promise.reject(error);
    });

    const logout = async() => {
        try {
            await axiosInstance.post('/logout', null, {
            });
            navigate('/login');
        } catch (error) {
            console.error('logout error', error)
        }

    }

    return (
        <AxiosContext.Provider value={{axiosInstance}}>
            {children}
        </AxiosContext.Provider>
    );
};