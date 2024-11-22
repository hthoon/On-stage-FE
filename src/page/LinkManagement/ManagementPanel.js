import React, { useState } from 'react';
import "./Management.css";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { SlPencil } from "react-icons/sl";
import {useLink} from "../../context/LinkContext";

const ManagementPanel = ({ updateLink }) => {
    const { links, setLinks, linkDetails, socialLink, theme } = useLink();
    const [editingId, setEditingId] = useState(null);

    const handleEdit = async (id, field, value) => {
        // 먼저 로컬 상태에서 링크를 업데이트
        const updatedLinks = links.map(link =>
            link.id === id ? { ...link, [field]: value } : link
        );

        setLinks(updatedLinks);

        // 서버에 링크 업데이트 요청
        const updatedLink = updatedLinks.find(link => link.id === id);
        if (updatedLink) {
            await updateLink(updatedLink);
        }

        // 편집 모드 종료
        setEditingId(null);
    };


    return (
        <div className="management-panel">
            <button className="management-add-link-button"><IoMdAdd /> add link</button>

            <div className="management-link-container">
                {links.map(link => (
                    <div key={link.id} className="link-item">
                        <div className="link-left">
                            <div className="link-divide">
                                {/* 링크 제목 */}
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

                            </div>
                        </div>

                        <div className="link-right">
                            <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="trash-button">
                                <IoMdTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagementPanel;
