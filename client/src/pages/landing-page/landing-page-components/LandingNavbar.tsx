import React from "react";
import styles from "../landingPage.module.css";

const LandingNavbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <img src="/SlinkIt.svg" alt="Logo" className={styles.logo} />
                <p className={styles.brandName}>SlinkIt</p>
            </div>
            <div className={styles.navLinks}>
                <p className={styles.contactButton}>
                    <a href="/contact">Contact Us</a>
                </p>
                <button className={styles.signInButton}>
                    <a href="/sign-in">Sign in / Sign up</a>
                </button>
            </div>
        </nav>
    );
};

export default LandingNavbar;
