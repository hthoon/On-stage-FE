import React, { useEffect, useState } from 'react';
import { fetchAnalyticsData } from './AnalyticsApi'; // API 함수 임포트

const AnalyticsData = ({ startDate, endDate }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (startDate && endDate) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchAnalyticsData(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
          setAnalyticsData(data);
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

  // 페이지 조회수, 링크 클릭 수, 클릭률 합산 계산
  const totalPageViewCount = analyticsData.reduce((total, data) => total + data.pageViewCount, 0);
  const totalLinkClickCount = analyticsData.reduce((total, data) => total + data.linkClickCount, 0);
  const totalClickRate =
    totalPageViewCount > 0
      ? ((totalLinkClickCount / totalPageViewCount) * 100).toFixed(2)
      : 0;

  return (
    <div>
      <h2>분석 결과</h2>
      {analyticsData.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>총 페이지 조회수</th>
              <th>총 링크 클릭 수</th>
              <th>총 클릭률 (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{totalPageViewCount}</td>
              <td>{totalLinkClickCount}</td>
              <td>{totalClickRate}%</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnalyticsData;