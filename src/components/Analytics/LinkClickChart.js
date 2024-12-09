import React from 'react';
import { Bar } from 'react-chartjs-2';

const LinkClickChart = ({ linkClickStats }) => {
    const chartData = {
        labels: linkClickStats.map(item => item.linkTitle), // 링크 제목
        datasets: [
            {
                label: '링크 클릭수',
                data: linkClickStats.map(item => item.clickCount), // 클릭수
                backgroundColor: 'rgba(153,102,255,0.6)',
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default LinkClickChart;