import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAxios } from "./AxiosContext";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const LinkContext = createContext();
export const useLink = () => {
    return useContext(LinkContext);
};

export const LinkProvider = ({ children }) => {
    const { axiosInstance } = useAxios();
    const location = useLocation();
    const { pathname } = useLocation();
    const username = pathname.split('/')[2];

    const managementWhitelistPaths = ['/management'];  // 관리 페이지 화이트리스트 경로
    const visitWhitelistPaths = ['/page/:username']; // 방문 페이지 화이트리스트 경로

    const [links, setLinks] = useState([]);
    const [socialLink, setSocialLink] = useState({});
    const [theme, setTheme] = useState({});
    const [backgroundImage, setBackgroundImage] = useState("");

    const updateTheme = (newTheme) => {
        setTheme((prevTheme) => ({ ...prevTheme, ...newTheme }));
    };

    useEffect(() => {
        // 관리 페이지 화이트리스트 경로에 해당하는 경우
        if (managementWhitelistPaths.includes(location.pathname)) {
            axiosInstance.get(`/api/link`)
                .then((response) => {
                    setLinks(response.data.link);
                    setSocialLink(response.data.socialLink);
                    setTheme(response.data.theme);
                    Cookies.set("username", response.data.theme.username);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        // 방문 페이지 화이트리스트 경로에서 username이 있을 경우
        if (username &&  visitWhitelistPaths.some(path => pathname.startsWith(path.split(':')[0]))) {
            axiosInstance.get(`/api/link/${username}`)
                .then((response) => {
                    setLinks(response.data.link);
                    setSocialLink(response.data.socialLink);
                    setTheme(response.data.theme);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [axiosInstance, location.pathname]);

    return (
        <LinkContext.Provider value={{
            links, setLinks, socialLink, setSocialLink, theme, updateTheme, backgroundImage, setBackgroundImage
        }}>
            {children}
        </LinkContext.Provider>
    );
};
