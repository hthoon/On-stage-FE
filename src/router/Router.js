import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
import Home from "../page/home/Home";

function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<Management />} />
        </Routes>
    )

}
export default AppRouter;