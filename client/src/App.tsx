import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/landing-page/page";
import SignIn from "./pages/sign-in/page";
import SignUp from "./pages/sign-up/page";
import Dashboard from "./pages/dashboard/page";
import NotFound from "./pages/not-found/page";
import axios from "axios";
import Loading from "./components/Loading";
import ResetPassword from "./pages/reset-password/page";

axios.defaults.withCredentials = true;

const CatchAllRoute = () => {
    const location = useLocation();

    useEffect(() => {
        const checkRedirect = async () => {
            const notFoundUrl = `${import.meta.env.VITE_FRONTEND_URL}/not-found`;
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/link/redirect`,
                    {
                        alias: location.pathname.slice(1),
                    },
                    {
                        withCredentials: false,
                        maxRedirects: 0,
                        validateStatus: (status) => status >= 200 && status < 400,
                    }
                );

                if (response.data.data.redirectUrl) {
                    window.location.href = response.data.data.redirectUrl;
                } else if (response.data.message === "Link not found") {
                    window.location.href = notFoundUrl;
                }
            } catch (error) {
                console.error("Redirect error:", error);
                window.location.href = notFoundUrl;
            }
        };

        checkRedirect();
    }, [location.pathname]);

    return <Loading />;
};

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const refreshTokens = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh-tokens`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                localStorage.setItem("ate", response.data.data.accessTokenExpiry.toString());
                localStorage.setItem("rte", response.data.data.refreshTokenExpiry.toString());
            }
        } catch (error) {
            console.warn("Error refreshing tokens");
        }
    };

    const logout = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/sign-out`,
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error logging out");
        }
    };

    useEffect(() => {
        const ate = localStorage.getItem("ate");
        const rte = localStorage.getItem("rte");
        setToken(ate && rte ? `${ate} ${rte}` : null);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            try {
                const accessTokenExpiry = Number(localStorage.getItem("ate"));
                const refreshTokenExpiry = Number(localStorage.getItem("rte"));
                const currentTime = Date.now();

                if (refreshTokenExpiry <= currentTime) {
                    logout();
                    return;
                }

                if (accessTokenExpiry - currentTime <= 5 * 60 * 1000) {
                    await refreshTokens();
                    const newAccessToken = localStorage.getItem("ate");
                    const newRefreshToken = localStorage.getItem("rte");
                    setToken(newAccessToken && newRefreshToken ? `${newAccessToken} ${newRefreshToken}` : null);
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                logout();
            }
        }, 10 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    if (!isInitialized) {
        return <Loading />;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" /> : <LandingPage />}
                />
                <Route
                    path="/sign-in"
                    element={token ? <Navigate to="/dashboard" /> : <SignIn />}
                />
                <Route
                    path="/sign-up"
                    element={token ? <Navigate to="/dashboard" /> : <SignUp />}
                />
                <Route 
                    path="/dashboard" 
                    element={token ? <Dashboard /> : <Navigate to="/" />} 
                />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<CatchAllRoute />} />
            </Routes>
        </Router>
    );
};

export default App;