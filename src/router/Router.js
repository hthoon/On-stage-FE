import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LinkDisplay from "../components/LinkDisplay/LinkDisplay";

function AppRouter() {
    return (

        <Routes>
            <Route path="/test" element={<LinkDisplay />} />
        </Routes>
    )

}
export default AppRouter;