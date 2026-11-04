import { useCallback, useState } from "react";
import api from "../../service/api";

interface UsePostReturn<TResponse, TBody> {
    data: TResponse | undefined;
    loading: boolean;
    isLoading: boolean;
    error: Error | null;
    isSuccess: boolean;
    post: (body?: TBody, customUrl?: string) => Promise<TResponse | undefined>;
    reset: () => void;
}

const usePost = <TResponse = unknown, TBody = unknown>(
    url: string,
    errorMessage: string = `Erro ao enviar dados para ${url}:`,
    successMessage?: string
): UsePostReturn<TResponse, TBody> => {
    const [data, setData] = useState<TResponse | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const post = useCallback(
        async (
            body?: TBody,
            customUrl?: string
        ): Promise<TResponse | undefined> => {
            setLoading(true);
            setError(null);
            setIsSuccess(false);
            try {
                const targetUrl = customUrl ?? url;
                const response = await api.post<TResponse>(targetUrl, body);
                setData(response.data);
                setIsSuccess(true);
                if (successMessage) {
                    console.log(successMessage);
                }
                return response.data;
            } catch (err: unknown) {
                console.error(errorMessage, err);
                const parsedError =
                    err instanceof Error ? err : new Error(String(err));
                setError(parsedError);
                throw parsedError;
            } finally {
                setLoading(false);
            }
        },
        [url, errorMessage, successMessage]
    );

    const reset = useCallback(() => {
        setData(undefined);
        setError(null);
        setLoading(false);
        setIsSuccess(false);
    }, []);

    return {
        data,
        loading,
        isLoading: loading,
        error,
        isSuccess,
        post,
        reset,
    };
};

export default usePost;

