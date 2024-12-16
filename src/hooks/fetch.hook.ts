import { useFocusEffect } from "expo-router";
import React from "react";
import { ApiException } from "../services/client/api.exception";
import { ApiConsumerFactory, ApiRequestConfig } from "../services/client/api.factory";

export const useClientFetch = ({ consumer, method, options }: {
    consumer: ApiConsumerFactory<any>,
    method: string,
    options?: ApiRequestConfig
}) => {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>();

    const fetchData = React.useCallback(async () => {
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
            fetchData();
        }, [fetchData])
    );

    const reload = () => {
        fetchData();
    };

    return { data, loading, error, reload };
};