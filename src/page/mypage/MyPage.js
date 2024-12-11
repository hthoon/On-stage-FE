import React, {useState, useEffect, useRef} from 'react';
import { useAxios } from "../../context/AxiosContext";
import { ToastContainer, toast } from 'react-toastify';
import "./MyPage.css";
import Tooltip from "../../components/tooltip/Tooltip";
import {useLink} from "../../context/LinkContext";
import {MdVerified} from "react-icons/md";
import {GrEdit} from "react-icons/gr";

// 영광님 코드 참고(SocialPanel)
const EditableField = ({ field, value, onSave, children, isVerified }) => {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState("");

    const validate = (value) => {
        if (value.trim().length < 1) {
            return "한글자 정도는 입력하셔야죠";
        }

        if (value.trim().length > 20) {
            return "너무 길어요";
        }

        return "";
    };

    const handleFocus = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (ref.current) {
                const inputElement = ref.current;
                inputElement.focus();
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
            }
        }, 0);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    };

    const handleBlur = () => {
        setIsEditing(false);

        const validationError = validate(inputValue.trim());
        if (validationError) {
            setError(validationError);
            alert(validationError); // 에러 메시지 알림
        } else {
            setError("");
            onSave(field, inputValue.trim()); // 저장
        }
    };

    const dynamicClass = `${field}-editing`;

    return (
        <div className={`mypage-editable-field ${dynamicClass} ${isEditing ? "editing" : ""}`}>
            {isEditing ? (
                <input
                    ref={ref}
                    value={inputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <span>{children || value}</span>
            )}

            {field === "nickname" && isVerified && !isEditing && <MdVerified  className="profile-verified-icon" />}
            {!isEditing && (
                <Tooltip text={`${field === "nickname" ? "블록 이름" : "설명"} 바꾸기`}>
                    <GrEdit className="edit-icon" onClick={handleFocus} />
                </Tooltip>
            )}
            {error && <div className="error-message">{error}</div>} {/* 오류 메시지 표시 */}
        </div>
    );
}

