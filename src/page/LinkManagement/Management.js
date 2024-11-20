import React, {useState} from 'react';
import LinkDisplay from "../../components/LinkDisplay/LinkDisplay";
import "./Management.css";
import ManagementPannel from "./ManagementPannel";

const Management = () => {


    return (
        <div className="management-container">
            <ManagementPannel/>

            {/* 디스플레이 패널 */}
            <div className="display-panel">
                <LinkDisplay/>
            </div>
        </div>
    )

};
export default Management;

