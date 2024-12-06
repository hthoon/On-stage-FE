import React from 'react';
import { Line } from 'react-chartjs-2';

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
            }
        ]
    };

    return <Line data={chartData} />;
};

export default PageViewChart;