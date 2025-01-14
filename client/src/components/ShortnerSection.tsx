import { useForm } from "react-hook-form";
import styles from "./component.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { setSubmitting , setData} from "../features/form/formSlice";

type FormInputs = {
    longUrl: string;
    alias: string;
};

const ShortenerSection: React.FC = () => {

    const submitting = useSelector((state: RootState) => state.form.submitting);
    const data : FormInputs = useSelector((state: RootState) => state.form.data);
    const dispatch = useDispatch<AppDispatch>();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormInputs>();

    const onSubmit = (data: FormInputs) => {
        dispatch(setSubmitting(true));
        dispatch(setData(data));
        reset();
    };

    return (
        <section className={styles.shortenerSection}>
            <div className={styles.contentContainer}>
                <div className={styles.headerContent}>
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

                    <button
                        type="submit"
                        className={styles.shortenButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Shortening..." : "Shorten"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ShortenerSection;
