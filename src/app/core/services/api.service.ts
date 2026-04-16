import axios, {type AxiosResponse} from 'axios';

export class ApiService {
    get<T>(url: string, options?: object): Promise<AxiosResponse<T>> {
        return axios.get<T>(url, options);
    }

    post<T>(url: string, body: unknown, options?: object): Promise<AxiosResponse<T>> {
        return axios.post<T>(url, body, options);
    }
}

export const apiService = new ApiService();
