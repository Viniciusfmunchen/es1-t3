import { useCallback, useEffect, useState } from "react";
import api from "../../service/api";

interface UseGetByReturn<T> {
    data: T | undefined;
    loading: boolean;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const useGetBy = <T>(
    url: string,
    params?: Record<string, unknown>,
    errorMessage: string = `Erro ao carregar dados de ${url}:`,
    successMessage?: string
): UseGetByReturn<T> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadCount, setReloadCount] = useState(0);

    const serializedParams = params ? JSON.stringify(params) : undefined;

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const execute = async () => {
            try {
                const parsedParams = serializedParams
                    ? JSON.parse(serializedParams)
                    : undefined;
                const response = await api.get<T>(url, {
                    params: parsedParams,
                    signal: controller.signal,
                });
                if (!ignore) {
                    setData(response.data);
                    setError(null);
                    if (successMessage) {
                        console.log(successMessage);
                    }
                }
            } catch (err: unknown) {
                const errorObj = err as { name?: string; code?: string };
                if (
                    errorObj?.name === "CanceledError" ||
                    errorObj?.code === "ERR_CANCELED"
                ) {
                    return;
                }
                if (!ignore) {
                    console.error(errorMessage, err);
                    setError(
                        err instanceof Error ? err : new Error(String(err))
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        execute();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [url, serializedParams, reloadCount, errorMessage, successMessage]);

    const refetch = useCallback(async () => {
        setLoading(true);
        setReloadCount((c) => c + 1);
    }, []);

    return {
        data,
        loading,
        isLoading: loading,
        error,
        refetch,
    };
};

export default useGetBy;


