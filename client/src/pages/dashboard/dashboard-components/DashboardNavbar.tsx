import styles from "@/pages/landing-page/landingPage.module.css";

const DashboardNavbar: React.FC = () => {
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
                <div className={styles.navLinks}>
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
