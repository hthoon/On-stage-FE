import React, {useState} from "react";
import "./Management.css";
import {useLink} from "../../context/LinkContext";
import {LuLink, LuTrash2} from "react-icons/lu";
import {SlPencil} from "react-icons/sl";
import {sortLinksByPrevId} from "../../utils/sortLinks";
import {IoImageOutline} from "react-icons/io5";
import DetailManagement from "./DetailManagement";

const ManagementPanel = ({updateLink, deleteLink}) => {
    const {links, setLinks} = useLink();
    const [editingId, setEditingId] = useState(null);
    const [expandedLinkId, setExpandedLinkId] = useState(null);
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
        const isFirstLink = linkToDelete.prevLinkId === null;
        if (isFirstLink) {
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);
            if (nextLink) {
                const updatedNextLink = {...nextLink, prevLinkId: null};
                await updateLink(updatedNextLink);
            }
        } else {
            const previousLink = links.find((link) => link.id === linkToDelete.prevLinkId);
            const nextLink = links.find((link) => link.prevLinkId === linkToDelete.id);
            if (previousLink && nextLink) {
                const updatedNextLink = {...nextLink, prevLinkId: previousLink.id};
                await updateLink(updatedNextLink);
            }
        }
        await deleteLink(linkToDelete.id);
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
            link.active = !link.active;
        }
    };

    const handleToggleExpand = (id) => {
        setExpandedLinkId((prevId) => (prevId === id ? null : id));
    };

    return (
        <div className="management-link-container">
            {sortedLinks.map((link) => (
                <div
                    key={link.id}
                    className={`link-item ${expandedLinkId === link.id ? "expanded" : ""}`}
                >
                    <div className="link-header">
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

                                    <LuLink
                                        className="link-add-btn"
                                        onClick={() => handleToggleExpand(link.id)}
                                    />
                                    <IoImageOutline
                                        className="link-add-btn"
                                        onClick={() => handleToggleExpand(link.id)}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="link-right">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={link.active}
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

                    {expandedLinkId === link.id && (
                        <DetailManagement
                            link={link}
                        />
                    )}
                </div>
            ))}
        </div>
    );

};

export default ManagementPanel;
