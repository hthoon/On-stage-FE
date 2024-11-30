import React from 'react';
import './ProgressBar.css'; // 스타일 파일 (다음에 보여드릴 스타일을 별도 파일로 적용)

const ProgressBar = ({ progress }) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{width: `${progress}%`}}>
            </div>
            <span className="progress-text">{`${Math.floor(progress)}%`}</span>
        </div>
    );
};

export default ProgressBar;
