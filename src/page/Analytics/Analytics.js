import React, {useEffect, useState} from 'react';
import AnalyticsDate from '../../components/Analytics/AnalyticsDate'; // 날짜 선택 컴포넌트 임포트
import AnalyticsData from '../../components/Analytics/AnalyticsData'; // 데이터 표시 컴포넌트 임포트
import AnalyticsGraph from '../../components/Analytics/AnalyticsGraph';
import { useLink } from '../../context/LinkContext';
import './Analytics.css';
import {PuffLoader} from "react-spinners";
import {useLocation} from "react-router-dom";
import {useAxios} from "../../context/AxiosContext";
import {fetchAnalyticsData} from "../../components/Analytics/AnalyticsApi";


const Analytics = () => {
    const { profile } = useLink();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [prevAnalyticsData, setPrevAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [date, setDate] = useState({
        startDate: null,
        endDate: null,
    });
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const location = useLocation();
    const userName = profile.username;
    const { axiosInstance } = useAxios();


    const handleDateChange = async (startDate, endDate, now) => {
        setDate({ startDate, endDate });

        if (userName && startDate && endDate) {
            setLoading(true);
            setError(null);
            setAnalyticsData(null);
            try {
                const formattedStartDate = new Date(
                    Date.UTC(
                        startDate.getFullYear(),
                        startDate.getMonth(),
                        startDate.getDate()
                    )
                )
                    .toISOString()
                    .split('T')[0];

                const formattedEndDate = new Date(
                    Date.UTC(
                        endDate.getFullYear(),
                        endDate.getMonth(),
                        endDate.getDate()
                    )
                )
                    .toISOString()
                    .split('T')[0];

                if (now) {
                    const data = await fetchAnalyticsData(axiosInstance, userName, formattedStartDate, formattedEndDate);

                    setAnalyticsData(data);
                    if(selectedButton === 4 ){
                        setPrevAnalyticsData(data);
                    }
                    console.log(analyticsData);
                    console.log(prevAnalyticsData);
                }
                else{
                    const data = await fetchAnalyticsData(axiosInstance, userName, formattedStartDate, formattedEndDate);
                    setPrevAnalyticsData(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleQuickDateSelect = (days, buttonIndex) => {
        setShowCustomDate(false);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        setSelectedButton(buttonIndex);
        handleDateChange(startDate, endDate, true);

        const prevStartDate = new Date();
        const prevEndDate = new Date();
        prevStartDate.setDate(startDate.getDate() - days);
        prevEndDate.setDate(endDate.getDate() - days);
        handleDateChange(prevStartDate, prevEndDate, false);

    };

    const handleShowCustomDate = () => {
        setSelectedButton(4);
        setShowCustomDate(!showCustomDate);
    }

    // 최초 입장 시 첫 번째 버튼 자동 선택
    useEffect(() => {
        if (userName) {
            handleQuickDateSelect(1, 0);
        }
    }, [userName]);

    const containerClass = location.pathname === '/management' ? 'management-analytics-container' : 'analytics-container';

    return (
        <div className={containerClass}>
            {location.pathname !== '/management' && (
                <div className="analytics-header">
                    <h1>분석</h1>
                </div>
            )}
            <div className="analytics-date-button-container">
                <button className={selectedButton === 0 ? 'selected' : ''}
                        onClick={() => handleQuickDateSelect(1, 0)}>24시간
                </button>
                <button className={selectedButton === 1 ? 'selected' : ''}
                        onClick={() => handleQuickDateSelect(7, 1)}>7일
                </button>
                <button className={selectedButton === 2 ? 'selected' : ''}
                        onClick={() => handleQuickDateSelect(28, 2)}>28일
                </button>
                <button className={selectedButton === 3 ? 'selected' : ''}
                        onClick={() => handleQuickDateSelect(365, 3)}>1년
                </button>
                <button className={selectedButton === 4 ? 'selected' : ''} onClick={() => handleShowCustomDate()}>기간
                    설정
                </button>
            </div>
            {showCustomDate && (
                <div className="analytics-date-container">
                    <h2>범위 선택</h2>
                    <AnalyticsDate onDateChange={handleDateChange}/>
                </div>
            )}
            {loading &&
                <div className="login-loading-container">
                    <PuffLoader color="#8089ff" size={100}/>
                </div>
            }
            {error && <p className="error">{error}</p>}
            {analyticsData && (
                <>
                    <AnalyticsData analyticsData={analyticsData} prevAnalyticsData={prevAnalyticsData} selectedButton={selectedButton}/>
                    <AnalyticsGraph analyticsData={analyticsData}/>
                </>
            )}
        </div>
    );
};

export default Analytics;
