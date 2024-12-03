import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchAnalyticsData } from './api'; // API 함수 임포트

const AnalyticsGraph = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (startDate && endDate) {
        setLoading(true);
        setError(null);
        try {
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          const overviewData = await fetchAnalyticsData(formattedStartDate, formattedEndDate);
          setData(overviewData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    getData();
  }, [startDate, endDate]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  // Chart.js 데이터 포맷팅
  const chartData = {
    labels: data.map(item => item.date.toString()), // 날짜
    datasets: [
      {
        label: '페이지 조회수',
        data: data.map(item => item.pageViewCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: '링크 클릭 수',
        data: data.map(item => item.linkClickCount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>분석 그래프</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default AnalyticsGraph;