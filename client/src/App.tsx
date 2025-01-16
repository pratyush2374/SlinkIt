import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Cookies from "js-cookie";
import LandingPage from "./pages/landing-page/page";
import SignIn from "./pages/sign-in/page";
import SignUp from "./pages/sign-up/page";
import Dashboard from "./pages/dashboard/page";
import NotFound from "./pages/not-found/page";
import axios from "axios";
import Loading from "./components/Loading";
import ResetPassword from "./pages/reset-password/page";

// Create auth context
const AuthContext = createContext<{
    isAuthenticated: boolean;
    token: string | null;
    setToken: (token: string | null) => void;
}>({
    isAuthenticated: false,
    token: null,
    setToken: () => {},
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const CatchAllRoute = () => {
    const location = useLocation();

    useEffect(() => {
        const checkRedirect = async () => {
            const notFoundUrl = `${
                import.meta.env.VITE_FRONTEND_URL
            }/not-found`;
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/link/redirect`,
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

    return <Loading />;
};

const App: React.FC = () => {
    const refreshTokens = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh-tokens`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                sessionStorage.setItem(
                    "accessTokenExpiry",
                    response.data.data.accessTokenExpiry.toString()
                );
                sessionStorage.setItem(
                    "refreshTokenExpiry",
                    response.data.data.refreshTokenExpiry.toString()
                );
            }
        } catch (error: any) {
            console.warn("Error refreshing tokens:");
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

    const [token, setToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        setToken(accessToken || null);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        const refreshInterval = setInterval(async () => {
            try {
                const accessTokenExpiry = Number(
                    sessionStorage.getItem("accessTokenExpiry")
                );
                const refreshTokenExpiry = Number(
                    sessionStorage.getItem("refreshTokenExpiry")
                );
                const currentTime = Date.now();

                if (refreshTokenExpiry <= currentTime) {
                    // If the refresh token has expired, log out
                    console.warn("Refresh token expired. Logging out.");
                    logout();
                    return; // Exit the function
                }

                if (accessTokenExpiry - currentTime <= 5 * 60 * 1000) {
                    // If access token will expire in less than 5 minutes, refresh it
                    await refreshTokens();
                    const newAccessToken = Cookies.get("accessToken");
                    setToken(newAccessToken || null);
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                logout();
            }
        }, 10 * 60 * 1000); // Run every 10 minutes

        return () => clearInterval(refreshInterval); // Clean up on component unmount
    }, []);

    if (!isInitialized) {
        return <Loading />;
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!token,
                token,
                setToken,
            }}
        >
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            token ? (
                                <Navigate to="/dashboard" />
                            ) : (
                                <LandingPage />
                            )
                        }
                    />
                    <Route
                        path="/sign-in"
                        element={
                            token ? <Navigate to="/dashboard" /> : <SignIn />
                        }
                    />
                    <Route
                        path="/sign-up"
                        element={
                            token ? <Navigate to="/dashboard" /> : <SignUp />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="*" element={<CatchAllRoute />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
