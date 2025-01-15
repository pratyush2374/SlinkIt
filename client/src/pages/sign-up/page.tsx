import React from "react";
import { Helmet } from "react-helmet-async"; // Import Helmet
import SignUpForm from "./sign-up-components/SignUpForm";

const SignUp: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>SlinkIt - Sign Up and Shorten Your Links</title>

                <meta
                    name="description"
                    content="Create your SlinkIt account to shorten, manage, and track your URLs efficiently. Get started with personalized link-shortening today."
                />

                <meta
                    name="keywords"
                    content="sign up, create account, link shortener, shorten links, manage URLs, trackable URLs"
                />

                <meta
                    property="og:title"
                    content="Sign Up for SlinkIt - Simplify Your Links"
                />
                <meta
                    property="og:description"
                    content="Join SlinkIt to access powerful link-shortening features. Manage and track your URLs effortlessly."
                />
                <meta
                    property="og:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    property="og:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/signup`}
                />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Sign Up for SlinkIt - Simplify Your Links"
                />
                <meta
                    name="twitter:description"
                    content="Join SlinkIt to access powerful link-shortening features. Manage and track your URLs effortlessly."
                />
                <meta
                    name="twitter:image"
                    content={`${
                        import.meta.env.VITE_FRONTEND_URL
                    }/public/SlinkIt.svg`}
                />
                <meta
                    name="twitter:url"
                    content={`${import.meta.env.VITE_FRONTEND_URL}/signup`}
                />

                <meta name="author" content="Your Company Name" />
                <meta name="robots" content="index, follow" />
                <link
                    rel="canonical"
                    href={`${import.meta.env.VITE_FRONTEND_URL}/signup`}
                />
            </Helmet>

            <SignUpForm />
        </>
    );
};

export default SignUp;
