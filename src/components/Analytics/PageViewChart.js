import React, { useMemo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

// Chart.js 플러그인 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PageViewChart = ({ pageViewStats }) => {
  // 데이터 유효성 검사
  const isValidData = pageViewStats && pageViewStats.length > 0;

  // 메모이제이션을 통한 성능 최적화
  const chartData = useMemo(() => {
    if (!isValidData) return { labels: [], datasets: [] };

    return {
      labels: pageViewStats.map(item => item.date),
      datasets: [
        {
          label: '페이지 조회수',
          data: pageViewStats.map(item => item.pageViewCount),
          borderColor: 'rgb(176,183,255)',
          backgroundColor: 'rgba(163,164,255,0.15)',
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [pageViewStats, isValidData]);

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
          label: (context) => `${context.label}: ${context.parsed.y} 조회수`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '조회수',
          font: { size: 14 }
        }
      },
      x: {
        title: {
          display: true,
          text: '날짜',
          font: { size: 14 }
        }
      }
    },
    // 접근성 속성 추가
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart) => {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            return originalLabels.map(label => ({
              ...label,
              // text: `페이지 조회수: ${label.text}`
            }));
          }
        }
      }
    }
  };

  // 데이터 없을 때 대체 UI
  if (!isValidData) {
    return (
      <div 
        className="no-data-message" 
        aria-label="페이지 조회수 데이터 없음"
      >
        표시할 데이터가 없습니다
      </div>
    );
  }

  return (
    <div 
      className="page-view-chart-container" 
      role="region" 
      aria-label="페이지 조회수 차트"
    >
      <Line 
        data={chartData} 
        options={chartOptions}
        aria-describedby="page-view-chart-description"
      />
    </div>
  );
};

PageViewChart.propTypes = {
  pageViewStats: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      pageViewCount: PropTypes.number.isRequired
    })
  ).isRequired
};

export default PageViewChart;