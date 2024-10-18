import axios from "axios"

const request = axios.create({
    baseURL : process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const apiFormData = axios.create({
    baseURL : process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

export default request
