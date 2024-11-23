
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


        NULL: "알 수 없음",
        INVALID: "잘못된 URL 형식"
    };
    return typeToKorean[type] || "지원하지 않는 서비스";
};