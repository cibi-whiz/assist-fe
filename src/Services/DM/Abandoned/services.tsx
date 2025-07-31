import Cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const token = JSON.parse(Cookies.get("assistuser") || "{}");
axios.defaults.headers.common["authorization"] = token?.token;

// Type definitions
interface CartSearchParams {
    from_date: string;
    to_date: string;
    email?: string;
    country?: string;
    customer?: number;
    sent?: string;
    sent_by?: string;
    page?: number;
    limit?: number;
}

interface ExportParams extends CartSearchParams {
    limit: number;
}

interface PageParams extends CartSearchParams {
    page: number;
}

interface CartDataResponse {
    data: any;
    pagination: {
        total: number;
        page: number;
        from: number;
        currentPage: number;
        lastPage: number;
        perPage: number;
    };
}

export const getCartData = async (params: CartSearchParams): Promise<CartDataResponse> => {
    const {
        from_date,
        to_date,
        email = "",
        country = "",
        customer = false,
        sent = "",
        sent_by = "",
        page = 1,
        limit = 25
    } = params;
    
    const response = await axios.get(`${API_URL}/orders/searchcart?limit=${limit}&page=${page}&from_date=${from_date}&to_date=${to_date}&email=${email}&country=${country}&existing_customer=${customer}&sent=${sent}&sent_by=${sent_by}`);
    return response.data;
};

export const clearRequest = async (params: CartSearchParams): Promise<CartDataResponse> => {
    const response = await axios.get(`${API_URL}/orders/searchcart?limit=${25}&page=1&from_date=${params.from_date}&to_date=${params.to_date}&existing_customer=0`);
    return response.data;
};

export const exportRequest = async (params: ExportParams): Promise<CartDataResponse> => {
    const response = await axios.get(`${API_URL}/orders/searchcart?limit=${params.limit}&page=1&from_date=${params.from_date}&to_date=${params.to_date}&email=${params.email}&country=${params.country}&existing_customer=${params.customer}&sent=${params.sent}&sent_by=${params.sent_by}`);
    return response.data;
};

export const mailSubject = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/orders/mail_subject`);
    return response.data;
};

export const createdByRequest = async (): Promise<any> => {
    const response = await axios.get(`${API_URL}/orders/assist_users`);
    return response.data;
};

export const pageRequest = async (params: PageParams): Promise<CartDataResponse> => {
    const response = await axios.get(`${API_URL}/orders/searchcart?limit=25&page=${params.page}&from_date=${params.from_date}&to_date=${params.to_date}&email=${params.email}&country=${params.country}&existing_customer=${params.customer}&sent=${params.sent}&sent_by=${params.sent_by}`);
    return response.data;
};

export const getCartDetails = async (id: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/orders/get_price?id=${id}`);
    return response.data;
};