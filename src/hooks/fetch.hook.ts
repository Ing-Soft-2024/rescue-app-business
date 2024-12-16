import { useFocusEffect } from "expo-router";
import React from "react";
import { ApiException } from "../services/client/api.exception";
import { ApiConsumerFactory, ApiRequestConfig } from "../services/client/api.factory";

export const useClientFetch = ({ consumer, method, options }: {
    consumer: ApiConsumerFactory<any>,
    method: string,
    options?: ApiRequestConfig & { enabled?: boolean }
}) => {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>();

    const fetchData = React.useCallback(async () => {
        if (options?.enabled === false) return;
        
        setLoading(true);
        try {
            const result = await consumer.consume(method, options);
            setData(result);
        } catch (error) {
            if (error instanceof ApiException) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [consumer, method, JSON.stringify(options)]);

    useFocusEffect(
        React.useCallback(() => {
            if (options?.enabled !== false) {
                fetchData();
            }
        }, [fetchData, options?.enabled])
    );

    return { data, loading, error, reload: fetchData };
};