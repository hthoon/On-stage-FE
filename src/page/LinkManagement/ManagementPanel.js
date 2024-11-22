import React, { useState } from "react";
import "./Management.css";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { SlPencil } from "react-icons/sl";
import { useLink } from "../../context/LinkContext";
import {sortLinksByPrevId} from "../../utils/sortLinks";

const ManagementPanel = ({ updateLink }) => {
    const { links, setLinks } = useLink();
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newLink, setNewLink] = useState({ title: "", url: "" });
    const [isClosing, setIsClosing] = useState(false);
    const sortedLinks = sortLinksByPrevId(links);

    const handleEdit = async (id, field, value) => {
        const updatedLinks = links.map((link) =>
            link.id === id ? { ...link, [field]: value } : link
        );

        setLinks(updatedLinks);

        const updatedLink = updatedLinks.find((link) => link.id === id);
        if (updatedLink) {
            await updateLink(updatedLink);
        }

        setEditingId(null);
    };

    const handleAddLink = () => {
        if (!newLink.title || !newLink.url) {
            alert("Please fill in all fields.");
            return;
        }

        const newLinkData = {
            id: Date.now(),
            title: newLink.title,
            url: newLink.url,
        };

        setLinks([...links, newLinkData]);
        setNewLink({ title: "", url: "" });
        setShowForm(false);
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
                    <IoMdAdd /> add link
                </button>
            ) : (
                <div className={`add-link-form ${isClosing ? "hide" : ""}`}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newLink.title}
                        onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        className="form-input"
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newLink.url}
                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
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
                                onClick={() => setLinks(links.filter((l) => l.id !== link.id))}
                                className="trash-button"
                            >
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
