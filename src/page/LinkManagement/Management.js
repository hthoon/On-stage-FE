import React from 'react';
import {useLink} from "../../context/LinkContext";
import LinkDisplay from "../../components/LinkDisplay/LinkDisplay";
import "./Management.css"; // 스타일 파일 추가

const Management = () => {
    //const { link, linkDetail, socialLink, theme } = useLink();


    return (
        <div className="management-container">
            {/* 링크 관리 패널 */}
            <div className="management-panel">
                <button>새 링크 추가</button>
                <button>링크 정렬</button>
                <button>설정</button>
            </div>


            {/* 디스플레이 패널 */}
            <div className="display-panel">
            <LinkDisplay/>
            </div>
        </div>
    )

};
export default Management;

