import React, { useRef, useState } from "react";
import { GrEdit } from "react-icons/gr";

import { MdVerified } from "react-icons/md";
import Tooltip from "./tooltip/Tooltip";

const EditableField = ({ field, value, onSave, children, isVerified, setProfile, axiosInstance }) => {
    const ref = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState("");

    const validate = (value) => {
        if (value.trim().length < 1) {
            return "한글자 정도는 입력하셔야죠";
        }
        if (value.trim().length > 20) {
            return "너무 길어요";
        }
        return "";
    };

    const handleFocus = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (ref.current) {
                const inputElement = ref.current;
                inputElement.focus();
                inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
            }
        }, 0);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
        }
    };

    const handleBlur = async () => {
        setIsEditing(false);
        const validationError = validate(inputValue.trim());
        if (validationError) {
            setError(validationError);
            alert(validationError);
        } else {
            setError("");
            await onSave(field, inputValue.trim(), setProfile, axiosInstance);
        }
    };

    const dynamicClass = `${field}-editing`;

    return (
        <div className={`editable-field ${dynamicClass} ${isEditing ? "editing" : ""}`}>
            {isEditing ? (
                <input
                    ref={ref}
                    value={inputValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <span>{children || value}</span>
            )}

            {field === "nickname" && isVerified && !isEditing && <MdVerified className="profile-verified-icon" />}
            {!isEditing && (
                <Tooltip text={`${field === "nickname" ? "블록 이름" : "설명"} 바꾸기`}>
                    <GrEdit className="edit-icon" onClick={handleFocus} />
                </Tooltip>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default EditableField;
