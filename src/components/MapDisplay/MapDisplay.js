import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({
    lat: 37.514611,
    lon: 127.127469,
  });
  const [positions, setPositions] = useState([]);
  const [concerts, setConcerts] = useState([]);

  // 위치 배열에 따라 마커 추가
  const addMarkers = useCallback(
    (kakaoMap) => {
      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

      positions.forEach((position) => {
        const imageSize = new window.kakao.maps.Size(24, 35);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
        new window.kakao.maps.Marker({
          map: kakaoMap,
          position: new window.kakao.maps.LatLng(
            position.latlng.lat,
            position.latlng.lng
          ),
          title: position.title,
          image: markerImage,
        });
      });
    },
    [positions]
  );

  // 서버에서 위치 데이터 가져오기
  useEffect(() => {
    const fetchConcertData = async () => {
      console.log("맵 get요청");
      try {
        const response = await axios.get("http://localhost:8080/concert/list/소찬휘");
        const data = response.data;

        // 서버 응답 데이터를 positions 형식으로 변환
        const updatedPositions = data.map((concert) => ({
          title: concert.concertName,
          latlng: { lat: concert.placeInfo.latitude, lng: concert.placeInfo.longitude },
        }));

        setPositions(updatedPositions);
        setConcerts(data); // 콘서트 데이터 저장
      } catch (error) {
        console.error("Error fetching concert data:", error);
      }
    };

    fetchConcertData();
  }, []);

  useEffect(() => {
    console.log("맵 불러오기");
    const initializeMap = async () => {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=c72248c25fcfe17e7a6934e08908d1f4&autoload=false";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          const mapOption = {
            center: new window.kakao.maps.LatLng(
              currentPosition.lat,
              currentPosition.lon
            ),
            level: 3,
          };
          const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
          setMap(kakaoMap);

          // 현재 위치 가져오기
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              setCurrentPosition({ lat, lon });
              const locPosition = new window.kakao.maps.LatLng(lat, lon);
              displayMarker(kakaoMap, locPosition, "여기에 계신가요?!");
            });
        },
        [positions]
    );

    useEffect(() => {
        const initializeMap = async () => {
            const script = document.createElement("script");
            script.src =
                "//dapi.kakao.com/v2/maps/sdk.js?appkey=c72248c25fcfe17e7a6934e08908d1f4&autoload=false";
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load(() => {
                    const mapContainer = document.getElementById("map");
                    const mapOption = {
                        center: new window.kakao.maps.LatLng(
                            currentPosition.lat,
                            currentPosition.lon
                        ),
                        level: 3,
                    };
                    const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
                    setMap(kakaoMap);

  useEffect(() => {
    console.log("마커찍기");
    if (map) {
      addMarkers(map);
    }
  }, [map, addMarkers]);

            return () => {
                document.head.removeChild(script);
            };
        };

        initializeMap();
    }, [currentPosition.lat, currentPosition.lon]);

    useEffect(() => {
        if (map) {
            addMarkers(map);
        }
    }, [map, addMarkers]);

    // 현재 위치에 마커와 인포윈도우 표시
    const displayMarker = (kakaoMap, locPosition, message) => {
        const marker = new window.kakao.maps.Marker({
            map: kakaoMap,
            position: locPosition,
        });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${message}</div>`,
            removable: true,
        });

        infowindow.open(kakaoMap, marker);
        kakaoMap.setCenter(locPosition);
    };

    return (

            <div
                id="map"
                style={{
                    width: "700px",
                    height: "700px",
                    marginTop: "100px",
                    marginLeft: "40%",
                }}
            ></div>

    infowindow.open(kakaoMap, marker);
    kakaoMap.setCenter(locPosition);
  };

  // endDate 기준으로 정렬
  const sortByEndDate = () => {
    const sortedConcerts = [...concerts].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    setConcerts(sortedConcerts);
  };

  return (
    <div>
      <div
        id="map"
        style={{
          width: "700px",
          height: "700px",
        }}
      ></div>
      <button onClick={sortByEndDate} style={{ margin: "10px 0" }}>
        날짜순 정렬
      </button>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Concert Name</th>
            <th>End Date</th>
            <th>Place Name</th>
            <th>Performer</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {concerts.map((concert) => (
            <tr
              key={concert.concertId}
              onClick={() => window.open(concert.relateInfos[0]?.relateUrl, "_blank")}
              style={{ cursor: "pointer" }}
            >
              <td>{concert.concertName}</td>
              <td>{concert.endDate}</td>
              <td>{concert.placeName}</td>
              <td>{concert.performer}</td>
              <td>{concert.placeInfo.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KakaoMap;
