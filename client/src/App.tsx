import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Navigate,
} from "react-router-dom";
import LandingPage from "./pages/landing-page/page";
import SignIn from "./pages/sign-in/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignIn />} />
            </Routes>
        </Router>
    );
}

export default App;
