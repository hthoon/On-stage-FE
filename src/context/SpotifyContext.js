import React, {createContext, useContext, useState} from "react";

const SpotifyContext = createContext();

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

const encodeToBase64 = (string) => btoa(unescape(encodeURIComponent(string)));

const SpotifyProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);

    const fetchAccessToken = async () => {
        if (accessToken) return accessToken;
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
                throw new Error("Access token not retrieved");
            }
            setAccessToken(data.access_token);
            return data.access_token;
        } catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    };

    const extractTrackId = (url) => {
        const parts = url.split("/track/");
        if (parts.length > 1) {
            return parts[1].split("?")[0];
        }
        return null;
    };

    // 아티스트 ID 추출
    const extractArtistId = (url) => {
        const parts = url.split("/artist/");
        if (parts.length > 1) {
            return parts[1].split("?")[0];
        }
        return null;
    };

    // 트랙 정보 가져오기
    const getTrackInfo = async (url) => {
        try {
            const token = await fetchAccessToken();
            const trackId = extractTrackId(url);

            if (!trackId) {
                throw new Error("Invalid Spotify track URL");
            }

            const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Spotify API error:", errorData);
                throw new Error("Failed to fetch track info");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching track info:", error);
            throw error;
        }
    };

    // 아티스트 정보 가져오기
    const getArtistInfo = async (url) => {
        try {
            const token = await fetchAccessToken();
            const artistId = extractArtistId(url);

            if (!artistId) {
                throw new Error("Invalid Spotify artist URL");
            }

            const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Spotify API error:", errorData);
                throw new Error("Failed to fetch artist info");
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching artist info:", error);
            throw error;
        }
    };
    return (
        <SpotifyContext.Provider value={{getTrackInfo, getArtistInfo}}>
            {children}
        </SpotifyContext.Provider>
    );
};

const useSpotify = () => {
    return useContext(SpotifyContext);
};
export {SpotifyProvider, useSpotify};
