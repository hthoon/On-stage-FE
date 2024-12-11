import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAxios } from "./AxiosContext";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const LinkContext = createContext();
export const useLink = () => useContext(LinkContext);

export const LinkProvider = ({ children }) => {
    const { axiosInstance } = useAxios();
    const location = useLocation();
    const { pathname } = location;
    const nickname = decodeURIComponent(pathname.split('/')[2]);

    const managementPath = ['/management'];
    const etcPath = ['/analytics', '/news', '/map', '/mypage'];
    const visitPath = '/page/';

    const [links, setLinks] = useState([]);
    const [socialLink, setSocialLink] = useState({});
    const [theme, setTheme] = useState({});
    const [profile, setProfile] = useState({});
    const [backgroundImage, setBackgroundImage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const updateTheme = (newTheme) => {
        setTheme((prevTheme) => ({ ...prevTheme, ...newTheme }));
    };

    // API 호출 함수
    const fetchManagement = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get(`/api/link`);
            setLinks(res.data.link);
            setSocialLink(res.data.socialLink);
            setTheme(res.data.theme);
            Cookies.set("username", res.data.theme.username);

            const userResponse = await axiosInstance.get(`/api/user`);
            setProfile(userResponse.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching management data:", error);
        }
    };

    const fetchETC = async () => {
        try {
            const userResponse = await axiosInstance.get(`/api/user`);
            setProfile(userResponse.data);
        } catch (error) {
            console.error("Error fetching management data:", error);
        }
    };

    const fetchVisit = async () => {
        try {
            if (!nickname) return;

            const convert = await axiosInstance.get(`/api/user/convert/${nickname}`);
            const username = convert.data;

            const res = await axiosInstance.get(`/api/link/${username}`);
            setLinks(res.data.link);
            setSocialLink(res.data.socialLink);
            setTheme(res.data.theme);

            const profileResponse = await axiosInstance.get(`/api/user/${username}`);
            setProfile(profileResponse.data);
        } catch (error) {
            console.error("Error fetching visit data:", error);
        }
    };

    // 데이터 로드 처리
    useEffect(() => {
        if (managementPath.includes(pathname)) {
            fetchManagement();
        } else if (pathname.startsWith(visitPath)) {
            fetchVisit();
        }
        else if(etcPath.includes(pathname)){
            fetchETC();
        }
    }, [pathname]);

    return (
        <LinkContext.Provider value={{
            links, setLinks, socialLink, setSocialLink, theme, updateTheme, backgroundImage, setBackgroundImage, profile, setProfile, nickname, isLoading
        }}>
            {children}
        </LinkContext.Provider>
    );
};
