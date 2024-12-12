import React from 'react';
import './Home.css';
import {useNavigate} from "react-router-dom";
import { PiPowerBold } from "react-icons/pi";
import {BsFillImageFill} from "react-icons/bs";
import {VscGraph} from "react-icons/vsc";
import {GrArticle} from "react-icons/gr";
import {FaMicrophoneLines} from "react-icons/fa6";

const Home = () => {
    const navigate = useNavigate();

    const login = () => {
        navigate("/login")
    }

    return (
        <div className="home-container">
            {/* 네비게이션 바 */}
            <nav className="home-nav">
                <PiPowerBold className="home-on-stage-logo" />

                <ul>
                    <li><a href="/">홈</a></li>
                    <li><a href="/about">소개</a></li>
                    <li><a href="/features">기능</a></li>
                    <li><a href="/contact">문의하기</a></li>
                </ul>
                <div>
                    <button className="home-start-button" onClick={login}>시작하기</button>
                </div>
            </nav>

            {/* 메인 콘텐츠 */}
            <main className="home-main-content">
                <section className="home-feature-area-1">
                    <h2 className="home-feature-title">
                        당신의 모든 것을 하나의 <span className="highlight-gradient">링크</span>에
                    </h2>
                    <p className="home-feature-text">
                        인스타그램, 스포티파이, 유튜브 등을 연결하세요.<br />
                        온스테이지에서는 모든 것이 하나의 링크에 모입니다.
                    </p>
                    <button className="home-start-button" onClick={login}>On-Stage 시작하기</button>
                </section>

                {/* 특징 섹션 */}
                <section className="home-features-scrollable">
                    <div className="home-features-wrapper">
                        <div className="home-feature-card">
                            <BsFillImageFill className="feature-icon"/>
                            <h3>테마</h3>
                            <p>쉽고 빠르게 나만의 링크 페이지를 디자인하세요.</p>
                        </div>
                        <div className="home-feature-card">
                            <VscGraph className="feature-icon"/>
                            <h3>강력한 통계</h3>
                            <p>클릭, 유입 경로 등 다양한 데이터를 제공합니다.</p>
                        </div>
                        <div className="home-feature-card">
                            <FaMicrophoneLines className="feature-icon"/>
                            <h3>공연 정보 제공</h3>
                            <p>당신의 콘서트 정보를 자동으로 추가해줍니다.</p>
                        </div>
                        <div className="home-feature-card">
                            <GrArticle className="feature-icon"/>
                            <h3>기사 정보 제공</h3>
                            <p>당신과 관련한 기사를 방문객이 쉽고 빠르게 접할 수 있습니다.</p>
                        </div>
                        {/* 콘텐츠 반복 */}
                        <div className="home-feature-card">
                            <BsFillImageFill className="feature-icon"/>
                            <h3>테마</h3>
                            <p>쉽고 빠르게 나만의 링크 페이지를 디자인하세요.</p>
                        </div>
                        <div className="home-feature-card">
                            <VscGraph className="feature-icon"/>
                            <h3>강력한 통계</h3>
                            <p>클릭, 유입 경로 등 다양한 데이터를 제공합니다.</p>
                        </div>
                    </div>
                </section>


                {/* 사용자 리뷰 */}
                <section className="home-testimonials">
                    <h2>많은 사용자들의 사랑을 받을 <span className="highlight-gradient">예정</span>입니다</h2>

                    <div className="home-testimonial-container">
                        <div className="testimonial-card">
                            <p>“온스테이지 덕분에 제 브랜드가 훨씬 더 돋보이게 되었습니다.<br/> 정말 간편하고 강력합니다!”</p>
                            <span>- 사용자 A</span>
                        </div>
                        <div className="testimonial-card">
                        <p>“안녕하세요”</p>
                            <span>- 사용자 B</span>
                        </div>

                    </div>
                    <div className="home-testimonial-container">
                        <div className="testimonial-card">
                            <p>“카리나는요?”</p>
                            <span>- 윈터 </span>
                        </div>
                        <div className="testimonial-card">
                            <p>“제발 저를 그만좀 찾아주세요”</p>
                            <span>- 윤하</span>
                        </div>
                    </div>
                </section>

                {/* CTA 배너 */}
                <section className="home-cta">
                    <h2>지금 바로 시작해보세요!</h2>
                    <p>무료로 가입하고 세상과 공유하세요.</p>
                    <button className="home-start-button" onClick={login}>지금 가입하기</button>
                </section>
            </main>

            {/* 푸터 */}
            <footer className="home-footer">
                <p>&copy; 2024 On-Stage. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
