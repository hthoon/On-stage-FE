import React from 'react';
import { Bar } from 'react-chartjs-2';
import './css/SocialLinkClickChart.css'; // CSS 파일 임포트

const SocialLinkClickChart = ({ socialLinkClickStats }) => {
    const chartData = {
        labels: socialLinkClickStats.map(item => item.socialLinkType), // 소셜 링크 타입
        datasets: [
            {
                label: '소셜 링크 클릭수',
                data: socialLinkClickStats.map(item => item.clickCount), // 클릭수
                backgroundColor: [
                    'rgba(255,99,132,0.6)',
                    'rgba(54,162,235,0.6)',
                    'rgba(255,206,86,0.6)',
                ],
                borderColor: 'rgba(255, 255, 255, 1)', // 차트 경계 색상
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
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw} 클릭수`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '클릭수',
                    font: {
                        size: 12,
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '소셜 링크 타입',
                    font: {
                        size: 12,
                    }
                }
            }
        }
    };

    return (
        <div className="social-link-click-chart-container">
            <Bar 
                data={chartData} 
                options={chartOptions} 
                className="social-link-click-chart" // 차트에 클래스 추가
            />
        </div>
    );
};

export default SocialLinkClickChart;