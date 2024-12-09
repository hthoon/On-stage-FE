import React from 'react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './css/LocationChart.css'; // CSS 파일 임포트

// Chart.js 컴포넌트 등록
ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend
);

const LocationChart = ({ locationStats }) => {
    const chartData = {
        labels: locationStats.map(item => `${item.country}, ${item.region}`), // 국가 및 지역
        datasets: [
            {
                label: '국가 및 지역별 페이지 조회수',
                data: locationStats.map(item => item.pageViewCount), // 조회수
                backgroundColor: [
                    'rgba(255,99,132,0.6)',
                    'rgba(54,162,235,0.6)',
                    'rgba(255,206,86,0.6)',
                ],
                borderColor: 'rgba(255, 255, 255, 1)', // 차트의 경계 색상
                borderWidth: 2, // 경계 두께
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                    padding: 20,
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw} 조회수`;
                    }
                }
            }
        }
    };

    return (
        <div className="location-chart-container">
            <Pie 
                data={chartData}
                options={chartOptions}
                className="location-chart"
            />
        </div>
    );
};

export default LocationChart;