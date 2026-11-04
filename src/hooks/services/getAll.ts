import { useCallback, useEffect, useState } from "react";
import api from "../../service/api";

interface UseGetAllReturn<T> {
    data: T[];
    loading: boolean;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const useGetAll = <T>(
    url: string,
    errorMessage: string = `Erro ao carregar dados de ${url}:`,
    successMessage?: string
): UseGetAllReturn<T> => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [reloadCount, setReloadCount] = useState(0);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const execute = async () => {
            try {
                const response = await api.get<T[]>(url, {
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
    }, [url, reloadCount, errorMessage, successMessage]);

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

export default useGetAll;



