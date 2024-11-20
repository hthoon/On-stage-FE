import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAxios} from "./AxiosContext";


const LinkContext = createContext();
export const useLink = () => {
    return useContext(LinkContext);
};

export const LinkProvider = ({children}) => {
    const {axiosInstance} = useAxios();
    const [link, setLink] = useState();
    const [linkDetail, setLinkDetail] = useState([]);
    const [socialLink, setSocialLink] = useState();
    const [theme, setTheme] = useState();


    useEffect(() => {
        const userId = localStorage.getItem("userId"); // 수정 해야함
        axiosInstance.get(`/api/link/${userId}`)
            .then((response) => {
                setLink(response.data.link);
                setLinkDetail(response.data.details);
                setSocialLink(response.data.socialLink);
                setTheme(response.data.theme);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [axiosInstance]);

    return (
        <LinkContext.Provider value={{ link, linkDetail, socialLink, theme }}>
            {children}
        </LinkContext.Provider>
    )
};