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
    const [socialLink, setSocialLink] = useState({});
    const [theme, setTheme] = useState({});
    const [backgroundImage, setBackgroundImage] = useState("");

    const updateTheme = (newTheme) => {
        setTheme((prevTheme) => ({ ...prevTheme, ...newTheme }));
    };


    useEffect(() => {
        if (!whitelistPaths.includes(location.pathname)) {
            return;
        }
        axiosInstance.get(`/api/link`)
            .then((response) => {
                setLinks(response.data.link);
                setSocialLink(response.data.socialLink);
                setTheme(response.data.theme);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [axiosInstance, setLinks]);



    return (
        <LinkContext.Provider value={{ links, setLinks,  socialLink, setSocialLink, theme, updateTheme, backgroundImage, setBackgroundImage }}>
            {children}
        </LinkContext.Provider>
    )
};