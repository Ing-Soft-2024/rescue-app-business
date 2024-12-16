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
        console.log(_instance, config);
        return (await _instance.request(config)).data;
    } catch (error) {
        console.log(error);
        if (!axios.isAxiosError(error) || !error.response)
            throw new ApiException(500, 'An unknown error occurred');
        throw new ApiException(error.response.status, error.response.data.message);
    }
}

export type ApiRequestConfig = Exclude<AxiosRequestConfig, "method" | "url"> & {
    "params"?: { [key: string]: any },
    "queryParams"?: { [key: string]: any }
}

export class ApiConsumerFactory<ValidMethods extends string> {
    _axios: Axios;
    _baseEndpoint: string;
    _validEndpoints?: ValidMethods[];
    static baseURL = process.env['EXPO_PUBLIC_API_URL'];

    constructor({ endpoint, validEndpoints }: {
        endpoint: string,
        validEndpoints?: ValidMethods[]
    }) {
        this._axios = axios.create({ 
            baseURL: ApiConsumerFactory.baseURL, 
            headers: { 'Content-Type': 'application/json' } 
        });
        this._baseEndpoint = endpoint;
        this._validEndpoints = validEndpoints?.map(method => method.toUpperCase() as ValidMethods);
        console.log('Constructor - Base URL:', ApiConsumerFactory.baseURL);
        console.log('Constructor - Endpoint:', endpoint);
    }

    /**
     * Serialize the parameters to a query string, if any parameters are provided return an empty string
     * @param query - The parameters to serialize
     * @returns 
     */
    private _querySerializer = (query?: { [key: string]: any }) => query ? `?${Object.entries(query).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}` : '';

    /**
     * Consume the API with the provided method and data
     * @param method - The method to use
     * @param data - The data to send
     */
    consume = async (
        method: ValidMethods,
        data?: ApiRequestConfig
    ) => {
        console.log(this._baseEndpoint, method, data);
        if (this._validEndpoints && !this._validEndpoints.includes(method))
            throw new ApiException(405, 'Method not allowed');

        const endpoint = this._replaceParams(this._baseEndpoint, data?.params);
        const url = `/api/${endpoint}${this._querySerializer(data?.queryParams)}`;
        
        console.log('Consume - Final URL:', `${ApiConsumerFactory.baseURL}${url}`);
        console.log('Consume - Method:', method);
        console.log('Consume - Options:', JSON.stringify(data));

        return tryAxios(this._axios, {
            ...data,
            method,
            url
        });
    }

    private _replaceParams = (endpoint: string, params?: { [key: string]: any }) => {
        console.log('ReplaceParams - Input endpoint:', endpoint);
        console.log('ReplaceParams - Input params:', JSON.stringify(params));
        
        const regex = /{(\w+)}/g;
        const match = endpoint.match(regex);
        if (!match) return endpoint;

        let toReplace = endpoint;
        match.forEach((m) => {
            const paramName = m.replace(/{|}/g, '');
            const paramValue = params?.[paramName];
            console.log(`ReplaceParams - Replacing ${paramName} with ${paramValue}`);
            if (!paramValue) throw new ApiException(400, `Parameter ${paramName} is required`);
            toReplace = toReplace.replace(m, paramValue);
        });

        console.log('ReplaceParams - Output endpoint:', toReplace);
        return toReplace;
    }
}

export const apiConsumerFactory = ({
    endpoint,
    validEndpoints
}: {
    endpoint: string,
    validEndpoints?: string[]
}) => new ApiConsumerFactory({ endpoint, validEndpoints });