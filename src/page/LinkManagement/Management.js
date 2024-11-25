import React from 'react';
import LinkDisplay from "../../components/LinkDisplay/LinkDisplay";
import "./Management.css";
import ManagementPanel from "./ManagementPanel";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";
import AddLinkPanel from "./AddLinkPanel";
import SocialPanel from "./SocialPanel";
import ThemeSwitcher from "./ThemeSwitcher";

const Management = () => {
    const {axiosInstance} = useAxios();
    const { setLinks } = useLink();

    const updateLink = async (updatedLink) => {
        console.log(updatedLink);
        const response = await axiosInstance.put(`/api/link`,updatedLink);
        const updatedData = response.data;
        setLinks(prevLinks =>
            prevLinks.map(link =>
                // 최신 데이터로 갱신
                link.id === updatedData.id ? updatedData : link
            )
        );
    };

    const createLink = async (link) => {
        const response = await axiosInstance.post(`/api/link`,link);
        return response.data;
    }

    const deleteLink = async (id) => {
        await axiosInstance.delete(`/api/link/${id}`);
    }

    return (
        <div className="management-container">
            <div className="management-panel">
                <SocialPanel />
                <ThemeSwitcher/>
                {/* 링크 Create 패널 */}
                <AddLinkPanel
                    updateLink={updateLink}
                    createLink={createLink}
                />
                {/* 메인 링크 관리 패널*/}
                <ManagementPanel
                    updateLink={updateLink}
                    deleteLink={deleteLink}
                />
            </div>

                {/* 디스플레이 패널 */}
                <div className="display-panel">
                    <LinkDisplay/>
                </div>
            </div>
            )

            };
            export default Management;

