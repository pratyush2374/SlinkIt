import React from "react";
import styles from "../landingPage.module.css";
import { Link } from "react-router-dom";

const LandingNavbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <img src="/SlinkIt.svg" alt="Logo" className={styles.logo} />
                <p className={styles.brandName}>SlinkIt</p>
            </div>
            <div className={styles.navLinks}>
                <button className={styles.signInButton}>
                    <Link to="/sign-in">Sign in / Sign up</Link>
                </button>
            </div>
        </nav>
    );
};

export default LandingNavbar;
