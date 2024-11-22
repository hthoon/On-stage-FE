import axios from "axios";
import {createContext, useContext} from "react";

const AxiosContext = createContext();
export const useAxios = () => useContext(AxiosContext);
export const AxiosContextProvider = ({children}) => {


    // Axios 인스턴스 설정
    const axiosInstance = axios.create({
        baseURL: "http://localhost:8080",
        headers: { "Content-Type": "application/json" },
    });

    return (
        <AxiosContext.Provider value={{axiosInstance}}>
            {children}
        </AxiosContext.Provider>
    );
};