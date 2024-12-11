import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; 
import { registerLocale } from 'react-datepicker';
import { Calendar, X } from 'lucide-react';
import './css/AnalyticsDate.css';

registerLocale('ko', ko);

const AnalyticsDate = ({ onDateChange }) => {
    const today = useMemo(() => new Date(), []);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
      setStartDate(date);
      if (endDate && date > endDate) {
          setEndDate(null);
      }
      // null 체크 후 onDateChange 호출
      if (date || endDate) {
          onDateChange(date, endDate);
      }
  };
  
  const handleEndDateChange = (date) => {
      setEndDate(date);
      // null 체크 후 onDateChange 호출
      if (startDate || date) {
          onDateChange(startDate, date);
      }
  };
  
  const handleClearStartDate = () => {
      setStartDate(null);
      onDateChange(null, endDate); // null을 명시적으로 전달
  };
  
  const handleClearEndDate = () => {
      setEndDate(null);
      onDateChange(startDate, null); // null을 명시적으로 전달
  };

    return (
      <div>
          <div className="date-input-wrapper">
              {/*<label className="date-label">시작 날짜:</label>*/}
              <div className="date-input-group">
                  <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      locale="ko"
                      dateFormat="yyyy/MM/dd"
                      placeholderText="시작 날짜 선택"
                      className="date-input"
                      wrapperClassName="date-picker-wrapper"
                      calendarClassName="custom-calendar"
                      maxDate={today}
                   showMonthYearDropdown/>
                  <Calendar className="date-icon"/>
              </div>

              <div className="date-input-group">
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
                      className="date-input"
                      wrapperClassName="date-picker-wrapper"
                      calendarClassName="custom-calendar"
                      maxDate={today}
                   showMonthYearDropdown/>
                  <Calendar className="date-icon"/>
              </div>
          </div>
          <button className="data-input-reset-button">초기화</button>

      </div>
    );
};

export default AnalyticsDate;