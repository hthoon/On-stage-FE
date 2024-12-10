import React, { useMemo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LinkClickChart = ({ linkClickStats }) => {
    // 데이터 유효성 검사
    const isValidData = linkClickStats && linkClickStats.length > 0;

    // 동적 색상 생성
    const dynamicColors = useMemo(() => {
        return linkClickStats.map(() => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return {
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
                borderColor: `rgba(${r}, ${g}, ${b}, 1)`
            };
        });
    }, [linkClickStats]);

    // 메모이제이션을 통한 성능 최적화
    const chartData = useMemo(() => {
        if (!isValidData) return { labels: [], datasets: [] };

        return {
            labels: linkClickStats.map(item => item.linkTitle),
            datasets: [
                {
                    label: '링크 클릭수',
                    data: linkClickStats.map(item => item.clickCount),
                    backgroundColor: dynamicColors.map(color => color.backgroundColor),
                    borderColor: dynamicColors.map(color => color.borderColor),
                    borderWidth: 1,
                    borderRadius: 5,
                }
            ]
        };
    }, [linkClickStats, dynamicColors]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Arial',
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: '링크별 클릭 현황',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} 클릭`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '클릭 수',
                    font: { size: 12 }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '링크',
                    font: { size: 12 }
                }
            }
        },
        // 접근성 및 애니메이션 개선
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
                aria-label="링크 클릭 데이터 없음"
            >
                표시할 데이터가 없습니다
            </div>
        );
    }

    return (
        <div 
            className="link-click-chart-container" 
            role="region" 
            aria-label="링크별 클릭 수 막대 차트"
        >
            <Bar 
                data={chartData} 
                options={chartOptions} 
                aria-describedby="link-click-chart-description"
            />
        </div>
    );
};

LinkClickChart.propTypes = {
    linkClickStats: PropTypes.arrayOf(
        PropTypes.shape({
            linkTitle: PropTypes.string.isRequired,
            clickCount: PropTypes.number.isRequired
        })
    ).isRequired
};

export default LinkClickChart;