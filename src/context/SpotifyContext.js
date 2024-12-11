import React, { createContext, useContext, useState } from "react";

const SpotifyContext = createContext();

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const encodeToBase64 = (string) => btoa(string);

const SpotifyProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [tokenExpiration, setTokenExpiration] = useState(null);

    // 토큰 요청
    const fetchAccessToken = async () => {
        const now = new Date().getTime();
        if (accessToken && tokenExpiration && now < tokenExpiration) {
            return accessToken; // 기존 유효한 토큰 사용
        }
        try {
            const authString = encodeToBase64(`${CLIENT_ID}:${CLIENT_SECRET}`);
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${authString}`,
                },
                body: "grant_type=client_credentials",
            });
            const data = await response.json();
            if (!data.access_token) {
                throw new Error("Failed to retrieve access token");
            }
            setAccessToken(data.access_token);
            setTokenExpiration(new Date().getTime() + data.expires_in * 1000); // 만료 시간 설정
            return data.access_token;
        } catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    };

    // 공통 ID 추출 함수
    const extractIdFromUrl = (url, type) => {
        const parts = url.split(`/${type}/`);
        return parts.length > 1 ? parts[1].split("?")[0] : null;
    };

    // 공통 API 요청 함수
    const fetchSpotifyData = async (endpoint, token) => {
        try {
            const response = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Spotify API error:", errorData);
                throw new Error(`Failed to fetch Spotify data: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error during Spotify API request:", error);
            throw error;
        }
    };

    // 트랙 정보 가져오기
    const getTrackInfo = async (url) => {
        try {
            const token = await fetchAccessToken();
            const trackId = extractIdFromUrl(url, "track");
            if (!trackId) throw new Error("Invalid Spotify track URL");
            return await fetchSpotifyData(`https://api.spotify.com/v1/tracks/${trackId}`, token);
        } catch (error) {
            console.error("Error fetching track info:", error);
            throw error;
        }
    };

    // 아티스트 정보 가져오기
    const getArtistInfo = async (url) => {
        try {
            const token = await fetchAccessToken();
            const artistId = extractIdFromUrl(url, "artist");
            if (!artistId) throw new Error("Invalid Spotify artist URL");
            return await fetchSpotifyData(`https://api.spotify.com/v1/artists/${artistId}`, token);
        } catch (error) {
            console.error("Error fetching artist info:", error);
            throw error;
        }
    };

    return (
        <SpotifyContext.Provider value={{ getTrackInfo, getArtistInfo }}>
            {children}
        </SpotifyContext.Provider>
    );
};

// Custom Hook for accessing SpotifyContext
const useSpotify = () => useContext(SpotifyContext);

export { SpotifyProvider, useSpotify };