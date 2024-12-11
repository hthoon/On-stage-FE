// 공통된 API 호출 로직

export const updateProfileField = async (field, newValue, setProfile, axiosInstance) => {
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