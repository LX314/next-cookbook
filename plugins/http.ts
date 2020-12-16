import axios from "./axios";
import Message from '../components/message/index';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface AxiosRequest {
    baseURL?: string;
    url: string;
    data?: any;
    params?: any;
    method?: Method;
    headers?: any;
    timeout?: number;
    responseType?: ResponseType;
}
interface AxiosResponse {
    data: any
    status: number
    statusText: string
    headers: any
    config: AxiosRequest
    request?: any
}
interface AxiosFullResponse<T> extends AxiosResponse {
    model: BaseHttpModel<T>
}
class BaseHttpModel<T = any> {
    code: number;
    msg: string;
    tips: string;
    runtime: number;
    data: T;
    constructor(props: any) {
        this.code = props?.code ?? 400,
            this.msg = props?.msg ?? '',
            this.tips = props?.tips ?? '',
            this.runtime = props?.runtimer ?? 100000;
        this.data = props?.data ?? null;
    }
}
interface IHeaderProps {
    [key: string]: any
}
class HttpApi {
    public static baseURL: string = '';
    public static header: IHeaderProps = {};
    public static beforeRequest: (axiosRequest: AxiosRequest) => void;
    public static request<T = any>(req: AxiosRequest): Promise<AxiosFullResponse<T>> {
        this.beforeRequest(req)
        const { baseURL = HttpApi.baseURL, headers, method = "GET", url, data, params, responseType } = req
        return new Promise((resolve, reject) => {
            axios({
                baseURL,
                headers: Object.assign({}, this.header, headers),
                method,
                url,
                params,
                data: Object.keys(data).length > 0 ? data : undefined,
                // responseType,
                withCredentials: false,
            }).then((res) => {
                if (baseURL.includes('api.github.com') || baseURL.includes('raw.githubusercontent.com')) {
                    // res = {} as AxiosResponse
                    const d: object = {
                        code: 10000,
                        data: res as any
                    }
                    res = d as AxiosResponse
                }
                const _newres: BaseHttpModel<T> = new BaseHttpModel<T>(res);
                if (_newres.code === 10000) {
                    resolve({ ...(res as AxiosResponse), model: _newres });
                } else {
                    // Message.error(_newres.msg);
                    console.log('-->Error res: ', res)
                    reject(_newres)
                }
            }).catch((err) => {
                const message = err?.data?.errorMessage || err?.message || (url + '请求失败');
                // Message.error('Network Error');
                reject(new BaseHttpModel({ code: err.status, msg: message }));
            });
        });
    }
}


export default HttpApi;
