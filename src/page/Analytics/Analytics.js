import React, { useEffect, useState } from 'react';
import DateRangeSelector from '../../components/Analytics/AnalyticsDate'; // 날짜 선택 컴포넌트 임포트
import AnalyticsData from '../../components/Analytics/AnalyticsData'; // 데이터 표시 컴포넌트 임포트
import AnalyticsGraph from '../../components/Analytics/AnalyticsGraph';
import Cookies from 'js-cookie';
import { fetchAnalyticsData } from '../../components/Analytics/AnalyticsApi';

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

  const handleDateChange = async ( userName, startDate, endDate) => {
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
    <div>
        <>
          <h1>{userName}님의 분석 대시보드</h1>
                    <h2>날짜 범위 선택</h2>
                    <DateRangeSelector onDateChange={handleDateChange} />
                    {loading && <p>로딩 중...</p>}
                    {error && <p>{error}</p>}
                    {analyticsData && (
                        <>
                            <AnalyticsData 
                                analyticsData={analyticsData} // 모든 데이터를 전달
                            />
                            <AnalyticsGraph 
                                analyticsData={analyticsData} // 모든 데이터를 전달
                            />
                        </>
                    )}
                </>
        </div>
  );
};

export default Analytics;