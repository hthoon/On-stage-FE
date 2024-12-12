import React, {useState, useEffect} from 'react';
import "./MyPage.css";
import SocialPanel from "../LinkManagement/SocialPanel";
import {IoSettingsSharp} from "react-icons/io5";
import {FaStar} from "react-icons/fa";
import {MdVerified} from "react-icons/md";
import {AiFillDollarCircle} from "react-icons/ai";
import {GoPeople} from "react-icons/go";
import {PiDotOutlineFill} from "react-icons/pi";
import {useLink} from "../../context/LinkContext";

function MyPage() {

    const {following, follower} = useLink();

    return (
        <div className="mypage-wrapper">
            <div className="mypage-right">
                <h1><IoSettingsSharp className="mypage-text-icon" /> 계정 관리</h1>
                <div className="mypage-divider">
                    <SocialPanel/>
                </div>

                <h1><FaStar className="mypage-text-icon" /> 팔로우</h1>
                <div className="mypage-divider">
                    <div className="mypage-follower-section">
                        <GoPeople style={{fontSize: "1.2rem" , marginRight: "10px", fontWeight: "bold"}}/>
                        <p className="mypage-follow-number"> {follower.length} </p>
                        <p className="mypage-follow-text">followers</p>
                        <PiDotOutlineFill/>
                        <p className="mypage-follow-number"> {following.length} </p>
                        <p className="mypage-follow-text">following</p>
                    </div>


                </div>

                <h1><MdVerified className="mypage-text-icon"/> 인증 배지 신청</h1>
                <div className="mypage-divider">
                <form className="badge-application-form">
                        <div>
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


                <h1><AiFillDollarCircle className="mypage-text-icon" />요금제 안내</h1>
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