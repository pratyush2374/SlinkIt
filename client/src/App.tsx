import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
import LandingPage from "./pages/landing-page/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
