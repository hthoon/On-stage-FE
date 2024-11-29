import React, { useState, useEffect } from "react";
import { useAxios } from "../../context/AxiosContext";

//userId -> username?
const News = ({ userId }) => {
    const {axiosInstance } = useAxios();
    const [summaries, setSummaries] = useState([]); // 기사 데이터를 저장할 배열
    const [page, setPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(2); // 전체 페이지 수

    //해당 페이지의 뉴스 가져오기 (content -> title, summary)
    const getSummaries = async (currentPage) => {
        console.log(currentPage);
        const response = await axiosInstance.get(`/api/summary/${userId}?page=${currentPage}&size=2`);
        const { content, totalPages } = response.data;
        setSummaries(content); // 기사 데이터 저장
        setTotalPages(totalPages); // 전체 페이지 수 설정
    };

    useEffect(() => {
        getSummaries(page); // 페이지가 변경 시 실행
    }, [userId, page]); // userId 또는 page가 변경 시 실행

    const moveNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1); // 다음 페이지로 이동
    };

    const movePrevPage = () => {
        if (page > 0) setPage(page - 1); // 이전 페이지로 이동
    };

    const NewsList = ({ summaries }) => {
        return (
            <div className="news-list">
                {summaries.map((summary, index) => (
                    <div key={index} className="news-item">
                        <p>{summary.summary}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="news-container">
            <h1>뉴스입니다</h1>
            <NewsList summaries={summaries} />
            <div className="pagination">
                <button onClick={movePrevPage} disabled={page === 0}>전</button>
                <span className="current-page">{page + 1}</span> / {totalPages}
                <button onClick={moveNextPage} disabled={page === totalPages - 1}>다음</button>
            </div>
        </div>
    );
};

export default News;
