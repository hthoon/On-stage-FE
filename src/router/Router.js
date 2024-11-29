import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
//TODO map 테스트
import KakaoMap from '../components/MapDisplay/MapDisplay';
import Home from "../page/home/Home";
import Login from "../page/home/Login";
import News from "../page/news/News";

function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<Management />} />
            <Route path="/map" element={<KakaoMap />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/news" element={<News userId={8} />} /> */}
        </Routes>
          
    )

}
export default AppRouter;