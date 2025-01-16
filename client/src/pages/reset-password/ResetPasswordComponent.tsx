import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Changed to named import
import { useToast } from "@/hooks/use-toast";

interface FormData {
    password: string;
    confirmPassword: string;
}

interface JwtPayload {
    email: string;
    [key: string]: any;
}

// Rest of the component code remains exactly the same
const ResetPasswordComponent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const { toast } = useToast();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            const decodedToken = decodeURIComponent(tokenFromUrl);
            try {
                const validToken = jwtDecode<JwtPayload>(decodedToken);
                if (validToken?.email) {
                    setToken(decodedToken);
                } else {
                    setError("Invalid token");
                }
            } catch (err) {
                setError("Invalid or expired reset token");
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    const onSubmit = async (data: FormData) => {
        if (!token) {
            setError("No valid reset token found");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
                {
                    token,
                    password: data.password,
                }
            );

            if (response.status !== 200) {
                throw new Error(
                    response.data?.message || "Failed to reset password"
                );
            }

            toast({
                title: "Success",
                description: "Password reset successful",
            });

            navigate("/sign-in");
        } catch (err: any) {
            setError(
                err.response?.data?.data ||
                    "An error occurred while resetting your password"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (value: string) => {
        if (value.length < 8) {
            return "Password must be at least 8 characters";
        }
        return true;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>
                </div>
                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                                {...register("password", {
                                    required: "Password is required",
                                    validate: validatePassword,
                                })}
                                disabled={isLoading}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.confirmPassword
                                        ? "border-red-500"
                                        : ""
                                }`}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") ||
                                        "Passwords do not match",
                                })}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordComponent;
