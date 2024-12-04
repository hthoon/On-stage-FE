import React, {useContext, useState} from "react";
import "./Management.css";
import {useLink} from "../../context/LinkContext";
import {PiMusicNotesBold, PiPlusBold, PiSelectionPlusBold} from "react-icons/pi";
import {MdOutlineFolder} from "react-icons/md";
import {useSpotify} from "../../context/SpotifyContext";


const AddLinkPanel = ({updateLink, createLink}) => {
    const {links, setLinks, socialLink} = useLink();
    const [showForm, setShowForm] = useState(false);
    const [newLink, setNewLink] = useState({title: "", blockType: "FOLDER"});
    const [isClosing, setIsClosing] = useState(false);
    const { getTrackInfo } = useSpotify()

    const handleAddLink = async () => {
        if (!newLink.title && newLink.blockType !== "BLANK") {
            alert("Please fill in all fields.");
            return;
        }

        // 음악 블록인 경우 Spotify API 호출
        if (newLink.blockType === "MUSIC") {
            try {
                const trackDetails = await getTrackInfo(newLink.title); // Spotify URL에서 곡 정보 가져오기
                if (trackDetails) {
                    newLink.title = trackDetails.name; // 곡 제목을 title로 설정
                } else {
                    alert("유효하지 않은 Spotify URL입니다.");
                    return;
                }
            } catch (error) {
                alert("Spotify 정보 불러오기에 실패했습니다.");
                console.error(error);
                return;
            }
        }

        // 1. 새 링크 생성 API 호출
        const createdLink = await createLink({
            title: newLink.title,
            username: socialLink.username,
            thumbnail: null,
            prevLinkId: null, // 새 링크는 맨 앞에
            padding: 10,
            layout: "CLASSIC",
            active: true,
            details: [],
            blockType: newLink.blockType
        });
        const {id: newLinkId} = createdLink;
        // 2. 기존 맨 앞 링크의 id 가져오기
        const currentFirstLink = links.find((link) => link.prevLinkId === null);
        if (currentFirstLink) {
            const updatedFirstLink = {...currentFirstLink, prevLinkId: newLinkId};
            await updateLink(updatedFirstLink);
        }
        // 3. 상태 업데이트: 새 링크를 리스트 맨 앞에 추가
        setLinks([createdLink, ...links.map((link) =>
            link.id === currentFirstLink?.id
                ? {...link, prevLinkId: newLinkId}
                : link
        )]);

        // 입력 폼 초기화 및 닫기
        setNewLink({title: "", blockType: "FOLDER"});
        setShowForm(false);
    };

    // 링크 생성 취소 할때 토글 닫음
    const handleCancel = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
        }, 300);
    };

    // 블록 타입 설정
    const handleBlockTypeChange = (blockType) => {
        let placeholderTitle = "";

        // 블록 타입별 기본값 설정
        switch (blockType) {
            case "FOLDER":
                placeholderTitle = "";
                break;
            case "BLANK":
                placeholderTitle = "여백";
                break;
            case "MUSIC":
                placeholderTitle = "";
                break;
            default:
                placeholderTitle = "";
        }

        // 기본값으로 title 업데이트
        setNewLink({
            ...newLink,
            blockType,
            title: placeholderTitle,
        });
    };


    return (
        <>
            <div className="add-link-panel">
                {links.length < 10 && !showForm && ( // 링크 개수가 10개 미만일 때만 "블록 추가" 버튼 표시
                    <button
                        className="management-add-link-button"
                        onClick={() => setShowForm(true)}
                    >
                        <PiPlusBold className="add-link-icon"/> 블록 추가
                    </button>
                )}
                {showForm && (
                    <div className={`add-link-form ${isClosing ? "hide" : ""}`}>
                        <p>블록의 타입을 선택해 주세요</p>
                        <div className="block-type-buttons">
                            <button
                                className={`block-type-button ${newLink.blockType === "FOLDER" ? "active" : ""}`}
                                onClick={() => handleBlockTypeChange("FOLDER")}
                            >
                                <MdOutlineFolder className="block-type-icon" /> 폴더
                            </button>
                            <button
                                className={`block-type-button ${newLink.blockType === "BLANK" ? "active" : ""}`}
                                onClick={() => handleBlockTypeChange("BLANK")}
                            >
                                <PiSelectionPlusBold className="block-type-icon" /> 여백
                            </button>
                            <button
                                className={`block-type-button ${newLink.blockType === "MUSIC" ? "active" : ""}`}
                                onClick={() => handleBlockTypeChange("MUSIC")}
                            >
                                <PiMusicNotesBold className="block-type-icon" /> 음악 (WIP)
                            </button>
                        </div>
                        {newLink.blockType === "FOLDER" && (
                            <input
                                type="text"
                                placeholder="블록 이름을 입력하세요"
                                value={newLink.title}
                                onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                                className="add-link-form-input"
                            />
                        )}
                        {newLink.blockType === "MUSIC" && (
                            <input
                                type="text"
                                placeholder="음악 URL을 입력하세요"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                className="add-link-form-input"
                            />
                        )}
                        <button onClick={handleAddLink} className="form-add-button">
                            추가
                        </button>
                        <button onClick={handleCancel} className="form-cancel-button">
                            취소
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
export default AddLinkPanel;