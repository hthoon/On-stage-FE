import React from 'react';
import { TrendingUp, Link2, Eye } from 'lucide-react';
import './css/AnalyticsData.css';
import {TbTriangleFilled, TbTriangleInvertedFilled} from "react-icons/tb";

const AnalyticsData = ({ analyticsData, prevAnalyticsData }) => {
    // 안전한 데이터 처리
    const currentPageViewStats = analyticsData.pageViewStats || [];

    // 페이지 조회수, 링크 클릭 수, 클릭률 합산 계산
    const totalPageViewCount = currentPageViewStats.reduce((total, data) => total + (data.pageViewCount || 0), 0);
    const totalLinkClickCount = currentPageViewStats.reduce((total, data) => total + (data.linkClickCount || 0), 0);
    const totalClickRate =
        totalPageViewCount > 0
            ? ((totalLinkClickCount / totalPageViewCount) * 100).toFixed(2)
            : 0;

    const prevPageViewStats = prevAnalyticsData.pageViewStats || [];
    const prevTotalPageViewCount = prevPageViewStats.reduce((total, data) => total + (data.pageViewCount || 0), 0);
    const prevTotalLinkClickCount = prevPageViewStats.reduce((total, data) => total + (data.linkClickCount || 0), 0);

    const prevTotalClickRate =
        prevTotalPageViewCount > 0
            ? ((prevTotalLinkClickCount / prevTotalPageViewCount) * 100).toFixed(2)
            : 0;



    const renderGapTrend = (gap) => {
        if (gap > 0)
            return (
                <p className="Analytics-data-up"><TbTriangleFilled />{gap}</p>

            );
        if (gap < 0)
            return (
                <p className="Analytics-data-down"><TbTriangleInvertedFilled />{gap}</p>

            );
        return (
            <p className="Analytics-data-down">-</p>
        );
    };

    const renderGapTrendRate = (gap) => {
        if (gap > 0)
            return (
                <p className="Analytics-data-up"><TbTriangleFilled />{gap.toFixed(2)}</p>

            );
        if (gap < 0)
            return (
                <p className="Analytics-data-down"><TbTriangleInvertedFilled />{gap.toFixed(2)}</p>

            );
        return (
            <p className="Analytics-data-down">-</p>
        );
    };

    return (
        <div className="analytics-data-container">
            {/*<div className="analytics-header-section">*/}
            {/*    <TrendingUp className="header-icon" />*/}
            {/*    <h2>분석 결과</h2>*/}
            {/*</div>*/}

            {totalPageViewCount === 0 && totalLinkClickCount === 0 ? (
                <div className="no-data-message">
                    <p>데이터가 없습니다.</p>
                </div>
            ) : (
                <div className="analytics-statistics-container">
                    <div className="statistic-card total-page-views-card">
                        <div className="statistic-content">
                            <Eye className="statistic-icon"/>
                            <span className="statistic-label">방문</span>
                        </div>
                        <span className="statistic-value">{totalPageViewCount}</span>
                        <div>
                            {renderGapTrend(totalPageViewCount - prevTotalPageViewCount)}
                        </div>

                    </div>

                    <div className="statistic-card total-link-clicks-card">
                        <div className="statistic-content">
                            <Link2 className="statistic-icon"/>
                            <span className="statistic-label">클릭</span>
                        </div>
                        <span className="statistic-value">{totalLinkClickCount}</span>
                        <div>
                            {renderGapTrend(totalLinkClickCount - prevTotalLinkClickCount)}
                        </div>
                    </div>

                    <div className="statistic-card total-click-rate-card">
                        <div className="statistic-content">
                            <TrendingUp className="statistic-icon"/>
                            <span className="statistic-label">클릭 비율</span>
                        </div>
                        <span className="statistic-value">{totalClickRate}%</span>
                        <div>
                            {renderGapTrendRate(totalClickRate - prevTotalClickRate)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsData;