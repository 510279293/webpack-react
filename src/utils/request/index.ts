import axios from 'axios';
import { RequestOptions } from './requestInterface';
import successHandler from './successHandler';
import { requestError } from './errorHandler';

const server = axios.create({
    baseURL: process.env.baseURL,
    timeout: 6000, // 请求超时时间
})

// 添加请求拦截器
server.interceptors.request.use(
    (config: any) => config,
    (error: any) => Promise.reject(error),
);

// 添加响应拦截器
server.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        const {data} = error.response;
        // Toast.fail(`接口响应错误: ${JSON.stringify(data)}`);
        return Promise.reject(error)
    }
)

export default function request<T>(options: RequestOptions): Promise<T>{
    const { url: requestUrl = '', data } = options
    const newOptions: Record<string, any> = {
        credentials: 'include',
        method: '',
        ...options
    }
    if (['POST', 'PUT'].includes(newOptions.method)) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                ...newOptions.headers,
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            }
            newOptions.body = JSON.stringify(data)
        } else {
            newOptions.headers = {
                ...newOptions.headers,
                Accept: 'application/json',
            }
        }
    }
    return server(requestUrl, newOptions)
           .then((response: any) => response.data)
           .then((source: RequestOptions) => successHandler(source, newOptions))
           .catch((error: any) => requestError(error, newOptions))
}