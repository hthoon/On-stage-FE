import React, { useEffect, useState } from 'react';
import AnalyticsDate from '../../components/Analytics/AnalyticsDate'; // 날짜 선택 컴포넌트 임포트
import AnalyticsData from '../../components/Analytics/AnalyticsData'; // 데이터 표시 컴포넌트 임포트
import AnalyticsGraph from '../../components/Analytics/AnalyticsGraph';
import Cookies from 'js-cookie';
import { fetchAnalyticsData } from '../../components/Analytics/AnalyticsApi';
import './Analytics.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState({
      startDate: null,
      endDate: null
  });
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const userNameFromCookie = Cookies.get('username');
    setUserName(userNameFromCookie);
  }, []);

  const handleDateChange = async ( startDate, endDate) => {
    setDate({ startDate, endDate });
    if (userName && startDate && endDate) {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAnalyticsData(userName, date.startDate.toISOString().split('T')[0], date.endDate.toISOString().split('T')[0]);
            setAnalyticsData(data); // 가져온 데이터 설정
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
};

    return (
        <div className="analytics-container"> {/* 전체 컨테이너에 클래스 추가 */}
            <div className="analytics-header"> {/* 헤더에 클래스 추가 */}
                <h1>분석 대시보드</h1>
                <h2>확인할 날짜를 선택해주세요</h2>
            </div>
            <div className="analytics-date-container">
                <AnalyticsDate onDateChange={handleDateChange} />
            </div>
            {loading && <p className="loading">로딩 중...</p>} {/* 로딩 메시지에 클래스 추가 */}
            {error && <p className="error">{error}</p>} {/* 에러 메시지에 클래스 추가 */}
            {analyticsData && (
            <>
                <AnalyticsData analyticsData={analyticsData} />
                <AnalyticsGraph analyticsData={analyticsData} />
            </>
            )}
        </div>
    );
};

export default Analytics;