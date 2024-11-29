import React, {useState} from "react";
import "./Management.css";
import {useLink} from "../../context/LinkContext";
import {HiPlus} from "react-icons/hi";
import {FiFolderPlus} from "react-icons/fi";
import {TbFolderPlus} from "react-icons/tb";

const AddLinkPanel = ({updateLink, createLink}) => {
    const {links, setLinks} = useLink();
    const [showForm, setShowForm] = useState(false);
    const [newLink, setNewLink] = useState({title: "", url: ""});
    const [isClosing, setIsClosing] = useState(false);

    const handleAddLink = async () => {
        if (!newLink.title) {
            alert("Please fill in all fields.");
            return;
        }
        // 1. 새 링크 생성 API 호출
        const createdLink = await createLink({
            title: newLink.title,
            username: "1",  // TODO 추후 변경
            thumbnail: null,
            prevLinkId: null, // 새 링크는 맨 앞에
            layout: "CLASSIC",
            active: true,
            details: [],
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
        setNewLink({title: "", url: ""});
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


    return (
        <div className="add-link-panel">
            {links.length < 10 && !showForm && ( // 링크 개수가 10개 미만일 때만 "add link" 버튼 표시
                <button
                    className="management-add-link-button"
                    onClick={() => setShowForm(true)}
                >
                    <TbFolderPlus className="add-link-icon"/> 저장소 추가
                </button>
            )}
            {showForm && (
                <div className={`add-link-form ${isClosing ? "hide" : ""}`}>
                    <input
                        type="text"
                        placeholder="저장소 이름을 입력하세요"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        className="add-link-form-input"
                    />
                    <button onClick={handleAddLink} className="form-add-button">
                        추가
                    </button>
                    <button onClick={handleCancel} className="form-cancel-button">
                        취소
                    </button>
                </div>
            )}
        </div>
    )
}
export default AddLinkPanel;