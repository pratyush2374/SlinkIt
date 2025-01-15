"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import styles from "../signUp.module.css";
import axios from "axios";

type FormData = {
    fullName: string;
    email: string;
    password: string;
};

type verifyCodeData = {
    verificationCode: number;
};

const SignUpForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const { register: registerCode, handleSubmit: handleSubmitCode } =
        useForm<verifyCodeData>();

    const { toast } = useToast();
    const [otpSent, setOtpSent] = useState(false);
    const [verifyCode, setVerifyCode] = useState(0);
    const [sent, setSent] = useState(false);
    const [userData, setUserData] = useState({});
    const [resendTimer, setResendTimer] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleSendOTP = async (userData: {
        fullName: string;
        email: string;
    }) => {
        setSent(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/send-code`,
                userData
            );

            if (response.status !== 200) {
                setSent(false);
                return toast({
                    title: "Error",
                    description: `Couldn't send code: ${response.data.message}`,
                    variant: "destructive",
                });
            }

            setVerifyCode(response.data.data.verifyCode);
            console.log(response.data.data.verifyCode);
            toast({
                title: "Success",
                description: "OTP has been sent to your email!",
                variant: "default",
            });
            setOtpSent(true);
            setSent(false);
            setResendTimer(15);
            setIsResendDisabled(true);
        } catch (error: any) {
            setSent(false);
            if (error.response) {
                if (error.response.status != 200) {
                    toast({
                        title: "Error",
                        description:
                            error.response.data?.data ||
                            "User already exists, try signing in",
                        variant: "destructive",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Something went wrong. Please try again.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const onSubmit = async (data: FormData) => {
        const { fullName, email, password } = data;

        if (!fullName || !email || !password) {
            return toast({
                title: "Error",
                description: "All fields are required!",
                variant: "destructive",
            });
        }

        setUserData({
            fullName,
            email,
            password,
        });

        await handleSendOTP({ fullName, email });
    };

    const handleResendOTP = async () => {
        if (isResendDisabled) return;

        const userDataObj = userData as { fullName: string; email: string };
        await handleSendOTP({
            fullName: userDataObj.fullName,
            email: userDataObj.email,
        });
    };

    const handleVerify = async (data: verifyCodeData) => {
        const { verificationCode } = data;
        if (!verificationCode) {
            return toast({
                title: "Error",
                description: "Enter Verification Code",
                variant: "destructive",
            });
        }

        if (Number(verificationCode) !== verifyCode) {
            return toast({
                title: "Error",
                description: "Invalid Verification Code",
                variant: "destructive",
            });
        }

        // Send sign-up request after verification
        try {
            const userDataObj = userData as FormData;
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/sign-up`,
                {
                    name: userDataObj.fullName,
                    email: userDataObj.email,
                    password: userDataObj.password,
                },
                {
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Account created successfully!",
                    variant: "default",
                });
            }

            window.location.href = "/dashboard";
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.data ||
                    "Something went wrong during sign up",
                variant: "destructive",
            });
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
        <>
            <div className={styles.body}>
                <div className={styles.container}>
                    <div className={styles.imageSection}>
                        <img src="/Sign.png" alt="Sign Up Image" />
                    </div>
                    <div className={styles.formSection}>
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                {...register("fullName", { required: true })}
                                placeholder="Enter your Full Name"
                            />

                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", { required: true })}
                                placeholder="Enter your Email here"
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: true,
                                    minLength: 5,
                                })}
                                placeholder="Enter your Password here"
                                className={styles.password}
                            />
                            <button type="submit">
                                {sent ? "Sending Code..." : "Sign Up"}
                            </button>
                        </form>

                        {otpSent && (
                            <form
                                onSubmit={handleSubmitCode(
                                    handleVerify,
                                    onError
                                )}
                            >
                                <div className={styles.otpSection}>
                                    <label htmlFor="otp">Enter OTP</label>
                                    <input
                                        type="number"
                                        className={styles.otpInput}
                                        id="otp"
                                        {...registerCode("verificationCode", {
                                            required: true,
                                        })}
                                        placeholder="Enter the OTP sent to your email"
                                    />
                                    <div className={styles.resend}>
                                        <p>Didn't receive: </p>
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={isResendDisabled}
                                            style={{
                                                cursor: isResendDisabled
                                                    ? "not-allowed"
                                                    : "pointer",
                                                opacity: isResendDisabled
                                                    ? 0.5
                                                    : 1,
                                                border: "none",
                                                background: "none",
                                                color: "#0066ff",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            Resend{" "}
                                            {resendTimer > 0
                                                ? `(${resendTimer}s)`
                                                : ""}
                                        </button>
                                    </div>
                                    <button type="submit">Verify</button>
                                </div>
                            </form>
                        )}

                        <p>
                            Already have an account?{" "}
                            <a href="/sign-in">Sign In</a>
                        </p>

                        <div className={styles.socialLogin}>
                            <p>— OR —</p>
                            <div className={styles.google}>
                                <img
                                    src="/Google.svg"
                                    alt="Google Icon"
                                    className={styles.googleIcon}
                                />
                                Sign up with Google
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpForm;
