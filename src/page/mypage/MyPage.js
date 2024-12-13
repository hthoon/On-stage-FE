import React, {useState, useEffect} from 'react';
import "./MyPage.css";
import SocialPanel from "../LinkManagement/SocialPanel";
import {IoSettingsSharp} from "react-icons/io5";
import {MdVerified} from "react-icons/md";
import {AiFillDollarCircle} from "react-icons/ai";
import {useAxios} from "../../context/AxiosContext";
function MyPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verifyCode, setVerifyCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const { axiosInstance } = useAxios();

    const sendCode = async(e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/api/user/send`, {
                phoneNumber,
            });
            if (response.status === 200) {
                setIsCodeSent(true);
                alert('인증번호가 발송되었습니다!');
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        }
    }

    const checkCode = async(e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`/api/user/verify`, {
                phoneNumber,
                verificationCode,
            });
            if (response.status === 200) {
                setVerifyCode(true);
                alert('인증이 완료되었습니다!');
                window.location.reload();
            }
        } catch (err) {
            console.error("저장 중 오류 발생:", err);
        }
    }

    return (
        <div className="mypage-wrapper">
            <div className="mypage-right">
                <h1><IoSettingsSharp className="mypage-text-icon" /> 계정 관리</h1>
                <div className="mypage-divider">
                    <SocialPanel/>
                </div>

                <h1><MdVerified className="mypage-text-icon"/> 인증 배지 신청</h1>
                <div className="mypage-divider">
                <form className="badge-application-form">
                        <div>
                            <label htmlFor="tel">휴대폰 번호:</label>
                            <input
                                type="tel"
                                id="tel"
                                name="tel"
                                placeholder="'-' 없이 입력하세요"
                                required
                                value={phoneNumber} // 입력 필드의 값
                                onChange={(e) => setPhoneNumber(e.target.value)} // 상태 업데이트
                            />
                        </div>
                    <div>
                        <button onClick={sendCode}>신청하기</button>
                    </div>
                </form>
                </div>

                {isCodeSent && (
                    <div className="mypage-divider">
                        <h2>인증번호 입력</h2>
                        <form className="badge-application-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log("인증번호:", verificationCode);
                            }}
                        >
                            <div>
                                <label htmlFor="verification-code">인증번호:</label>
                                <input
                                    type="text"
                                    id="verification-code"
                                    name="verification-code"
                                    placeholder="인증번호를 입력하세요"
                                    required
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <button onClick={checkCode}>인증 확인</button>
                            </div>
                        </form>
                    </div>
                )}


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