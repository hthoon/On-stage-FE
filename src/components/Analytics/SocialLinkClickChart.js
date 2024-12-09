import React from 'react';
import { Bar } from 'react-chartjs-2';

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
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default SocialLinkClickChart;