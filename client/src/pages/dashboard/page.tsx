import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavbar from "./dashboard-components/DashboardNavbar";
import HelmetSection from "./dashboard-components/HelmetSection";
import ShortenerSectionDashboard from "./dashboard-components/ShortnerSectionDashboard";
import UsersUrls from "./dashboard-components/UsersUrls";

interface UserLink {
    alias: string;
    altName: string;
    targetUrl: string;
}

const Dashboard: React.FC = () => {
    const [userUrls, setUserUrls] = useState<UserLink[]>([]);

    useEffect(() => {
        const fetchUserLinks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/link/get-user-links`, {
                    withCredentials: true
                });
                
                if (response.data.success && response.data.statusCode === 200) {
                    setUserUrls(response.data.data);
                } else {
                    console.error('Failed to fetch user links:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching user links:', error);
            }
        };

        fetchUserLinks();
    }, []);

    return (
        <>
            <HelmetSection />
            <DashboardNavbar />
            <ShortenerSectionDashboard setUserUrls={setUserUrls} />
            <UsersUrls userUrls={userUrls} setUserUrls={setUserUrls} />
        </>
    );
};

export default Dashboard;