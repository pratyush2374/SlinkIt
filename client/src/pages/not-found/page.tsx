import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./notFound.module.css";
import HelmetSection404 from "./HelmetSection";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <HelmetSection404 />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.errorCode}>404</h1>
                    <div className={styles.textContainer}>
                        <h2 className={styles.title}>Page not found</h2>
                        <p className={styles.description}>
                            Sorry, we couldn't find the page you're looking for.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className={styles.button}
                    >
                        <Home size={20} />
                        Go back home
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotFound;
