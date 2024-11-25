import React, { useEffect, useState } from "react";
import "./ThemeSwitcher.css";
import { useLink } from "../../context/LinkContext";

const ThemeSwitcher = () => {
    const { theme, updateTheme } = useLink();
    const [customTheme, setCustomTheme] = useState(theme || {});
    const [isOpen, setIsOpen] = useState(false); // 토글 상태 관리

    useEffect(() => {
        // CSS 변수 업데이트
        Object.entries(customTheme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(`--${property}`, value);
        });
    }, [customTheme]);

    useEffect(() => {
        setCustomTheme(theme || {}); // theme 변경 시 상태 업데이트
    }, [theme]);

    const handleThemeChange = (property, value) => {
        const newTheme = { ...customTheme, [property]: value };
        setCustomTheme(newTheme); // 로컬 상태 업데이트
        updateTheme(newTheme); // 컨텍스트 동기화
    };

    return (
        <div className="themeSwitcher-container">
            <button
                className="theme-toggle-button"
                onClick={() => setIsOpen(!isOpen)} // 토글 상태 변경
            >
                {isOpen ? "테마 닫기" : "테마 열기"}
            </button>
            <div className={`theme-switcher ${isOpen ? "open" : "close"}`}>
                <h3>테마</h3>
                <div className="theme-setting">
                    <label>
                        버튼 색상:
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
                        프로필 색상:
                        <input
                            type="color"
                            value={customTheme.profileColor || "#000000"}
                            onChange={(e) =>
                                handleThemeChange("profileColor", e.target.value)
                            }
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ThemeSwitcher;
