import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale'; 
import { registerLocale } from 'react-datepicker';
import { Calendar, X } from 'lucide-react';
import './css/AnalyticsDate.css';

registerLocale('ko', ko);

const AnalyticsDate = ({ onDateChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  
    const handleStartDateChange = (date) => {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(null);
      }
      onDateChange(date, endDate);
    };
  
    const handleEndDateChange = (date) => {
      setEndDate(date);
      onDateChange(startDate, date);
    };

    const handleClearStartDate = () => {
      setStartDate(null);
      onDateChange(null, endDate);
    };

    const handleClearEndDate = () => {
      setEndDate(null);
      onDateChange(startDate, null);
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
            />
            <Calendar className="date-icon" />
            {startDate && (
              <button 
                className="clear-date-btn" 
                onClick={handleClearStartDate}
              >
                <X size={16} />
              </button>
            )}
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
              locale="ko"
              dateFormat="yyyy/MM/dd"
              placeholderText="끝 날짜 선택"
              className="date-input"
              wrapperClassName="date-picker-wrapper"
              calendarClassName="custom-calendar"
            />
            <Calendar className="date-icon" />
            {endDate && (
              <button 
                className="clear-date-btn" 
                onClick={handleClearEndDate}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default AnalyticsDate;