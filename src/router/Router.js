import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
//TODO map 테스트
import KakaoMap from '../components/MapDisplay/MapDisplay';
import Home from "../page/home/Home";
import Login from "../page/home/Login";
import VisitPage from "../page/LinkManagement/VisitPage";

function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<Management />} />
            <Route path="/page/:nickname" element={<VisitPage />} />
            <Route path="/map" element={<KakaoMap />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analytics" element={<Analytics />} />
        </Routes>
          
    )

}
export default AppRouter;