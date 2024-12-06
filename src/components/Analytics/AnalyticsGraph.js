import React, { useState } from 'react';
import PageViewChart from './PageViewChart';
import LinkClickChart from './LinkClickChart';
import SocialLinkClickChart from './SocialLinkClickChart';
import LocationChart from './LocationChart';

const AnalyticsGraph = ({ analyticsData }) => {
    const { pageViewStats, linkClickStats, socialLinkClickStats, locationStats } = analyticsData;

    // 그래프 선택 상태 관리
    const [selectedGraph, setSelectedGraph] = useState('pageViews'); // 기본적으로 페이지 조회수 그래프 선택

    // 그래프 선택 버튼 클릭 시 호출되는 함수
    const handleGraphChange = (graph) => {
        setSelectedGraph(graph);
    };

    return (
        <div>
            <h2>분석 차트</h2>
            <nav>
                <button onClick={() => handleGraphChange('pageViews')}>페이지 조회수</button>
                <button onClick={() => handleGraphChange('linkClicks')}>링크 클릭수</button>
                <button onClick={() => handleGraphChange('socialLinkClicks')}>소셜 링크 클릭수</button>
                <button onClick={() => handleGraphChange('locations')}>국가 및 지역별 페이지 조회수</button>
            </nav>

            {/* 조건부 렌더링 */}
            {selectedGraph === 'pageViews' && (
                <div>
                    <h3>날짜별 페이지 조회수 및 링크 클릭수</h3>
                    <PageViewChart pageViewStats={pageViewStats} />
                </div>
            )}
            {selectedGraph === 'linkClicks' && (
                <div>
                    <h3>링크 클릭수</h3>
                    <LinkClickChart linkClickStats={linkClickStats} />
                </div>
            )}
            {selectedGraph === 'socialLinkClicks' && (
                <div>
                    <h3>소셜 링크 클릭수</h3>
                    <SocialLinkClickChart socialLinkClickStats={socialLinkClickStats} />
                </div>
            )}
            {selectedGraph === 'locations' && (
                <div>
                    <h3>국가 및 지역별 페이지 조회수</h3>
                    <LocationChart locationStats={locationStats} />
                </div>
            )}
        </div>
    );
};

export default AnalyticsGraph;