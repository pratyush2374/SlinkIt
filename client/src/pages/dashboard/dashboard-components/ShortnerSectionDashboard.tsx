import { useForm } from "react-hook-form";
import styles from "@/components/component.module.css";
import { useState } from "react";
import submitDataForShortening from "@/services/linkShortner";
import { useToast } from "@/hooks/use-toast";

type FormInputs = {
    longUrl: string;
    alias: string;
    altName: string;
};

type ShortenerSectionDashboardProps = {
    setUserUrls: React.Dispatch<React.SetStateAction<any>>;
};

const ShortenerSectionDashboard: React.FC<ShortenerSectionDashboardProps> = ({
    setUserUrls,
}) => {
    const [urlShortened, setUrlShortened] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [alias, setAlias] = useState("");
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        setSubmitting(true);
        setAlias(data.alias);
        setUrlShortened(false);
        try {
            await submitDataForShortening(
                data.longUrl,
                data.alias,
                data.altName
            );

            // Add the new URL to the userUrls array
            setUserUrls((prevUrls: any) => [
                ...prevUrls,
                {
                    alias: data.alias,
                    altName: data.altName || "Link",
                    targetUrl: data.longUrl,
                },
            ]);

            toast({
                title: "Success",
                description: "Link Shortened Successfully",
            });
            setUrlShortened(true);
            reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.data || "Something went wrong",
                variant: "destructive",
            });
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText(
                `${import.meta.env.VITE_FRONTEND_URL_PLAIN}/${alias}`
            );
            toast({
                title: "URL Copied!",
                description: "Shortened URL has been copied to clipboard.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong while copying",
                variant: "destructive",
            });
        }
    };

    return (
        <section className={styles.shortenerSection}>
            <div className={styles.contentContainer}>
                <div
                    className={`${styles.headerContent} ${
                        urlShortened && styles.shortDashboard
                    }`}
                >
                    <img
                        src="/SlinkIt.svg"
                        alt="Link Icon"
                        className={styles.linkIcon}
                    />
                    <h1 className={styles.title}>Shorten your links</h1>
                </div>
                <p className={styles.subtitle}>Share your links with ease</p>

                <form
                    className={styles.shortenerForm}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Enter long link"
                            className={styles.input}
                            {...register("longUrl", {
                                required: "URL is required",
                                pattern: {
                                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/,
                                    message: "Please enter a valid URL",
                                },
                            })}
                        />
                        {errors.longUrl && (
                            <span className={styles.errorMessage}>
                                {errors.longUrl.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Enter alias"
                            className={styles.input}
                            {...register("alias", {
                                required: "Alias is required",
                                pattern: {
                                    value: /^(?!.*\s)[a-zA-Z0-9-_]+$/,
                                    message:
                                        "Alias can only contain letters, numbers, hyphens, and underscores (no spaces or special characters)",
                                },
                                maxLength: {
                                    value: 30,
                                    message:
                                        "Alias must be less than 30 characters",
                                },
                            })}
                        />
                        <label className={styles.aliasLabel}>
                            Example: {window.location.hostname}/your-alias
                        </label>
                        {errors.alias && (
                            <span className={styles.errorMessage}>
                                {errors.alias.message}
                            </span>
                        )}

                        <input
                            type="text"
                            placeholder="Enter alternate name"
                            className={styles.input}
                            {...register("altName")}
                        />
                    </div>
                    {urlShortened && (
                        <>
                            <div
                                className={styles.successShort}
                                onClick={copyToClipboard}
                            >
                                <img src="/Copy.svg" alt="Copy" />
                                <h2>{`${
                                    import.meta.env.VITE_FRONTEND_URL_PLAIN
                                }/${alias}`}</h2>
                            </div>
                            <p className={styles.copyMessage}>
                                Click to copy !
                            </p>
                        </>
                    )}
                    <button
                        type="submit"
                        className={styles.shortenButton}
                        disabled={isSubmitting}
                    >
                        {submitting ? "Shortening..." : "Shorten"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ShortenerSectionDashboard;
