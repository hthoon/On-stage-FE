import React from 'react';
import { Line } from 'react-chartjs-2';
import './css/PageViewChart.css'; // CSS 파일 임포트

const PageViewChart = ({ pageViewStats }) => {
    const chartData = {
        labels: pageViewStats.map(item => item.date), // 날짜
        datasets: [
            {
                label: '페이지 조회수',
                data: pageViewStats.map(item => item.pageViewCount), // 페이지 조회수
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                pointRadius: 4, // 포인트 크기
                pointHoverRadius: 6, // 포인트 호버 크기
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
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw} 조회수`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '조회수',
                    font: {
                        size: 12,
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '날짜',
                    font: {
                        size: 12,
                    }
                }
            }
        }
    };

    return (
        <div className="page-view-chart-container">
            <Line 
                data={chartData} 
                options={chartOptions}
                className="page-view-chart"
            />
        </div>
    );
};

export default PageViewChart;