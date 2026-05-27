import { API_CHAT } from "../utils/constants/api.constants";
import api from "./axios.service";

const headers = {
    'Content-Type': 'application/json',
};

export const getUserDisplayMessage = async () => {
    try {
        const response = await api.get(API_CHAT.USER_DISPLAY_MESSAGE, headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getUserLastMessages = async () => {
    try {
        const response = await api.get(API_CHAT.USER_LAST_MESSAGE, headers);
        return response.data;   
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}