import { Helmet } from "react-helmet-async";

const HelmetSection404: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>SlinkIt - Page Not Found</title>

                <meta
                    name="description"
                    content="Oops! The page you're looking for doesn't exist. Navigate back to your SlinkIt dashboard or explore other features."
                />

                <meta
                    name="keywords"
                    content="404, not found, SlinkIt, error page, missing link"
                />

                <meta
                    property="og:title"
                    content="SlinkIt - Page Not Found"
                />
                <meta
                    property="og:description"
                    content="We couldn't find the page you were looking for. Return to your dashboard or visit SlinkIt for more features."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/404`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="SlinkIt - Page Not Found"
                />
                <meta
                    name="twitter:description"
                    content="We couldn't find the page you were looking for. Return to your dashboard or visit SlinkIt for more features."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/404`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="noindex, nofollow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}/404`}
                />
            </Helmet>
        </>
    );
};

export default HelmetSection404;
