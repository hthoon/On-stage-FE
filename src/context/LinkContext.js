import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAxios} from "./AxiosContext";
import { useLocation } from 'react-router-dom';



const LinkContext = createContext();
export const useLink = () => {
    return useContext(LinkContext);
};

export const LinkProvider = ({children}) => {
    const {axiosInstance} = useAxios();
    const whitelistPaths = ['/test', '/management'];
    const location = useLocation();

    const [links, setLinks] = useState([]);
    const [socialLink, setSocialLink] = useState();
    const [theme, setTheme] = useState();


    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }
        const userId = 1; // 수정 해야함
        axiosInstance.get(`/api/link/${userId}`, {id: userId})
            .then((response) => {
                console.log(response);
                setLinks(response.data.link);
                setSocialLink(response.data.socialLink);
                setTheme(response.data.theme);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [axiosInstance, setLinks]);



    return (
        <LinkContext.Provider value={{ links, setLinks,  socialLink, theme }}>
            {children}
        </LinkContext.Provider>
    )
};