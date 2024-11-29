import React, {useRef, useState} from "react";
import "./Management.css";
import {useLink} from "../../context/LinkContext";
import {LuLink, LuTrash2} from "react-icons/lu";
import {sortLinksByPrevId} from "../../utils/sortLinks";
import {IoImageOutline} from "react-icons/io5";
import DetailManagement from "./DetailManagement";
import {FiEdit3} from "react-icons/fi";
import {AiOutlineFrown} from "react-icons/ai";
import {MdOutlineEdit} from "react-icons/md";
import {GrEdit} from "react-icons/gr";

const ManagementPanel = ({updateLink, deleteLink}) => {
    const {links, setLinks} = useLink();
    const [editingId, setEditingId] = useState(null);
    const [expandedLinkId, setExpandedLinkId] = useState(null);
    const sortedLinks = sortLinksByPrevId(links);
    const titleRefs = useRef({});

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

    const handleFocus = (id) => {
        setEditingId(id); // Enable editing mode
        setTimeout(() => {
            if (titleRefs.current[id]) {
                titleRefs.current[id].focus(); // Focus on the editable element
            }
        }, 0); // Wait for state to update and DOM to reflect changes
    };

    return (
        <div className="management-link-container">
            {sortedLinks.length === 0 ? (
                <div className="no-links-container">

                    <AiOutlineFrown className="no-links-message-icon" />
                    <p className="no-links-message-text">링크가 없습니다. 새로운 링크를 추가해주세요!</p>
                </div>
            ) : (
                sortedLinks.map((link) => (
                    <div
                        key={link.id}
                        className={`link-item ${expandedLinkId === link.id ? "expanded" : ""}`}
                    >
                        <div className="link-header">
                            <div className="link-left">
                                <div className="link-divide">
                                <span
                                    ref={(el) => (titleRefs.current[link.id] = el)} // Assign ref
                                    className={`link-title ${
                                        editingId === link.id ? "editing" : ""
                                    }`}
                                    contentEditable={editingId === link.id}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        handleEdit(link.id, "title", e.target.textContent.trim());
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            e.target.blur();
                                        }
                                    }}
                                >
                                        {link.title}
                                    <GrEdit
                                        className="edit-icon"
                                        onClick={() => handleFocus(link.id)} // Trigger focus and edit mode
                                    />
                                    </span>

                                    <div className="link-bottom-icons">
                                        <LuLink
                                            className="link-add-btn"
                                            onClick={() => handleToggleExpand(link.id)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="link-right">
                                {/*<button*/}
                                {/*    className="detail-trash-button"*/}
                                {/*    onClick={() => setEditingId(link.id)}*/}
                                {/*>*/}
                                {/*    <GrEdit />*/}
                                {/*</button>*/}
                                <button
                                    onClick={() => handleDeleteLink(link)}
                                    className="detail-trash-button"
                                >
                                    <LuTrash2/>
                                </button>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={link.active}
                                        onChange={() => handleToggleLink(link)}
                                    />
                                    <span className="slider"></span>
                                </label>

                            </div>
                        </div>

                        {expandedLinkId === link.id && <DetailManagement link={link}/>}
                    </div>
                ))
            )}
        </div>
    );
};

export default ManagementPanel;
