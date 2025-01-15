import React from "react";
import { Helmet } from "react-helmet-async"; // Import Helmet
import LandingNavbar from "./landing-page-components/LandingNavbar";
import ShortnerSection from "../../components/ShortnerSection";

const LandingPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>
                    SlinkIt - Shorten Your Links Quickly and Easily
                </title>

                <meta
                    name="description"
                    content="Our URL Shortener allows you to shorten and manage links effortlessly. Boost your marketing and make your URLs shareable and trackable."
                />

                <meta
                    name="keywords"
                    content="URL shortener, link shortener, shorten links, trackable URLs, custom URL shortener"
                />

                <meta
                    property="og:title"
                    content="URL Shortener - Shorten Your Links"
                />
                <meta
                    property="og:description"
                    content="Shorten, share, and track your URLs easily with our simple URL shortener service."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="URL Shortener - Shorten Your Links"
                />
                <meta
                    name="twitter:description"
                    content="Shorten, share, and track your URLs easily with our simple URL shortener service."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="index, follow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}`}
                />
            </Helmet>
            <LandingNavbar />
            <ShortnerSection />
        </>
    );
};

export default LandingPage;
