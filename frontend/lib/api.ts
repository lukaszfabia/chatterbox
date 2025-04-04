import { allowedMethods, Microservice, microservices } from "@/config/config";
import getToken, { ACCESS } from "./token";

export type CONTENT_TYPE = "application/json;charset=UTF-8" | "multipart/form-data";

export interface Fetchable {
    method: allowedMethods;
    apiVersion: "api/v1" | "api/v2";
    service: keyof Microservice;
    body?: Record<string, any> | FormData | null;
    token?: string | null;
    endpoint?: string | null;
    headers?: Record<string, string>;
}

export const api = async <T>({
    body,
    service,
    method = "GET",
    endpoint,
    apiVersion = "api/v1",
    token = getToken(ACCESS),
    headers,
}: Fetchable): Promise<T | null> => {
    try {
        const url = `http://${microservices[service]}/${apiVersion}${endpoint}`;

        console.log('url', url)

        const isFormData = body instanceof FormData;

        const defaultHeaders: Record<string, string> = {
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        if (!isFormData) {
            defaultHeaders["Content-Type"] = "application/json;charset=UTF-8";
        }

        const response = await fetch(url, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });

        if (response.ok) {
            const data: T = await response.json();
            return data;
        }

        console.log('Something went wrong!');
        return null;
    } catch (err) {
        console.error("API error: ", err);
        return null;
    }
};
