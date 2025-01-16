import { useToast } from "@/hooks/use-toast";
import styles from "@/pages/landing-page/landingPage.module.css";
import axios from "axios";

const DashboardNavbar: React.FC = () => {
    const { toast } = useToast();
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
            window.location.href = "/sign-in";
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
                        <a href="/sign-in">Sign out</a>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default DashboardNavbar;
