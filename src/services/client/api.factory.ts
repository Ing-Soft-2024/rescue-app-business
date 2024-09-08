/**
 * This file contains the API Consumer Factory that is used to create API Consumers for the application to interact with the API
 * @version: 1.0
 */
import axios, { Axios, AxiosRequestConfig } from "axios";
import { ApiException } from "./api.exception";


/**
 * Try to make an axios request and return the data, if an error occurs throw an ApiException instead of AxiosError
 * @param request - The request to make
 * @returns 
 */
const tryAxios = async (_instance: Axios, config: AxiosRequestConfig) => {
    try {
        return (await _instance.request(config)).data;
    } catch (error) {
        if (!axios.isAxiosError(error) || !error.response)
            throw new ApiException(500, 'An unknown error occurred');
        throw new ApiException(error.response.status, error.response.data.message);
    }
}

export type ApiRequestConfig = Exclude<AxiosRequestConfig, "method" | "url"> & {
    "params"?: { [key: string]: any },
    "queryParams"?: { [key: string]: any }
}

class ApiConsumerFactory<ValidMethods extends string> {
    _axios: Axios;
    _endpoint: string;
    _validEndpoints?: ValidMethods[];
    static baseURL = process.env['REACT_PUBLIC_API_URL'];

    constructor({ endpoint, validEndpoints }: {
        endpoint: string,
        validEndpoints?: ValidMethods[]
    }) {
        this._axios = axios.create({ baseURL: ApiConsumerFactory.baseURL, headers: { 'Content-Type': 'application/json' } });
        this._endpoint = `${ApiConsumerFactory.baseURL}${endpoint}`;
        this._validEndpoints = validEndpoints?.map(method => method.toUpperCase() as ValidMethods);
    }

    /**
     * Serialize the parameters to a query string, if any parameters are provided return an empty string
     * @param query - The parameters to serialize
     * @returns 
     */
    private _querySerializer = (query?: { [key: string]: any }) => query ? `?${Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : '';

    private _replaceParams = (endpoint: string, params?: { [key: string]: any }) => {
        const regex = /{(\w+)}/g;
        const match = endpoint.match(regex);
        if (!match) return endpoint;


        let toReplace = endpoint;
        match.forEach((m, i) => {
            const regex = /(\w+)/;
            const paramName = match.groups?.[i] ?? m.match(regex)?.[0] ?? m;

            const paramValue = params?.[paramName];
            if (!paramValue) throw new ApiException(400, `Parameter ${paramName} is required`);
            toReplace = toReplace.replace(m, paramValue);
        });

        return toReplace;
    }

    /**
     * Consume the API with the provided method and data
     * @param method - The method to use
     * @param data - The data to send
     */
    consume = async (
        method: ValidMethods,
        data?: ApiRequestConfig
    ) => {
        console.log(method, data);
        if (this._validEndpoints && !this._validEndpoints.includes(method))
            throw new ApiException(405, 'Method not implemented');

        const endpoint = `${this._replaceParams(this._endpoint, data?.params)}${this._querySerializer(data?.queryParams)}`;
        // const authHeaders = await getHeaders();
        // console.log(endpoint, authHeaders);

        delete data?.params;
        delete data?.queryParams;
        return tryAxios(this._axios, {
            method: method,
            url: endpoint,
            headers: {
                // ...authHeaders,
                ...data?.headers,
                'Content-Type': 'application/json'
            },
            ...data,
        }).then(res => {
            return res;
        });
    }
}

export const apiConsumerFactory = ({
    endpoint,
    validEndpoints
}: {
    endpoint: string,
    validEndpoints?: string[]
}) => new ApiConsumerFactory({ endpoint, validEndpoints });