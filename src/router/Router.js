import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Management from "../page/LinkManagement/Management";

function AppRouter() {
    return (

        <Routes>
            <Route path="/management" element={<Management />} />
        </Routes>
    )

}
export default AppRouter;