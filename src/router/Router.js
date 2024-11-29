import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";
import Home from "../page/home/Home";
import Login from "../page/home/Login";

function AppRouter() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<Management />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )

}
export default AppRouter;