import React, {useState} from "react";
import "./Management.css";
import {IoMdAdd, IoMdTrash} from "react-icons/io";
import {SlPencil} from "react-icons/sl";
import {useLink} from "../../context/LinkContext";
import {sortLinksByPrevId} from "../../utils/sortLinks";

const ManagementPanel = ({ updateLink, createLink, deleteLink }) => {
    const {links, setLinks} = useLink();
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newLink, setNewLink] = useState({title: "", url: ""});
    const [isClosing, setIsClosing] = useState(false);
    const sortedLinks = sortLinksByPrevId(links);

    const handleEdit = async (id, field, value) => {
        const updatedLinks = links.map((link) =>
            link.id === id ? {...link, [field]: value} : link
        );
        setLinks(updatedLinks);
        const updatedLink = updatedLinks.find((link) => link.id === id);
        if (updatedLink) {
            await updateLink(updatedLink);
        }
        setEditingId(null);
    };

    const handleAddLink = async () => {
        if (!newLink.title || !newLink.url) {
            alert("Please fill in all fields.");
            return;
        }
        // 1. 새 링크 생성 API 호출
        const createdLink = await createLink({
            title: newLink.title,
            userId: 1,  // TODO 추후 변경
            thumbnail: null,
            prevLinkId: null, // 새 링크는 맨 앞에
            layout: "CLASSIC",
            active: true,
            details: [{
                url: newLink.url,
                platform: "INSTAGRAM",
            }],});
        const { id: newLinkId } = createdLink;
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

    const handleDeleteLink = async (linkToDelete) => {
        // 1. 삭제할 링크가 맨 앞 링크인지 확인
        const isFirstLink = linkToDelete.prevLinkId === null;

        // 2. 맨 앞 링크 삭제 처리
        if (isFirstLink) {
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);

            if (nextLink) {
                // 3. 다음 링크의 prevLinkId를 null로 설정
                const updatedNextLink = { ...nextLink, prevLinkId: null };
                await updateLink(updatedNextLink); // 서버에서 업데이트 요청
            }
        } else {
            // 4. 그 외 링크 삭제 처리: 삭제된 링크의 뒤 링크가 앞 링크를 참조하게 함
            const previousLink = links.find((link) => link.id === linkToDelete.prevLinkId);
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);

            if (previousLink && nextLink) {
                // 5. 다음 링크의 prevLinkId를 이전 링크로 설정
                const updatedNextLink = { ...nextLink, prevLinkId: previousLink.id };
                await updateLink(updatedNextLink); // 서버에서 업데이트 요청
            }
        }

        // 6. 삭제 요청 API 호출 (실제 삭제)
        await deleteLink(linkToDelete.id);

        // 7. 상태 업데이트: 삭제된 링크를 제외한 새 리스트로 업데이트
        setLinks(links.filter((link) => link.id !== linkToDelete.id));
    };



    const handleCancel = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowForm(false);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className="management-panel">
            {!showForm ? (
                <button
                    className="management-add-link-button"
                    onClick={() => setShowForm(true)}
                >
                    <IoMdAdd/> add link
                </button>
            ) : (
                <div className={`add-link-form ${isClosing ? "hide" : ""}`}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        className="form-input"
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        className="form-input"
                    />
                    <button onClick={handleAddLink} className="form-add-button">
                        Add
                    </button>
                    <button onClick={handleCancel} className="form-cancel-button">
                        Cancel
                    </button>
                </div>
            )}

            <div className="management-link-container">
                {sortedLinks.map((link) => (
                    <div key={link.id} className="link-item">
                        <div className="link-left">
                            <div className="link-divide">
                                <span
                                    className={`link-title ${
                                        editingId === link.id ? "editing" : ""
                                    }`}
                                    contentEditable={editingId === link.id}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        handleEdit(link.id, "title", e.target.textContent);
                                        setEditingId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.target.blur();
                                        }
                                    }}
                                >
                                    {link.title}
                                    {editingId !== link.id && (
                                        <SlPencil
                                            className="edit-icon"
                                            onClick={() => setEditingId(link.id)}
                                        />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="link-right">
                            <button
                                onClick={() => handleDeleteLink(link)}
                                className="trash-button"
                            >
                                <IoMdTrash/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagementPanel;
