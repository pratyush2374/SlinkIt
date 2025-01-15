import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";
import LandingPage from "./pages/landing-page/page";
import SignIn from "./pages/sign-in/page";
import SignUp from "./pages/sign-up/page";
import Dashboard from "./pages/dashboard/page";
import axios from "axios";
import NotFound from "./pages/not-found/page";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

// Catch-all Route Component
const CatchAllRoute = () => {
    const location = useLocation();

    useEffect(() => {
        // Make sure to import axios

        // Inside CatchAllRoute component:
        const checkRedirect = async () => {
            const notFoundUrl = `${
                import.meta.env.VITE_FRONTEND_URL
            }/not-found`;
            try {
                const response = await axios.post(
                    "http://localhost:3000/api/link/redirect",
                    {
                        alias: location.pathname.slice(1),
                    },
                    {
                        withCredentials: false,
                        maxRedirects: 0,
                        validateStatus: function (status) {
                            return status >= 200 && status < 400;
                        },
                    }
                );

                if (response.data.data.redirectUrl) {
                    window.location.href = response.data.data.redirectUrl;
                } else if (response.data.message === "Link not found") {
                    window.location.href = notFoundUrl;
                }
            } catch (error: any) {
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    window.location.href = notFoundUrl;
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    window.location.href = notFoundUrl;
                } else {
                    console.error("Error:", error.message);
                    window.location.href = notFoundUrl;
                }
            }
        };

        checkRedirect();
    }, [location.pathname]);

    return <div>Loading......</div>;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<CatchAllRoute />} />
            </Routes>
        </Router>
    );
}

export default App;
