import {
    BrowserRouter as Router,
    Routes,
    Route,
    // Navigate,
} from "react-router-dom";
import LandingPage from "./pages/landing-page/page";
import SignIn from "./pages/sign-in/page";
import SignUp from "./pages/sign-up/page";
import Dashboard from "./pages/dashboard/page";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
