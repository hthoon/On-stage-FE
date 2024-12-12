import React, { useState, useEffect } from "react";
import { useAxios } from "../../context/AxiosContext";
import {PuffLoader} from "react-spinners";
import "./News.css";

const News = () => {
    const { axiosInstance } = useAxios();
    const [username, setUsername] = useState(""); // 사용자 유저네임
    const [summaries, setSummaries] = useState([]); // 기사 데이터 저장
    const [pageInfo, setPageInfo ] = useState({
        page: 0,
        totalPages: 2
    })
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    // 사용자 유저네임을 가져오는 함수
    const getUsername = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get("/api/user");
            setUsername(response.data.username);
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
        }
    };

    // 해당 페이지의 뉴스 가져오기
    const getSummaries = async (currentPage) => {
        if (!username) return; // username이 없으면 요청하지 않음
        try {
            const response = await axiosInstance.get(`/api/summary/${username}?page=${currentPage}&size=2`);
            const { content, totalPages } = response.data;
            setSummaries(content); // content -> {title, summary}
            setPageInfo((prevState) => ({
                ...prevState,
                totalPages: totalPages, // 전체 페이지 수 업데이트
            }));
        } catch (error) {
            console.error("오류가 발생했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 데이터를 가져옴
    useEffect(() => {
        getUsername();
    }, []);

    useEffect(() => {
        if (username) getSummaries(pageInfo.page);
    }, [username, pageInfo.page]); // username 또는 page가 변경 시 실행

    const moveNextPage = () => {
        if (pageInfo.page < pageInfo.totalPages - 1){
            setPageInfo((prevState) => ({
                ...prevState,
                page: prevState.page + 1, // 다음 페이지로 이동
            }));
        }
    };

    const movePrevPage = () => {
        if (pageInfo.page > 0) {
            setPageInfo((prevState) => ({
                ...prevState,
                page: prevState.page - 1, // 이전 페이지로 이동
            }));
        }
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
                        <button className="news-page-move-btn" onClick={movePrevPage} disabled={pageInfo.page === 0}>
                            전
                        </button>
                        <span className="current-page">{pageInfo.page + 1}</span> / {pageInfo.totalPages}
                        <button className="news-page-move-btn" onClick={moveNextPage}
                                disabled={pageInfo.page === pageInfo.totalPages - 1}>
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default News;

