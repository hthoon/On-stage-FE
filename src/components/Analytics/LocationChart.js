import React from 'react';
import { Pie } from 'react-chartjs-2';

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
            }
        ]
    };

    return <Pie data={chartData} />;
};

export default LocationChart;