import React, { useState } from 'react';
import { 
  BarChart2, 
  Link2, 
  Share2, 
  Globe 
} from 'lucide-react';
import PageViewChart from './PageViewChart';
import LinkClickChart from './LinkClickChart';
import SocialLinkClickChart from './SocialLinkClickChart';
import LocationChart from './LocationChart';
import './css/AnalyticsGraph.css';

const AnalyticsGraph = ({ analyticsData }) => {
    const { 
        pageViewStats, 
        linkClickStats, 
        socialLinkClickStats, 
        locationStats 
    } = analyticsData;

    // 그래프 선택 상태 관리
    const [selectedGraph, setSelectedGraph] = useState('pageViews');

    // 그래프 선택 버튼 클릭 시 호출되는 함수
    const handleGraphChange = (graph) => {
        setSelectedGraph(graph);
    };

    // 그래프 선택 옵션들
    const graphOptions = [
        { 
            key: 'pageViews', 
            label: '페이지 조회수', 
            icon: <BarChart2 />
        },
        { 
            key: 'linkClicks', 
            label: '링크 클릭수', 
            icon: <Link2 />
        },
        { 
            key: 'socialLinkClicks', 
            label: '소셜 링크 클릭수', 
            icon: <Share2 />
        },
        { 
            key: 'locations', 
            label: '국가 및 지역별 조회수', 
            icon: <Globe />
        }
    ];

    return (
        <div className="analytics-graph-container">
            <div className="analytics-graph-header">
                <h2>분석 차트</h2>
            </div>

            <nav className="graph-nav">
                {graphOptions.map((option) => (
                    <button 
                        key={option.key}
                        onClick={() => handleGraphChange(option.key)}
                        className={`graph-nav-btn ${selectedGraph === option.key ? 'active' : ''}`}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </button>
                ))}
            </nav>

            <div className="graph-content">
                {selectedGraph === 'pageViews' && (
                    <div className="graph-section">
                        <h3>날짜별 페이지 조회수 및 링크 클릭수</h3>
                        <PageViewChart pageViewStats={pageViewStats} />
                    </div>
                )}
                {selectedGraph === 'linkClicks' && (
                    <div className="graph-section">
                        <h3>링크 클릭수</h3>
                        <LinkClickChart linkClickStats={linkClickStats} />
                    </div>
                )}
                {selectedGraph === 'socialLinkClicks' && (
                    <div className="graph-section">
                        <h3>소셜 링크 클릭수</h3>
                        <SocialLinkClickChart socialLinkClickStats={socialLinkClickStats} />
                    </div>
                )}
                {selectedGraph === 'locations' && (
                    <div className="graph-section">
                        <h3>국가 및 지역별 페이지 조회수</h3>
                        <LocationChart locationStats={locationStats} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsGraph;