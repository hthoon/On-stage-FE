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

const SocialLinkClickChart = ({ socialLinkClickStats }) => {
    // 데이터 유효성 검사
    const isValidData = socialLinkClickStats && socialLinkClickStats.length > 0;

    // 동적 색상 생성
    const dynamicColors = useMemo(() => {
        return socialLinkClickStats.map(() => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return {
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
                borderColor: `rgba(${r}, ${g}, ${b}, 1)`
            };
        });
    }, [socialLinkClickStats]);

    // 메모이제이션을 통한 성능 최적화
    const chartData = useMemo(() => {
        if (!isValidData) return { labels: [], datasets: [] };

        return {
            labels: socialLinkClickStats.map(item => item.socialLinkType),
            datasets: [
                {
                    label: '소셜 링크 클릭수',
                    data: socialLinkClickStats.map(item => item.clickCount),
                    backgroundColor: dynamicColors.map(color => color.backgroundColor),
                    borderColor: dynamicColors.map(color => color.borderColor),
                    borderWidth: 2,
                }
            ]
        };
    }, [socialLinkClickStats, dynamicColors]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} 클릭수`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '클릭수',
                    font: { size: 12 }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '소셜 링크 타입',
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
                aria-label="소셜 링크 클릭 데이터 없음"
            >
                표시할 데이터가 없습니다
            </div>
        );
    }

    return (
        <div 
            className="social-link-click-chart-container" 
            role="region" 
            aria-label="소셜 링크 클릭 수 막대 차트"
        >
            <Bar 
                data={chartData} 
                options={chartOptions} 
                aria-describedby="social-link-click-chart-description"
            />
        </div>
    );
};

SocialLinkClickChart.propTypes = {
    socialLinkClickStats: PropTypes.arrayOf(
        PropTypes.shape({
            socialLinkType: PropTypes.string.isRequired,
            clickCount: PropTypes.number.isRequired
        })
    ).isRequired
};

export default SocialLinkClickChart;