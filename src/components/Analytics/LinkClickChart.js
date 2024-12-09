import React from 'react';
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
import './css/LinkClickChart.css';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LinkClickChart = ({ linkClickStats }) => {
    // 차트 옵션 설정
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: 'Arial',
                        size: 14
                    }
                }
            },
            title: {
                display: true,
                text: '링크별 클릭 현황',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '클릭 수',
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: '링크',
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    // 데이터 준비
    const chartData = {
        labels: linkClickStats.map(item => item.linkTitle), 
        datasets: [
            {
                label: '링크 클릭수',
                data: linkClickStats.map(item => item.clickCount),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',   // 청록
                    'rgba(153, 102, 255, 0.6)',  // 보라
                    'rgba(255, 159, 64, 0.6)',   // 주황
                    'rgba(54, 162, 235, 0.6)',   // 파랑
                    'rgba(255, 99, 132, 0.6)'    // 분홍
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1,
                borderRadius: 5,
            }
        ]
    };

    return (
        <div className="link-click-chart-container">
            <Bar 
                data={chartData} 
                options={chartOptions} 
                className="link-click-chart"
            />
        </div>
    );
};

export default LinkClickChart;