import React from "react";
import axios from "axios";
import styles from "../dashboard.module.css";
import { useToast } from "@/hooks/use-toast";

interface UserLink {
    alias: string;
    altName: string;
    targetUrl: string;
}

interface UsersUrlsProps {
    userUrls: UserLink[];
    setUserUrls: React.Dispatch<React.SetStateAction<UserLink[]>>;
}

const UsersUrls: React.FC<UsersUrlsProps> = ({ userUrls, setUserUrls }) => {
    const { toast } = useToast();
    const handleCopy = async (alias: string) => {
        try {
            const shortUrl = `${import.meta.env.VITE_FRONTEND_URL}/${alias}`;
            await navigator.clipboard.writeText(shortUrl);
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

    const handleDelete = async (alias: string) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/link/delete-alias`,
                {
                    data: { alias },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                // Update the local state by filtering out the deleted URL
                setUserUrls((prevUrls) =>
                    prevUrls.filter((url) => url.alias !== alias)
                );
                toast({
                    title: "Success",
                    description: "URL deleted successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete URL",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong while deleting",
                variant: "destructive",
            });
        }
    };

    return (
        <div className={styles.urlsContainer}>
            <h2 className={styles.urlsTitle}>Your Shortened URLs</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.urlsTable}>
                    <thead>
                        <tr>
                            <th>Short URL</th>
                            <th>Name</th>
                            <th>Original URL</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userUrls.map((url, index) => (
                            <tr key={index}>
                                <td className={styles.aliasCell}>
                                    <span className={styles.shortUrl}>
                                        {import.meta.env.VITE_FRONTEND_URL_PLAIN}/{url.alias}
                                    </span>
                                </td>
                                <td>{url.altName}</td>
                                <td className={styles.targetCell}>
                                    <a
                                        href={url.targetUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.targetUrl}
                                    >
                                        {url.targetUrl}
                                    </a>
                                </td>
                                <td className={styles.actionsCell}>
                                    <button
                                        className={`${styles.actionButton} ${styles.copyButton}`}
                                        onClick={() => handleCopy(url.alias)}
                                    >
                                        Copy
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(url.alias)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersUrls;
