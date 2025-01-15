import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
    setOtpSent,
    setVerifyCode,
    setSent,
    setResendTimer,
    setIsResendDisabled,
} from "@/features/signUp/signUpSlice";

interface UserData {
    fullName: string;
    email: string;
}

interface SendOTPResponse {
    verificationCode: number;
    message: string;
}

export const sendOTP = createAsyncThunk(
    "signup/sendOTP",
    async (userData: UserData, { dispatch }) => {
        dispatch(setSent(true));

        try {
            const response = await axios.post<SendOTPResponse>(
                import.meta.env.VITE_BACKEND_URL + "/api/user/send-code",
                userData
            );

            if (response.status !== 200) {
                dispatch(setSent(false));
                throw new Error(response.data.message);
            }

            dispatch(setVerifyCode(response.data.verificationCode));
            dispatch(setOtpSent(true));
            dispatch(setSent(false));
            dispatch(setResendTimer(15));
            dispatch(setIsResendDisabled(true));

            return {
                title: "Success",
                description: "OTP has been sent to your email!",
                variant: "default" as const,
            };
        } catch (error: any) {
            dispatch(setSent(false));

            if (error.response?.status === 401) {
                throw new Error(
                    error.response.data.message ||
                        "User already exists, try signing in"
                );
            }

            throw new Error("Something went wrong. Please try again.");
        }
    }
);

// Usage example:
/*
import { useDispatch } from 'react-redux';
import { toast } from 'your-toast-library';

const YourComponent = () => {
    const dispatch = useDispatch();

    const handleSendOTP = async (userData: { fullName: string; email: string }) => {
        try {
            const resultAction = await dispatch(sendOTP(userData)).unwrap();
            toast(resultAction);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };
    
    // ... rest of your component
};
*/
