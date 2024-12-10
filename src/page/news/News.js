import React, { useState, useEffect } from "react";
import { useAxios } from "../../context/AxiosContext";
import { useUser} from "../../context/UserContext";
import {PuffLoader} from "react-spinners";
import "./News.css";

const News = () => {
    const { axiosInstance } = useAxios();
    const { user } = useUser();
    const [summaries, setSummaries] = useState([]); // 기사 데이터 저장
    const [page, setPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(2); // 전체 페이지 수
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    // 사용자 유저네임을 가져오는 함수
    useEffect(() => {
        if (user) {
            getSummaries(page); // 유저 정보가 있을 때만 getSummaries 호출
        }
    }, [user, page]); // user와 page가 변경될 때마다 호출

    // 해당 페이지의 뉴스 가져오기
    const getSummaries = async (currentPage) => {
        if (!user?.username) return;
        try {
            const response = await axiosInstance.get(`/api/summary/${user.username}?page=${currentPage}&size=2`);
            const { content, totalPages } = response.data;
            setSummaries(content); // content -> {title, summary}
            setTotalPages(totalPages);
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const moveNextPage = () => {
        if (page < totalPages - 1) setPage(page + 1); // 다음 페이지로 이동
    };

    const movePrevPage = () => {
        if (page > 0) setPage(page - 1); // 이전 페이지로 이동
    };

    const NewsList = ({ summaries }) => (
        <div className="news-list">
            {summaries.length === 0 ? (
                <p className="no-results">검색 결과가 없습니다.</p>
            ) : (
                summaries.map((summary, index) => (
                    <div key={index} className="news-item">
                        <p className="news-page-title">{summary.title}</p>
                        <p className="news-page-summary">{summary.summary}</p>
                    </div>
                    ))
                )}
        </div>
    );

    return (
        <div className="news-container">
            {isLoading ? (
                <div className="loading-container">
                    <PuffLoader color="#8089ff" size={80} />
                    <p>아티스트 소식을 불러오는 중입니다 기다려주세요...</p>
                </div>
            ) : (
                <>
                    <h1>{"최신 소식"}</h1>
                    <NewsList summaries={summaries}/>
                    <div className="news-pagination">
                        <button className="news-page-move-btn" onClick={movePrevPage} disabled={page === 0}>
                            전
                        </button>
                        <span className="current-page">{page + 1}</span> / {totalPages}
                        <button className="news-page-move-btn" onClick={moveNextPage}
                                disabled={page === totalPages - 1}>
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default News;