function MyPage() {
    const { profile, setProfile } = useLink();
    const { axiosInstance } = useAxios();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const modalBackground = useRef();

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^010\d{8}$/;

        if (!phoneRegex.test(phone)) {
            setPhoneError("전화번호 형식이 올바르지 않습니다. 예) 01012345678");
            return false;
        }
        setPhoneError("");
        return true;
    }

    const handlePhoneNumberChange = (e) => {
        const input = e.target.value;
        setPhoneNumber(input);
        validatePhoneNumber(input);
    }

    const requestVerifyCode = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            toast.error("유효한 전화번호 형식이 아닙니다.")
            return;
        }

        try {
            const response = await axiosInstance.post('/api/user/send', {
                phoneNumber,
            });
            if (response.status === 200) {
                toast.success("인증번호가 발송되었습니다.");
                setIsModalOpen(false);
                setIsVerifyModalOpen(true);
            }
        } catch (error) {
            console.error("인증 요청 중 오류가 발생했습니다.");
            toast.error("인증번호 요청에 실패했습니다.");
        }
    }

    const handleVerifyCodeChange = (e) => {
        setVerifyCode(e.target.value);
    };

    const confirmVerifyCode = async () => {
        try {
            const response = await axiosInstance.post('/api/user/verify', {
                phoneNumber,
                verifyCode,
            });
            if (response.status === 200) {
                toast.success("인증이 완료되었습니다.");
                setIsVerifyModalOpen(false); // 인증번호 입력 모달 닫기
            }
        } catch (error) {
            console.error("인증 확인 중 오류가 발생했습니다.");
            toast.error("인증 확인에 실패했습니다.");
        }
    };

    const updateProfileField = async (field, newValue) => {
        try {
            const response = await axiosInstance.patch(`/api/user`, null, {
                params: { field, value: newValue },
            });
            if (response.status === 200) {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    [field]: newValue, // 업데이트된 값을 반영
                }));
            }

        } catch (error) {
            if (error.status !== 304) {
                console.error(error);
                alert(`업데이트 중 오류가 발생했습니다.`);
            }
        }
    };

    return (
        <div className="mypage-wrapper">
            <div className="mypage-right">
                {/*<FaUser className"mypage-icon"/>*/}
                <h1 className="mypage-right-h1">마이페이지</h1>
                    <hr className="mypage-hr"/>
                <h3 className="mypage-index">프로필 정보</h3>
                <div className="mypage-profile-container">
                    <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="mypage-profile-image"
                        onClick={() => setIsImageModalOpen(true)}
                    />
                    <div className="mypage-profile-textbox">
                        <EditableField
                            field="nickname"
                            value={profile.nickname}
                            onSave={updateProfileField}  // updateUserProfile(field, newValue) 형태로 변경 로직 수행
                        >
                            <span className="mypage-profile-nickname">{profile.nickname}</span>
                        </EditableField>

                        <EditableField
                            field="description"
                            value={profile.description}
                            onSave={updateProfileField}
                        >
                            <span className="mypage-profile-description">{profile.description}</span>
                        </EditableField>
                    </div>
                </div>
                <h3 className="mypage-index">인증 정보</h3>
                <div className="mypage-verify-container">
                    {/*Todo 딱지*/}
                    {profile.verified === "VERIFIED" ? (
                        <div className="mypage-profile-textbox">
                            <p>인증된 사용자</p>
                            <p>인증 날짜: {profile.verifiedAt}</p>
                        </div>
                    ) : (
                        <div>
                            <p>아직 인증되지 않았습니다.</p>
                            <button className="mypage-custom-button" onClick={() => setIsModalOpen(true)}>
                                인증하기
                            </button>
                        </div>
                    )}

                    {isModalOpen && (
                        <div
                            className="verify-overlay"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div
                                className="verify-container"
                                onClick={(e) => e.stopPropagation()} // 내부 클릭은 이벤트 중지
                            >
                                <div className="modal-content">
                                    <h3>본인 인증</h3>
                                    <h4>닉네임: {profile.nickname}</h4>
                                    <h4>전화번호</h4>
                                    <div className="verify-form">
                                        <input
                                            type="text"
                                            className="verify-input"
                                            value={phoneNumber}
                                            placeholder="01012345678"
                                            onChange={handlePhoneNumberChange}
                                            required
                                        />
                                        <button
                                            className="verify-button"
                                            onClick={requestVerifyCode}>
                                            인증번호 요청
                                        </button>
                                    </div>
                                    {phoneError && phoneNumber !== '' && (
                                        <p style={{color: 'red', fontSize: '12px'}}>{phoneError}</p>
                                    )}
                                        <button
                                            className="verify-button"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            닫기
                                        </button>

                                </div>
                            </div>
                        </div>
                    )}

                    {isVerifyModalOpen && (
                        <div
                            className="verify-overlay"
                            onClick={() => setIsVerifyModalOpen(false)}
                        >
                            <div
                                className="verify-container"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-content">
                                    <h3>본인 인증</h3>
                                    <h4>인증번호 입력</h4>
                                    <div className="verify-form">
                                    <input
                                        type="text"
                                        className="verify-input"
                                        value={verifyCode}
                                        placeholder="인증번호를 입력하세요."
                                        onChange={handleVerifyCodeChange}
                                        required
                                    />
                                    <button className="verify-button" onClick={confirmVerifyCode}>
                                        인증 확인
                                    </button>
                                    </div>
                                    <button
                                        className="verify-button"
                                        onClick={() => setIsVerifyModalOpen(false)}
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <h3 className="mypage-index">나의 즐겨찾기</h3>
                <p>나를 즐겨찾기 한 사람들: {profile.subscribed}</p>
            </div>
        </div>

    );
}

export default MyPage;
