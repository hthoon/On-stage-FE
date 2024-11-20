import React, { useState } from 'react';
import "./Management.css";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { SlPencil } from "react-icons/sl";

const ManagementPanel = () => {
    const [links, setLinks] = useState([
        { id: 1, label: "Last Album", url: "https://instagram.com", active: true, thumbnail: null },
        { id: 2, label: "Blog", url: "https://twitter.com", active: false, thumbnail: null },
        { id: 3, label: "Website", url: "https://twitter.com", active: false, thumbnail: null },
        { id: 4, label: "Website", url: "https://twitter.com", active: false, thumbnail: null },
        { id: 5, label: "Website", url: "https://twitter.com", active: false, thumbnail: null },
        { id: 6, label: "Website", url: "https://twitter.com", active: false, thumbnail: null },
    ]);
    const [editingId, setEditingId] = useState(null);

    const handleEdit = (id, field, value) => {
        setLinks(links.map(link =>
            link.id === id ? { ...link, [field]: value } : link
        ));
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
                                    className="link-title"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setEditingId(`title-${link.id}`)}
                                    onBlur={(e) => {
                                        handleEdit(link.id, "label", e.target.textContent);
                                        setEditingId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.target.blur();
                                        }
                                    }}
                                >
                                    {link.label}
                                    {editingId !== `title-${link.id}` && <SlPencil className="edit-icon" />}
                                </span>

                                {/* URL */}
                                <span
                                    className="link-url"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onFocus={() => setEditingId(`url-${link.id}`)}
                                    onBlur={(e) => {
                                        handleEdit(link.id, "url", e.target.textContent);
                                        setEditingId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.target.blur();
                                        }
                                    }}
                                >
                                    {link.url}
                                    {editingId !== `url-${link.id}` && <SlPencil className="edit-icon" />}
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
