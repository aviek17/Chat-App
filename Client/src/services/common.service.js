import { API_USER } from "../utils/constants/api.constants";

const baseUrl = import.meta.env.VITE_CHAT_APP_HOST;

export const getBase64FromUrl = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getBase64FromFile = async (file) => {
    const imageUrl = baseUrl + API_USER.FETCH_PROFILE_PIC + file;
    console.log("Fetching image from URL:", imageUrl);
    return await getBase64FromUrl(imageUrl);
}


export const getStaticImageUrl = (filename) => {
    return baseUrl + API_USER.FETCH_PROFILE_PIC + filename;
}