import axios from "axios";

const submitDataForShortening = async (
    longUrl: string,
    alias: string,
    altName?: string
) => {
    try {
        const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + "/api/link/create",
            { targetUrl: longUrl, alias, altName },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw error.response.data;
            }
            if (error.request) {
                throw new Error("No response received from server");
            }
        }
        throw new Error("An error occurred while shortening the link");
    }
};

export default submitDataForShortening;
