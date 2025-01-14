import { useForm } from "react-hook-form";
import styles from "./component.module.css";
import { useState } from "react";
import submitDataForShortening from "../services/linkShortner";
import { useToast } from "@/hooks/use-toast";

type FormInputs = {
    longUrl: string;
    alias: string;
};

const ShortenerSection: React.FC = () => {
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

        try {
            await submitDataForShortening(data.longUrl, data.alias);
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
                `${window.location.hostname}/${alias}`
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
                        urlShortened && styles.short
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
                                    value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
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
                                    value: /^[a-zA-Z0-9-_]+$/,
                                    message:
                                        "Alias can only contain letters, numbers, hyphens, and underscores",
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
                    </div>
                    {urlShortened && (
                        <>
                            <div
                                className={styles.successShort}
                                onClick={copyToClipboard}
                            >
                                <img src="/Copy.svg" alt="Copy" />
                                <h2>{`${window.location.hostname}/${alias}`}</h2>
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

export default ShortenerSection;
