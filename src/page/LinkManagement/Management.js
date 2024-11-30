import React, {useState} from 'react';
import LinkDisplay from "../../components/LinkDisplay/LinkDisplay";
import "./Management.css";
import "./Tutorial.css";
import ManagementPanel from "./ManagementPanel";
import {useAxios} from "../../context/AxiosContext";
import {useLink} from "../../context/LinkContext";
import AddLinkPanel from "./AddLinkPanel";
import SocialPanel from "./SocialPanel";
import ThemeSwitcher from "./ThemeSwitcher";
import {FaChevronUp} from "react-icons/fa";
import Joyride from 'react-joyride';
import ProgressBar from "../../components/tutorial/ProgressBar";
import {BiSolidFlagCheckered} from "react-icons/bi";
import {HiChevronLeft} from "react-icons/hi";
import {IoMdClose} from "react-icons/io";

const Management = () => {
    const {axiosInstance} = useAxios();
    const { setLinks } = useLink();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
    const [runTutorial, setRunTutorial] = useState(false);
    const [progress, setProgress] = useState(0); // 진행도 상태 추가


    const updateLink = async (updatedLink) => {
        console.log(updatedLink);
        const response = await axiosInstance.put(`/api/link`,updatedLink);
        const updatedData = response.data;
        setLinks(prevLinks =>
            prevLinks.map(link =>
                // 최신 데이터로 갱신
                link.id === updatedData.id ? updatedData : link
            )
        );
    };

    const createLink = async (link) => {
        const response = await axiosInstance.post(`/api/link`,link);
        return response.data;
    }

    const deleteLink = async (id) => {
        await axiosInstance.delete(`/api/link/${id}`);
    }

    const startTutorial = () => {
        setRunTutorial(true);
        //setIsModalOpen(false); // 모달 닫기
    };
    // Joyride steps 설정

    const onClose = () => {
        setIsModalOpen(false);
    }

    const steps = [
        { target: '.social-panel-name', content: '활동명을 바꿀 수 있어요.' },
        { target: '.social-panel-description', content: '상태를 바꿀 수 있어요.' },
        { target: '.social-icon-add-btn', content: '소셜링크를 추가할 수 있어요.' },
        { target: '.management-add-link-button', content: '링크를 추가할 수 있어요.' },
        { target: '.drag-handle', content: '링크를 드래그해 순서를 변경하세요.' },
        { target: '.link-add-btn', content: '새 링크를 열고 닫을 수 있습니다.' },
        { target: '.detail-trash-button', content: '링크를 삭제합니다.' },
        { target: '.toggle-switch', content: '링크를 활성화하거나 비활성화합니다.' },
    ];

    const handleJoyrideCallback = (data) => {
        const { status, index, lifecycle } = data;
        const totalSteps = steps.length;

        if (status === 'finished' || status === 'skipped') {
            setProgress(100); // 튜토리얼 완료 시 진행률 100%
            setRunTutorial(false); // 튜토리얼 종료
        } else if (lifecycle === 'tooltip') {
            // 진행률 계산
            const newProgress = ((index + 1) / totalSteps) * 100;
            setProgress(newProgress);
        }
    };


    return (
        <div className="management-container">
            <Joyride
                steps={steps}
                run={runTutorial} // 튜토리얼 실행 여부
                continuous={true}
                showSkipButton={true}
                callback={handleJoyrideCallback} // 진행상태 업데이트 콜백 추가
                styles={{
                    options: {
                        arrowColor: '#ffffff', // 화살표 색상
                        backgroundColor: '#ffffff', // 툴팁 배경색
                        overlayColor: 'rgba(0, 0, 0, 0.5)', // 오버레이 색상
                        primaryColor: '#6e79ff', // 기본 버튼 색상
                        nextColor: '#6e79ff',
                        textColor: '#000000', // 툴팁 텍스트 색상
                        zIndex: 1000, // z-index 설정
                    },
                    buttonClose: {
                        color: '#000000', // 닫기 버튼 색상
                    },
                    buttonNext: {
                        backgroundColor: '#6e79ff', // 다음 버튼 배경색
                        color: '#ffffff', // 다음 버튼 텍스트 색상
                    }
                }}
            />


            <div className="management-panel">
                <SocialPanel
                    runTutorial={runTutorial}  // Joyride 실행 여부 전달
                    steps={steps}  // steps 전달
                />
                <ThemeSwitcher/>
                {/* 링크 Create 패널 */}
                <AddLinkPanel
                    updateLink={updateLink}
                    createLink={createLink}
                    runTutorial={runTutorial}  // Joyride 실행 여부 전달
                    steps={steps}  // steps 전달
                />
                {/* 메인 링크 관리 패널*/}
                <ManagementPanel
                    updateLink={updateLink}
                    deleteLink={deleteLink}
                />
            </div>

            {/* 디스플레이 패널 */}
            <div className="display-panel">
                <LinkDisplay/>
            </div>


            {/* 튜토리얼 버튼 (우측 하단 고정) */}
            <div className="tutorial-button" onClick={() => setIsModalOpen(true)}>
                <BiSolidFlagCheckered  />
                <p className="tutorial-button-quest">튜토리얼</p>
            </div>

            {/* 팝업 버튼 */}
            <button
                className="popup-toggle-button"
                onClick={() => setIsPopupOpen(true)}
            >
                <FaChevronUp/>
            </button>

            {/* 팝업 컴포넌트 */}
            {isPopupOpen && (
                <div className="popup-overlay" onClick={() => setIsPopupOpen(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <LinkDisplay/>
                    </div>
                </div>
            )}

            {/* 튜토리얼 관리 모달 */}
            {isModalOpen && (
                <div className="tutorial-modal">
                    <div className="tutorial-modal-content">
                        <div className="detail-modal-close-btn-container">
                            <HiChevronLeft className="modal-close-btn" onClick={onClose}/>
                            <h2 className="detail-modal-title">튜토리얼</h2>
                            <IoMdClose className="modal-close-btn" onClick={onClose}/>
                        </div>
                        <ProgressBar progress={progress}/>
                        <button onClick={startTutorial} className="start-tutorial-btn">
                            튜토리얼 시작
                        </button>
                    </div>
                </div>
            )}

        </div>

    );

};
export default Management;

