import { Helmet } from "react-helmet-async";

const HelmetSection: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>SlinkIt - Reset Your Password</title>

                <meta
                    name="description"
                    content="Securely reset your SlinkIt account password to regain access to your personalized dashboard."
                />

                <meta
                    name="keywords"
                    content="reset password, SlinkIt account recovery, secure password reset"
                />

                <meta
                    property="og:title"
                    content="SlinkIt - Reset Your Password"
                />
                <meta
                    property="og:description"
                    content="Need to reset your password? Follow the secure steps to regain access to your SlinkIt account."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/reset-password`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="SlinkIt - Reset Your Password"
                />
                <meta
                    name="twitter:description"
                    content="Securely reset your SlinkIt password and regain access to manage your personalized dashboard."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/reset-password`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="noindex, nofollow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}/reset-password`}
                />
            </Helmet>
        </>
    );
};

export default HelmetSection;
