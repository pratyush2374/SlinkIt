import { Helmet } from "react-helmet-async";

const HelmetSection: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>SlinkIt - Your Personalized Dashboard</title>

                <meta
                    name="description"
                    content="Access your personalized SlinkIt dashboard to manage, track, and optimize your shortened URLs effortlessly."
                />

                <meta
                    name="keywords"
                    content="dashboard, URL management, link tracker, personalized analytics, shortened links"
                />

                <meta
                    property="og:title"
                    content="SlinkIt Dashboard - Manage Your Links"
                />
                <meta
                    property="og:description"
                    content="Explore your SlinkIt dashboard to manage and analyze your shortened URLs with ease."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/dashboard`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="SlinkIt Dashboard - Manage Your Links"
                />
                <meta
                    name="twitter:description"
                    content="Explore your SlinkIt dashboard to manage and analyze your shortened URLs with ease."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/dashboard`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="index, follow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}/dashboard`}
                />
            </Helmet>
        </>
    );
};

export default HelmetSection;
