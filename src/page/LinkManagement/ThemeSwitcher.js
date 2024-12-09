import React, { useEffect, useState } from "react";
import "./ThemeSwitcher.css";
import { useLink } from "../../context/LinkContext";
import { HiChevronLeft } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { FaPalette } from "react-icons/fa";
import { useAxios } from "../../context/AxiosContext";

const ThemeSwitcher = () => {
    const { axiosInstance } = useAxios();
    const { theme, updateTheme } = useLink();
    const [customTheme, setCustomTheme] = useState({
        ...theme,
        borderRadius: theme?.borderRadius ? parseInt(theme.borderRadius, 10) : 25, // 초기 설정
    });
    const [openSection, setOpenSection] = useState(null); // 어떤 섹션이 열릴지 관리

    useEffect(() => {
        // CSS 변수 업데이트
        Object.entries(customTheme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(
                `--${property}`,
                property === "borderRadius" || property === "backgroundImage"
                    ? `${value}px`
                    : value
            );
        });
    }, [customTheme]);

    useEffect(() => {
        // theme 변경 시 상태 초기화
        setCustomTheme({
            ...theme,
            borderRadius: theme?.borderRadius ? parseInt(theme.borderRadius, 10) : 25,
        });
    }, [theme]);


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.put(`/api/theme/background`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = response.data.backgroundImage; // 서버에서 반환된 이미지 URL

            handleThemeChange("backgroundImage", `url(${imageUrl})`);
            updateTheme(response.data);
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    };

    const clearBackground = async () => {

        try {
            const response = await axiosInstance.put(`/api/theme/background/clear` )
            const imageUrl = response.data.backgroundImage; // 서버에서 반환된 이미지 URL

            handleThemeChange("backgroundImage", `url(${imageUrl})`);
            updateTheme(response.data);
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    };
    const handleThemeChange = (property, value) => {
        const newTheme = { ...customTheme, [property]: value };
        setCustomTheme(newTheme); // 로컬 상태 업데이트
        updateTheme(newTheme); // 컨텍스트 동기화
    };

    const handleSliderChange = (property, value) => {
        handleThemeChange(property, parseInt(value, 10)); // 숫자로 저장
    };

    const handleUpdateTheme = async (e) => {
        try {
            await axiosInstance.put(`/api/theme`, customTheme);
            setOpenSection(null); // 설정 후 닫기
        } catch (error) {
            console.error(error);
        }
    };

    const handleSectionToggle = (section) => {
        setOpenSection(openSection === section ? null : section); // 열려있는 섹션을 토글
    };

    return (
        <div className="themeSwitcher-container">
            <div className="themeSwitcher-button-container">
                {/* 테마 설정 버튼 */}
                <button
                    className="theme-toggle-button"
                    onClick={() => handleSectionToggle("theme")} // 테마 설정 토글
                >
                    <FaPalette className="palette-icon" /> 테마
                </button>
            </div>

            {/* 테마 설정 영역 */}
            <div className={`theme-switcher ${openSection === "theme" ? "open" : "close"}`}>
                {openSection === "theme" && (
                    <div>
                        <div className="detail-modal-close-btn-container">
                            <HiChevronLeft
                                className="modal-close-btn"
                                onClick={() => setOpenSection(null)} // 테마 설정 닫기
                            />
                            <h3>테마</h3>
                            <IoMdClose
                                className="modal-close-btn"
                                onClick={() => setOpenSection(null)} // 테마 설정 닫기
                            />
                        </div>

                        <div className="theme-setting">
                            <label className="theme-file-label">
                                배경 이미지 업로드
                                <span className="theme-background-image-btn">
                                    업로드</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="theme-file-input"
                                />
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>배경 이미지 제거
                                <button
                                    className="theme-background-image-btn"
                                    onClick={clearBackground}>
                                    제거
                                </button>
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>
                                배경 색상:
                                <input
                                    type="color"
                                    value={customTheme.backgroundColor || "#333333"}
                                    onChange={(e) =>
                                        handleThemeChange("backgroundColor", e.target.value)
                                    }
                                />
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>
                                블록 색상:
                                <input
                                    type="color"
                                    value={customTheme.buttonColor || "#ffffff"}
                                    onChange={(e) =>
                                        handleThemeChange("buttonColor", e.target.value)
                                    }
                                />
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>
                                폰트 색상:
                                <input
                                    type="color"
                                    value={customTheme.fontColor || "#000000"}
                                    onChange={(e) =>
                                        handleThemeChange("fontColor", e.target.value)
                                    }
                                />
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>
                                아이콘 색상:
                                <input
                                    type="color"
                                    value={customTheme.iconColor || "#000000"}
                                    onChange={(e) =>
                                        handleThemeChange("iconColor", e.target.value)
                                    }
                                />
                            </label>
                        </div>
                        <div className="theme-setting">
                            <label>
                                프로필 문구 색상:
                                <input
                                    type="color"
                                    value={customTheme.profileColor || "#000000"}
                                    onChange={(e) =>
                                        handleThemeChange("profileColor", e.target.value)
                                    }
                                />
                            </label>
                        </div>

                        <div className="theme-setting">
                            <label>
                                모서리 둥글기:
                                <input
                                    type="range"
                                    min="1"
                                    max="25"
                                    className="theme-border-radius-slider"
                                    value={customTheme.borderRadius} // 숫자로 유지
                                    onChange={(e) =>
                                        handleSliderChange("borderRadius", e.target.value)
                                    }
                                />
                                <span>{customTheme.borderRadius}px</span>
                            </label>
                        </div>


                        <button onClick={handleUpdateTheme} className="form-cancel-button">
                            저장
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeSwitcher;
