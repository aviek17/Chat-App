import { API_USER } from "../utils/constants/api.constants";
import api from "./axios.service";

export const login = async (credentials) => {
    try {
        const response = await api.post(API_USER.LOGIN, credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const signup = async (credentials) => {
    try {
        const response = await api.post(API_USER.SIGNUP, credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const updateProfilePic = async (imageURL) => {
    try {
        const response = await api.post(API_USER.UPDATING_PROFILE_PIC, imageURL);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}