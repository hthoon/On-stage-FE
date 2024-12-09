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
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
  
    const handleStartDateChange = (date) => {
      setStartDate(date);
      if (date > endDate) {
        setEndDate(date);
      }
      onDateChange(date, endDate);
    };
  
    const handleEndDateChange = (date) => {
      setEndDate(date);
      onDateChange(startDate, date);
    };

    const handleClearStartDate = () => {
      setStartDate(today);
      onDateChange(today, endDate);
    };

    const handleClearEndDate = () => {
      setEndDate(today);
      onDateChange(startDate, today);
    };

    return (
      <div className="analytics-date-container">
        <div className="date-input-wrapper">
          <label className="date-label">시작 날짜:</label>
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
            />
            <Calendar className="date-icon" />
            <button 
              className="clear-date-btn" 
              onClick={handleClearStartDate}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="date-input-wrapper">
          <label className="date-label">끝 날짜:</label>
          
          <div className="date-input-group">
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={today}
              locale="ko"
              dateFormat="yyyy/MM/dd"
              placeholderText="끝 날짜 선택"
              className="date-input"
              wrapperClassName="date-picker-wrapper"
              calendarClassName="custom-calendar"
            />
            <Calendar className="date-icon" />
            <button 
              className="clear-date-btn" 
              onClick={handleClearEndDate}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
};

export default AnalyticsDate;