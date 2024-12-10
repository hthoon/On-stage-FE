import React, { useMemo } from 'react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const LocationChart = ({ locationStats }) => {
    // 데이터 유효성 검사
    const isValidData = locationStats && locationStats.length > 0;

    // 동적 색상 생성
    const dynamicColors = useMemo(() => {
        return locationStats.map((_, index) => 
            `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.6)`
        );
    }, [locationStats]);

    // 메모이제이션을 통한 성능 최적화
    const chartData = useMemo(() => {
        if (!isValidData) return { labels: [], datasets: [] };

        return {
            labels: locationStats.map(item => `${item.country}, ${item.region}`),
            datasets: [
                {
                    label: '국가 및 지역별 페이지 조회수',
                    data: locationStats.map(item => item.pageViewCount),
                    backgroundColor: dynamicColors,
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2,
                }
            ]
        };
    }, [locationStats, dynamicColors]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: { size: 12 },
                    padding: 10,
                    boxWidth: 20,
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed} 조회수`
                }
            }
        },
        // 접근성 개선
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    // 데이터 없을 때 대체 UI
    if (!isValidData) {
        return (
            <div 
                className="no-data-message" 
                aria-label="위치별 조회수 데이터 없음"
            >
                표시할 데이터가 없습니다
            </div>
        );
    }

    return (
        <div 
            className="location-chart-container" 
            role="region" 
            aria-label="국가 및 지역별 페이지 조회수 파이 차트"
        >
            <Pie 
                data={chartData}
                options={chartOptions}
                aria-describedby="location-chart-description"
            />
        </div>
    );
};

LocationChart.propTypes = {
    locationStats: PropTypes.arrayOf(
        PropTypes.shape({
            country: PropTypes.string.isRequired,
            region: PropTypes.string.isRequired,
            pageViewCount: PropTypes.number.isRequired
        })
    ).isRequired
};

export default LocationChart;