import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; // 한국어 로케일 가져오기
import { registerLocale } from 'react-datepicker';

registerLocale('ko', ko); // 한국어 로케일 등록

const DateRangeSelector = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  
    const handleStartDateChange = (date) => {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(null);
      }
      onDateChange(date, endDate); // 날짜 변경 시 부모에 전달
    };
  
    const handleEndDateChange = (date) => {
      setEndDate(date);
      onDateChange(startDate, date); // 날짜 변경 시 부모에 전달
    };

  return (
    <div>
      <div>
        <label>시작 날짜:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale="ko"
          dateFormat="yyyy/MM/dd"
          placeholderText="시작 날짜 선택"
        />
      </div>
      <div>
        <label>끝 날짜:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale="ko"
          dateFormat="yyyy/MM/dd"
          placeholderText="끝 날짜 선택"
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;