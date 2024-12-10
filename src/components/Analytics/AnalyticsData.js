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
        <div className="analytics-data-container">
            <div className="analytics-header-section">
                <TrendingUp className="header-icon" />
                <h2>분석 결과</h2>
            </div>

            {totalPageViewCount === 0 && totalLinkClickCount === 0 ? (
                <div className="no-data-message">
                    <p>데이터가 없습니다.</p>
                </div>
            ) : (
                <div className="analytics-statistics-container">
                    <div className="statistic-card total-page-views-card">
                        <div className="statistic-content">
                            <Eye className="statistic-icon" />
                            <span className="statistic-label">총 페이지 조회수</span>
                        </div>
                        <span className="statistic-value">{totalPageViewCount}</span>
                    </div>

                    <div className="statistic-card total-link-clicks-card">
                        <div className="statistic-content">
                            <Link2 className="statistic-icon" />
                            <span className="statistic-label">총 링크 클릭 수</span>
                        </div>
                        <span className="statistic-value">{totalLinkClickCount}</span>
                    </div>

                    <div className="statistic-card total-click-rate-card">
                        <div className="statistic-content">
                            <TrendingUp className="statistic-icon" />
                            <span className="statistic-label">총 클릭률</span>
                        </div>
                        <span className="statistic-value">{totalClickRate}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsData;