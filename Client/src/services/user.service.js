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

export const updateProfile = async (profileData) => {
    try {
        const response = await api.post(API_USER.UPDATING_PROFILE, profileData, headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const getuserOnPhoneNumber = async (phoneNumber) => {
    try {
        const response = await api.post(API_USER.USER_INFO_ON_PHONE_NUMBER,  phoneNumber , headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}


export const addNewContact = async (contactData) => {
    try {
        const response = await api.post(API_USER.ADD_NEW_CONTACT,  contactData , headers);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}