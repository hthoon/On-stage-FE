import React, { useState, useEffect } from 'react';
import { useAxios } from "../../context/AxiosContext";
import { ToastContainer, toast } from 'react-toastify';
import "./MyPage.css";
import {useLink} from "../../context/LinkContext";

function MyPage() {
    const { profile } = useLink();
    const { axiosInstance } = useAxios();

    const updateUserProfile = async (field, value) => {
        try {
            const response = await axiosInstance.patch(`/api/user?field=${field}`, {
                [field]: value
            });

            if (response.status === 200 && {field} === 'nickname') {
                toast.success('닉네임이 변경되었습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else if (response.status === 304) {
                toast.success('변경 사항이 없습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.error('업데이트 중 오류가 발생했습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    console.log(profile);

    return (
        <div className="mypage-wrapper">
            {/*<div className"mypage-left">*/}
            {/*    /!*<img className"mypage-image-placeholder" src={login} alt="login"/>*!/*/}

            {/*</div>*/}
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
                        />
                        <div className="mypage-profile-textbox">
                            <p className="mypage-profile-nickname">{profile.nickname}</p>
                            <p className="mypage-profile-description">{profile.description}</p>
                        </div>
                    </div>
                <h3 className="mypage-index">인증 정보</h3>
                <div className="mypage-verification-container">
                    {/*Todo 딱지*/}
                    {profile.verified === "VERIFIED" ? (
                        <div className="mypage-profile-textbox">
                            <p>인증된 사용자</p>
                            <p>인증 날짜: {profile.verifiedAt || "정보 없음"}</p>
                        </div>
                    ) : (
                        <p>아직 인증되지 않았습니다.</p>
                    )}
                </div>
                <button
                    className="mypage-custom-button">
                </button>
                {/*<div className"mypage-forgot-button-container">*/}
                {/*    <button className"mypage-forgot-btn">*/}
                {/*        계정을 잃어버리셨나요?*/}
                {/*    </button>*/}
                {/*</div>*/}

            </div>
        </div>

    );
}

export default MyPage;
