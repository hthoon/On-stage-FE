import React from 'react';
import { TrendingUp, Link2, Eye } from 'lucide-react';
import './css/AnalyticsData.css';

const AnalyticsData = ({ analyticsData = {} }) => {
    // 안전한 데이터 처리
    const pageViewStats = analyticsData.pageViewStats || [];

    // 페이지 조회수, 링크 클릭 수, 클릭률 합산 계산
    const totalPageViewCount = pageViewStats.reduce((total, data) => total + (data.pageViewCount || 0), 0);
    const totalLinkClickCount = pageViewStats.reduce((total, data) => total + (data.linkClickCount || 0), 0);
    const totalClickRate =
        totalPageViewCount > 0
            ? ((totalLinkClickCount / totalPageViewCount) * 100).toFixed(2)
            : 0;

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <TrendingUp className="header-icon" />
                <h2>분석 결과</h2>
            </div>

            {totalPageViewCount === 0 && totalLinkClickCount === 0 ? (
                <div className="no-data">
                    <p>데이터가 없습니다.</p>
                </div>
            ) : (
                <div className="analytics-stats">
                    <div className="stat-card page-views">
                        <div className="stat-content">
                            <Eye className="stat-icon" />
                            <span className="stat-label">총 페이지 조회수</span>
                        </div>
                        <span className="stat-value">{totalPageViewCount}</span>
                    </div>

                    <div className="stat-card link-clicks">
                        <div className="stat-content">
                            <Link2 className="stat-icon" />
                            <span className="stat-label">총 링크 클릭 수</span>
                        </div>
                        <span className="stat-value">{totalLinkClickCount}</span>
                    </div>

                    <div className="stat-card click-rate">
                        <div className="stat-content">
                            <TrendingUp className="stat-icon" />
                            <span className="stat-label">총 클릭률</span>
                        </div>
                        <span className="stat-value">{totalClickRate}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsData;