import axios from 'axios';

export const fetchAnalyticsData = async (userName, startDate, endDate) => {
  try {
    const response = await axios.get(`/api/analytics/dashboard`, {
      params: {
        userName: userName,
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('데이터를 불러오는 데 실패했습니다: ' + error.message);
  }
};