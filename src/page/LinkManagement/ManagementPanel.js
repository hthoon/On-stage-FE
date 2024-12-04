import React, { useRef, useState } from "react";
import "./Management.css";
import { useLink } from "../../context/LinkContext";
import {LuFolder, LuTrash2} from "react-icons/lu";
import { sortLinksByPrevId } from "../../utils/sortLinks";
import DetailManagement from "./DetailManagement";
import { AiOutlineFrown } from "react-icons/ai";
import { GrEdit } from "react-icons/gr";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDraggable } from "react-icons/ri";
import Tooltip from "../../components/tooltip/Tooltip";
import { TbFolder } from "react-icons/tb";
import {IoChevronDown, IoChevronUp} from "react-icons/io5";
import {FaRegFolderOpen} from "react-icons/fa";
import {PiMusicNotesBold, PiSelectionPlusBold} from "react-icons/pi";
import {MdMusicNote, MdOutlineFolder} from "react-icons/md";

const ManagementPanel = ({ updateLink, deleteLink }) => {
    const { links, setLinks } = useLink();
    const [editingId, setEditingId] = useState(null);
    const [expandedLinkId, setExpandedLinkId] = useState(null);
    const sortedLinks = sortLinksByPrevId(links);
    const titleRefs = useRef({});

    // 공통 핸들러: 링크 업데이트
    const updateLinkState = async (updatedLink) => {
        setLinks((prevLinks) =>
            prevLinks.map((link) => (link.id === updatedLink.id ? updatedLink : link))
        );
        await updateLink(updatedLink);
    };

    // 드래그 종료 핸들러
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // 유효하지 않은 드래그 (원래 자리로 돌아감)
        if (!destination) return;

        // 드래그된 아이템을 새 순서로 정렬
        const updatedLinks = [...sortedLinks];
        const [moved] = updatedLinks.splice(source.index, 1);
        updatedLinks.splice(destination.index, 0, moved);

        // prevLinkId를 업데이트하고 상태를 업데이트
        for (let i = 0; i < updatedLinks.length; i++) {
            updatedLinks[i].prevLinkId = i === 0 ? null : updatedLinks[i - 1].id;
        }

        setLinks(updatedLinks);

        // 서버에 업데이트된 순서 반영
        updatedLinks.forEach((link) => updateLink(link));
    };

    const handleEdit = async (id, field, value) => {
        const updatedLink = links.find((link) => link.id === id);
        if (updatedLink) {
            updatedLink[field] = value;
            await updateLinkState(updatedLink);
        }
        setEditingId(null);
    };

    const handleDeleteLink = async (linkToDelete) => {
        const { id, prevLinkId } = linkToDelete;
        const nextLink = links.find((link) => link.prevLinkId === id);

        if (prevLinkId && nextLink) {
            const updatedNextLink = { ...nextLink, prevLinkId };
            await updateLinkState(updatedNextLink);
        } else if (nextLink) {
            const updatedNextLink = { ...nextLink, prevLinkId: null };
            await updateLinkState(updatedNextLink);
        }

        await deleteLink(id);
        setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
    };

    const handleToggleLink = async (link) => {
        try {
            const updatedLink = { ...link, active: !link.active };
            await updateLinkState(updatedLink);
        } catch (error) {
            console.error("Failed to toggle link:", error);
        }
    };

    const handleFocus = (id) => {
        setEditingId(id);
        setTimeout(() => {
            const element = titleRefs.current[id];
            if (element) {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(element);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus();
            }
        }, 0);
    };

    const LinkItem = ({ link, index }) => {
        const { id, title, active } = link;

        return (
            <Draggable draggableId={id.toString()} index={index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className={`link-item ${expandedLinkId === id ? "expanded" : ''}`}
                    >
                        <div className="link-header">
                            <div className="link-left">
                                <div
                                    {...provided.dragHandleProps} // 드래그 핸들러는 여기 적용
                                    className="drag-handle" // 스타일 적용을 위해 클래스 추가
                                >
                                    <span className="drag-icon"><RiDraggable /></span>
                                </div>

                                <div className="link-divide">
                                    {/* 아이콘 표시 영역 */}
                                    <div className="link-block-type-icon">
                                        {(() => {
                                            switch (link.blockType) {
                                                case "FOLDER":
                                                    return <LuFolder className="link-block-type-folder"/>;
                                                case "MUSIC":
                                                    return <PiMusicNotesBold className="link-block-type-music"/>;
                                                case "BLANK":
                                                default:
                                                    return <PiSelectionPlusBold className="link-block-type-blank"/>;
                                            }
                                        })()}
                                    </div>
                                    <span
                                        ref={(el) => (titleRefs.current[id] = el)}
                                        className={`link-title ${editingId === id ? "editing" : ""}`}
                                        contentEditable={editingId === id}
                                        suppressContentEditableWarning
                                        onBlur={(e) =>
                                            handleEdit(id, "title", e.target.textContent.trim())
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                e.target.blur();
                                            }
                                        }}
                                    >
                                    {title}

                                </span>
                                    {/* 블록 타입이 EMPTY가 아닐 경우에만 편집 아이콘 표시 */}
                                    {link.blockType !== "BLANK" && (
                                        <Tooltip text="블록 이름 바꾸기">
                                            <GrEdit className="edit-icon" onClick={() => handleFocus(id)}/>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>

                            <div className="link-right">
                                <Tooltip text={expandedLinkId === id ? "블록 닫기" : "블록 열기"}>
                                    {expandedLinkId === id ? (
                                        <IoChevronUp
                                            className="link-add-btn opened"
                                            onClick={() => setExpandedLinkId(null)}
                                        />
                                    ) : (
                                        <IoChevronDown
                                            className="link-add-btn closed"
                                            onClick={() => setExpandedLinkId(id)}
                                        />
                                    )}
                                </Tooltip>
                            </div>
                        </div>

                        {expandedLinkId === id && <DetailManagement
                            link={link}
                            handleToggleLink={handleToggleLink}
                            handleDeleteLink={handleDeleteLink}
                            updateLink={updateLink}
                        />}
                    </div>
                )}
            </Draggable>
        );
    };


    return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links">
                    {(provided) => (
                        <div
                            className="management-link-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {sortedLinks.length === 0 ? (
                                <div className="no-links-container">
                                    <AiOutlineFrown className="no-links-message-icon"/>
                                    <p className="no-links-message-text">보여드릴게 없어요. <br/> 우선 새로운 블록를 만들어보세요!</p>
                                </div>
                            ) : (
                                sortedLinks.map((link, index) => <LinkItem key={link.id} link={link} index={index}/>)
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
    );
};

export default ManagementPanel;
