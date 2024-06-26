import Axios, {AxiosError, AxiosResponse} from "axios";

export type ErrorType = {
    status: number | undefined;
    message: string;
}

const axiosInstance = Axios.create({
    baseURL: process.env["NEXT_PUBLIC_BACKEND_BASE_URL"],
    headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
    },
    withCredentials: true
});

const onFulfilled = (response: AxiosResponse) => {

    // the only thing we skip is the request object
    return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        config: response.config
    };
}

const onRejected = (_err: AxiosError) => {
    // Check if the error has a response and modify it accordingly
    console.log(_err)
    if( _err.response ) {
        // Default message from the error object
        let message = _err.message;

        // If the status code if 400, try to get the message from the response data
        if(_err.response.status === 400 && Array.isArray(_err.response.data) && _err.response.data.length > 0 || (_err.response.status === 404 || _err.response.status === 409 || _err.response.status === 401) && typeof _err.response.data === "string") {
            message = _err.response.status === 400 ? _err.response.data[0] : _err.response.data;
        }

        // Construct a new error object with modified properties
        const modifiedError: ErrorType = {
            status: _err.response.status,
            message
        }

        // Throw the modified error to be caught by the catch block
        return Promise.reject(modifiedError);

    }

    // If the error does not have a response, simply reject as is
    return Promise.reject({
        message: _err.message
    });
};

axiosInstance.interceptors.response.use(onFulfilled, onRejected)

export default axiosInstance;