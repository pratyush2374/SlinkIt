import { useToast } from "@/hooks/use-toast";
import styles from "@/pages/landing-page/landingPage.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DashboardNavbar: React.FC = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const signOut = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/sign-out`,
                {
                    withCredentials: true,
                }
            );
            toast({
                title: "Success",
                description: "Signed out successfully",
                variant: "default",
            });
            localStorage.clear();
            navigate("/sign-in");
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };
    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logoContainer}>
                    <img
                        src="/SlinkIt.svg"
                        alt="Logo"
                        className={styles.logo}
                    />
                    <p className={styles.brandName}>SlinkIt</p>
                </div>
                <div className={styles.navLinks} onClick={signOut}>
                    <button className={styles.signOutButton}>
                        <img src="/Logout.svg" alt="logout" />
                        <Link to="/sign-in">Sign out</Link>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default DashboardNavbar;
