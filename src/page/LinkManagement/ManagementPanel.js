import React, {useState} from "react";
import "./Management.css";
import {useLink} from "../../context/LinkContext";
import {LuTrash2} from "react-icons/lu";
import {SlPencil} from "react-icons/sl";
import {sortLinksByPrevId} from "../../utils/sortLinks";
import {MdAddLink} from "react-icons/md";
import {IoImageOutline} from "react-icons/io5";

const ManagementPanel = ({updateLink, deleteLink}) => {
    const {links, setLinks} = useLink();
    const [editingId, setEditingId] = useState(null);
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

    const handleDeleteLink = async (linkToDelete) => {
        // 1. 삭제할 링크가 맨 앞 링크인지 확인
        const isFirstLink = linkToDelete.prevLinkId === null;

        // 2. 맨 앞 링크 삭제 처리
        if (isFirstLink) {
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);

            if (nextLink) {
                // 3. 다음 링크의 prevLinkId를 null로 설정
                const updatedNextLink = {...nextLink, prevLinkId: null};
                await updateLink(updatedNextLink); // 서버에서 업데이트 요청
            }
        } else {
            // 4. 그 외 링크 삭제 처리: 삭제된 링크의 뒤 링크가 앞 링크를 참조하게 함
            const previousLink = links.find((link) => link.id === linkToDelete.prevLinkId);
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);

            if (previousLink && nextLink) {
                // 5. 다음 링크의 prevLinkId를 이전 링크로 설정
                const updatedNextLink = {...nextLink, prevLinkId: previousLink.id};
                await updateLink(updatedNextLink); // 서버에서 업데이트 요청
            }
        }
        // 6. 삭제 요청 API 호출 (실제 삭제)
        await deleteLink(linkToDelete.id);

        // 7. 상태 업데이트: 삭제된 링크를 제외한 새 리스트로 업데이트
        setLinks(links.filter((link) => link.id !== linkToDelete.id));
    };

    const handleToggleLink = async (link) => {
        try {
            link.active = !link.active;
            await updateLink(link);

            setLinks((prevLinks) =>
                prevLinks.map((item) =>
                    item.id === link.id ? {...item, active: link.active} : item
                )
            );
        } catch (error) {
            console.error(error);
            // 상태를 원래대로 되돌리기
            link.active = !link.active;
        }
    }

    return (
        <div className="management-link-container">
            {sortedLinks.map((link) => (
                <div key={link.id} className="link-item">
                    <div className="link-left">
                        <div className="link-divide">
                                <span
                                    className={`link-title ${editingId === link.id ? "editing" : ""}`}
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
                            <div className="link-bottom-icons">
                                <MdAddLink
                                    className="link-add-btn"

                                />

                                <IoImageOutline
                                    className="link-image-btn"
                                />

                            </div>
                        </div>
                    </div>
                    <div className="link-right">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={link.active} // 예시로 `isActive` 속성을 사용
                                onChange={() => handleToggleLink(link)}
                            />
                            <span className="slider"></span>
                        </label>
                        <button
                            onClick={() => handleDeleteLink(link)}
                            className="trash-button"
                        >
                            <LuTrash2/>
                        </button>
                    </div>
                </div>
            ))}
        </div>

    );
};

export default ManagementPanel;
