import React, {createContext, useContext, useState, useEffect} from "react";
import { useAxios } from "./AxiosContext";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
    const { axiosInstance } = useAxios();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try{
                const response = await axiosInstance.get("/api/user");
                setUser(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getUser();
    }, [axiosInstance]);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
};