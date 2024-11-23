import React from "react";
import "./Management.css";

const DetailManagement = ({ link }) => {
    // link.details가 없으면 빈 배열로 처리
    const details = link.details || [];



    return (
        <div className="link-details">
            <p className="link-details-message-title">Link</p>
            <p className="link-details-message">방문자에게 다양한 서비스 링크를 제공해보세요!</p>
            {details.length === 0 ? (
                <p>No details available for this link.</p>
            ) : (
                details.map((detail, index) => (
                    <div key={index}
                         className="link-details-list"
                    >
                        <p>{detail.url}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default DetailManagement;
