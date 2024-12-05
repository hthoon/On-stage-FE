// 서비스 타입을 아이콘으로 매핑하는 함수
import {
    FaTiktok,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaSpotify,
    FaYoutube,
    FaApple,
    FaTwitch,
    FaGithub
} from "react-icons/fa";
import {SiGitlab, SiNotion, SiSoundcloud, SiTistory, SiVelog, SiYoutube, SiYoutubemusic} from "react-icons/si";
import {AiOutlineFrown} from "react-icons/ai";
import {PiLinkBold} from "react-icons/pi";
import React from "react";

// URL 분석 함수
export const getDomainType = (url) => {
    try {
        const domain = new URL(url).hostname;

        if (domain.includes("tiktok.com")) return "TIKTOK";
        if (domain.includes("instagram.com")) return "INSTAGRAM";
        if (domain.includes("facebook.com")) return "FACEBOOK";
        if (domain.includes("notion.so")) return "NOTION";
        if (domain.includes("twitter.com") || domain.includes("x.com")) return "X";
        if (domain.includes("spotify.com")) return "SPOTIFY";
        if (domain.includes("youtube.com")) return "YOUTUBE";
        if (domain.includes("soundcloud.com")) return "SOUNDCLOUD";
        if (domain.includes("music.apple.com")) return "APPLE_MUSIC";
        if (domain.includes("twitch.tv")) return "TWITCH";
        if (domain.includes("chzzk.naver.com")) return "CHZZK";
        if (domain.includes("github")) return "GITHUB";
        if (domain.includes("music.youtube.com")) return "YOUTUBE_MUSIC";
        if (domain.includes("tistory.com")) return "TISTORY";
        if (domain.includes("velog.io")) return "VELOG";
        if (domain.includes("gitlab")) return "GITLAB";



        return "NULL";
    } catch (error) {
        return "INVALID";
    }
};


// 서비스 타입을 한국어로 매핑하는 함수
export const mapServiceTypeToKorean = (type) => {
    const typeToKorean = {
        TIKTOK: "틱톡",
        INSTAGRAM: "인스타그램",
        FACEBOOK: "페이스북",
        NOTION: "노션",
        X: "X",
        SPOTIFY: "스포티파이",
        YOUTUBE: "유튜브",
        SOUNDCLOUD: "사운드클라우드",
        APPLE_MUSIC: "애플 뮤직",
        TWITCH: "트위치",
        CHZZK: "치지직",
        GITHUB: "깃허브",
        YOUTUBE_MUSIC: "유튜브 뮤직",
        TISTORY: "티스토리",
        VELOG: "벨로그",
        GITLAB: "깃랩",




        NULL: "링크",
        INVALID: "잘못된 URL 형식"
    };
    return typeToKorean[type] || "지원하지 않는 서비스";
};

export const mapServiceTypeToIcon = (platform) => {
    const platformToIcon = {
        TIKTOK: <FaTiktok />,
        INSTAGRAM: <FaInstagram />,
        FACEBOOK: <FaFacebook />,
        NOTION: <SiNotion />,
        X: <FaTwitter />,
        SPOTIFY: <FaSpotify />,
        YOUTUBE: <FaYoutube />,
        SOUNDCLOUD: <SiSoundcloud />,
        APPLE_MUSIC: <FaApple />,
        TWITCH: <FaTwitch />,
        CHZZK: <FaTwitch />,
        GITHUB: <FaGithub />,
        YOUTUBE_MUSIC: <SiYoutubemusic />,
        TISTORY: <SiTistory />,
        VELOG: <SiVelog />,
        GITLAB: <SiGitlab />,



        NULL: <PiLinkBold />, // "알 수 없음" 아이콘
        INVALID: <AiOutlineFrown />, // 잘못된 URL을 위한 아이콘
    };

    return platformToIcon[platform] || platformToIcon["NULL"]; // 기본값은 "NULL"
};

export const socialPlatforms = [
    { name: "Instagram", icon: <FaInstagram />, key: "instagram" },
    { name: "YouTube", icon: <FaYoutube />, key: "youtube" },
    { name: "X (Twitter)", icon: <FaTwitter />, key: "x" },
    { name: "Spotify", icon: <FaSpotify />, key: "spotify" },
    { name: "GitHub", icon: <FaGithub />, key: "github" },
];
