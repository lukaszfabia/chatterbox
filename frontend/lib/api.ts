import { allowedMethods, apiVersion as apiV, Microservice, microservices } from "@/config/config";
import { Model } from "./dto/model";
import getToken, { ACCESS } from "./token";

export interface Response<T> {
    data?: T;
    error?: string | undefined;
}

export interface Fetchable {
    method: allowedMethods;
    apiVersion: apiV;
    service: keyof Microservice;
    body?: Record<string, any> | null;
    token?: string | null;
    endpoint?: string | null;
    headers?: Record<string, string>;
}

// export const api = async <T extends Model>({
//     body,
//     service = microservices.chat,
//     method = "GET",
//     apiVersion = "v1",
//     endpoint,
//     token = getToken(ACCESS),
//     headers = {
//         "content-type": "application/json;charset=UTF-8",
//         ...(token && { Authorization: `Bearer ${token}` }),
//     },
// }: Fetchable): Promise<Response<T>> => {
//     try {
//         const url = `http://${microservices[service]}${apiVersion}${endpoint}`;

//         const response = await fetch(url, {
//             method,
//             headers,
//             body: body ? JSON.stringify(body) : undefined,
//         });

//         if (response.ok) {
//             const data: T = await response.json();
//             return { data };
//         }

//         const errorData: FailedRequest = await response.json();
//         return {
//             detail: errorData.detail || "Something went wrong!",
//         };

//     } catch (err) {
//         console.error("API error: ", err);
//         return {
//             detail: "Something went wrong!",
//         };
//     }
// };
