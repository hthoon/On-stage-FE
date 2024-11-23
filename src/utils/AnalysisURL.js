
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