import React, { useEffect, useState, useCallback } from "react";

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({
    lat: 33.450701,
    lon: 126.570667,
  });

  // 이 부분에 대해서 백엔드에서 콘서트 이름, lat, lng을 불러오기
  const positions = [
    {
      title: "카카오",
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      title: "생태연못",
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      title: "텃밭",
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      title: "근린공원",
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ];

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

          // 현재 위치 가져오기
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              setCurrentPosition({ lat, lon });
              const locPosition = new window.kakao.maps.LatLng(lat, lon);
              displayMarker(kakaoMap, locPosition, "여기에 계신가요?!");
            });
          } else {
            const locPosition = new window.kakao.maps.LatLng(
              currentPosition.lat,
              currentPosition.lon
            );
            displayMarker(kakaoMap, locPosition, "Geolocation을 사용할 수 없어요.");
          }
        });
      };

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
      }}
    ></div>
  );
};

export default KakaoMap;
