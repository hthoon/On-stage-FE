import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
import Home from "../page/home/Home";
import Analytics from '../page/Analytics/Analytics';

function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<Management />} />
            <Route path="/analytics" element={<Analytics />} />
        </Routes>
    )

}
export default AppRouter;