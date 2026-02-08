import { API_USER } from "../utils/constants/api.constants";
import api from "./axios.service";

const headers = {
    'Content-Type': 'application/json',
};

export const login = async (credentials) => {
    try {
        const response = await api.post(API_USER.LOGIN, credentials, headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const signup = async (credentials) => {
    try {
        const response = await api.post(API_USER.SIGNUP, credentials, headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const updateProfilePic = async (formData) => {
    try {
        const response = await api.post(
            API_USER.UPDATING_PROFILE_PIC,
            formData
        );

        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}