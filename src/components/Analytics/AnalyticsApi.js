export const fetchAnalyticsData = async (axiosInstance, userName, startDate, endDate) => {
  try {
    const response = await axiosInstance.get(`/api/analytics/dashboard`, {
      params: { userName, startDate, endDate },
    });
    return response.data;
  } catch (error) {
    throw new Error('데이터를 불러오는 데 실패했습니다: ' + error.message);
  }
};
