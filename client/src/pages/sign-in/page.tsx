import React from "react";
import { Helmet } from "react-helmet-async"; // Import Helmet
import SignInForm from "./sign-in-components/SignInForm";

const SignIn: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>SlinkIt - Sign In to Access Your Dashboard</title>

                <meta
                    name="description"
                    content="Sign in to your SlinkIt account to manage, track, and shorten your URLs efficiently. Access your personalized dashboard now."
                />

                <meta
                    name="keywords"
                    content="sign in, log in, access account, link shortener, manage URLs, trackable URLs"
                />

                <meta
                    property="og:title"
                    content="Sign In to SlinkIt - Simplify Your Links"
                />
                <meta
                    property="og:description"
                    content="Log in to your SlinkIt account to access powerful link-shortening features. Manage and track your URLs with ease."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/signin`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Sign In to SlinkIt - Simplify Your Links"
                />
                <meta
                    name="twitter:description"
                    content="Log in to your SlinkIt account to access powerful link-shortening features. Manage and track your URLs with ease."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/signin`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="index, follow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}/signin`}
                />
            </Helmet>

            <SignInForm />
        </>
    );
};

export default SignIn;
