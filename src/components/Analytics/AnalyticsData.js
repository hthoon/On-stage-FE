import React from 'react';

const AnalyticsData = ({ analyticsData }) => {
    // 페이지 조회수, 링크 클릭 수, 클릭률 합산 계산
    const totalPageViewCount = analyticsData.pageViewStats.reduce((total, data) => total + data.pageViewCount, 0);
    const totalLinkClickCount = analyticsData.pageViewStats.reduce((total, data) => total + data.linkClickCount, 0);
    const totalClickRate =
        totalPageViewCount > 0
            ? ((totalLinkClickCount / totalPageViewCount) * 100).toFixed(2)
            : 0;

    return (
        <div>
            <h2>분석 결과</h2>
            {totalPageViewCount === 0 && totalLinkClickCount === 0 ? (
                <p>데이터가 없습니다.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>총 페이지 조회수</th>
                            <th>총 링크 클릭 수</th>
                            <th>총 클릭률 (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{totalPageViewCount}</td>
                            <td>{totalLinkClickCount}</td>
                            <td>{totalClickRate}%</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AnalyticsData;