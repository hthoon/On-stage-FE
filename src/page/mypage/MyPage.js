import React, {useState, useEffect} from 'react';
import "./MyPage.css";
import SocialPanel from "../LinkManagement/SocialPanel";

function MyPage() {
    return (
        <div className="mypage-wrapper">
            <div className="mypage-right">
                <h1>계정 관리</h1>
                <div className="mypage-divider">
                    <SocialPanel/>
                </div>

                <h1>즐겨찾기</h1>
                <div className="mypage-divider">

                </div>

                <h1>인증 배지 신청</h1>
                <div className="mypage-divider">
                    <form className="badge-application-form">
                        <div>
                            {/*<label htmlFor="name">이름</label>*/}
                            {/*<input type="text" id="name" name="name" placeholder="이름을 입력하세요" required/>*/}

                            {/*<label htmlFor="email">이메일</label>*/}
                            {/*<input type="email" id="email" name="email" placeholder="이메일을 입력하세요" required/>*/}

                            <label htmlFor="tel">휴대폰 번호:</label>
                            <input type="tel" id="tel" name="tel" placeholder="'-' 없이 입력하세요" required/>
                        </div>
                        <div>
                            <label htmlFor="reason">신청 사유</label>
                            <textarea id="reason" name="reason" placeholder="인증 배지를 신청하는 이유를 입력하세요" required></textarea>
                        </div>
                        <div>
                            <button type="submit">신청하기</button>
                        </div>
                    </form>
                </div>


                <h1>요금제 안내</h1>
                <div className="mypage-divider">
                    <div className="pricing-section">
                        <h2>요금제 선택</h2>
                        <ul className="pricing-list">
                            <li>
                                <h3>무료 플랜</h3>
                                <p>기본 기능 제공</p>
                                <h6>월 $0</h6>
                            </li>
                            <li>
                                <h3>프리미엄 플랜</h3>
                                <p>인증 배지 및 추가 기능 제공</p>
                                <h6>월 $9.99</h6>
                            </li>
                            <li>
                                <h3>비즈니스 플랜</h3>
                                <p>팀 기능 및 확장 지원</p>
                                <h6>월 $29.99</h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPage;