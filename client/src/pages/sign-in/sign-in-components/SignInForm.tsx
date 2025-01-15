"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "../signIn.module.css";
import { useToast } from "@/hooks/use-toast";
import forgotPassword from "@/services/forgotPassword";
import signIn from "@/services/signIn";

interface SignInFormData {
    email: string;
    password: string;
}

const SignInForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignInFormData>();

    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string>("");

    const { toast } = useToast();

    const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
        try {
            await signIn(data.email, data.password);
            toast({
                title: "Success",
                description: "Signed in successfully",
            });
            window.location.href = "/dashboard";
        } catch (error : any) {
            toast({
                title: "Error",
                description: error.data || "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
    };

    const sendForgotPasswordEmail = async () => {
        if (!userEmail) {
            toast({
                title: "Error",
                description: "Please enter your email",
                variant: "destructive",
            });
            return;
        }
        try {
            await forgotPassword(userEmail);
            toast({
                title: "Success",
                description:
                    "If the email exists, you will receive an email with instructions to reset your password.",
            });
            reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data || "Something went wrong",
                variant: "destructive",
            });
            console.log(error);
        }
    };

    const onError = () => {
        if (errors.password?.type === "minLength") {
            toast({
                title: "Error!",
                description: "Password must be at least 8 characters long.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Error!",
                description: "Enter all fields",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.imageSection}>
                    <img src="/Sign.png" alt="" />
                </div>
                <div className={styles.formSection}>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                placeholder="Enter your email here"
                                className={
                                    errors.email ? styles.errorInput : ""
                                }
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 5 characters",
                                    },
                                })}
                                placeholder="Enter your password here"
                                className={`${styles.password} ${
                                    errors.password ? styles.errorInput : ""
                                }`}
                            />
                            <p
                                className={styles.forgotPassword}
                                onClick={sendForgotPasswordEmail}
                            >
                                Forgot password?
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={isSubmitting ? styles.loading : ""}
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className={styles.signupLink}>
                        Don't have an account? <a href="/sign-up">Sign up</a>
                    </p>

                    <div className={styles.socialLogin}>
                        <p>— OR —</p>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            className={`${styles.google} ${
                                isGoogleLoading ? styles.loading : ""
                            }`}
                        >
                            <img
                                src="/Google.svg"
                                alt="Google icon"
                                className={styles.googleIcon}
                            />
                            {isGoogleLoading
                                ? "Signing in..."
                                : "Sign in with Google"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
