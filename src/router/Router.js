import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
//TODO map 테스트
import KakaoMap from '../components/MapDisplay/MapDisplay';

function AppRouter() {
    return (

        <Routes>
            <Route path="/management" element={<Management />} />
            <Route path="/map" element={<KakaoMap />} />
        </Routes>
          
    )

}
export default AppRouter;