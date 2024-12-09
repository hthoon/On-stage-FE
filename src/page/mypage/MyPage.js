import React, { useState, useEffect } from 'react';
import { useAxios } from "../../context/AxiosContext";
import { ToastContainer, toast } from 'react-toastify';
import "./MyPage.css";

function MyPage() {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const { axiosInstance } = useAxios(); // Axios 인스턴스 가져오기


    // 사용자 프로필 데이터를 가져오는 함수
    const getProfileData = async () => {
        try {
            const response = await axiosInstance.get('/api/user'); // API 호출
            setUser(response.data); // 상태 업데이트
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
    };

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

    // 컴포넌트가 처음 렌더링될 때 데이터를 가져옵니다.
    useEffect(() => {
        getProfileData();
    }, []);

    if (!user) {
        // 데이터가 로드되기 전 로딩 메시지 표시
        return <div>Loading...</div>;
    }

    return (

        <div className="mypage-container">

            <h1>MyPage</h1>
            <div style={{marginBottom: '20px'}}>
                <img
                    src={user.profileImage ? `${process.env.REACT_APP_SERVER_HOST}${user.profileImage}` : '/default-profile.png'}
                    alt="Profile"
                    style={{width: '100px', height: '100px', borderRadius: '50%'}}
                />
            </div>

            <div>
                <input
                    type="text"
                    value={user.nickname}
                    className="mypage-input"
                />
                <button>중복 확인</button>
                <br/>
                <button>닉네임 변경</button>
            </div>

            <div>
                <input
                    type="text"
                    value={user.description}
                    className="mypage-input"
                />
                <button onClick={updateUserProfile}>변경하기</button>
            </div>



        </div>

        // <div style={{ padding: '20px' }}>
        //     <h1>My Page</h1>
        //     <div style={{ marginBottom: '20px' }}>
        //         <img
        //             src={user.picture || '/default-profile.png'}
        //             alt="Profile"
        //             style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        //         />
        //     </div>
        //     <div>
        //         <p><strong>Nickname:</strong> {user.nickname}</p>
        //         <button onClick={() => handleEdit('nickname')}>닉네임 변경</button>
        //     </div>
        //
        //     <div>
        //         <p><strong>Description:</strong> {user.description}</p>
        //         <button onClick={() => handleEdit('description')}>소개글 변경</button>
        //     </div>
        // </div>
    );
}

export default MyPage;
