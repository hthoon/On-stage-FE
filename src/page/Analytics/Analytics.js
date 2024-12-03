import React, { useState } from 'react';
import DateRangeSelector from './Components/AnalyticsDate'; // 날짜 선택 컴포넌트 임포트
import AnalyticsData from './Components/AnalyticsData'; // 데이터 표시 컴포넌트 임포트
import AnalyticsGraph from './Components/AnalyticsGraph';

const Analytics = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div>
      <h1>분석 대시보드</h1>
      <h2>날짜 범위 선택</h2>
      <DateRangeSelector onDateChange={handleDateChange} />
      <AnalyticsData startDate={startDate} endDate={endDate} />
      <AnalyticsGraph startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default Analytics;