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

    React.useEffect(() => {
        if (!loading || error) return;
        consumer.consume(method, options)
            .then(setData)
            .catch((error) => {
                if (error instanceof ApiException)
                    return setError(error.message);
                setError('An unknown error occurred');
            })
            .finally(() => setLoading(false));
    });

    const reload = async () => {
        setLoading(true);
        consumer.consume(method, options)
            .then(setData)
            .catch((error) => {
                if (error instanceof ApiException)
                    return setError(error.message);
                setError('An unknown error occurred');
            })
            .finally(() => setLoading(false));
    }
    return { data, loading, error, reload };
};