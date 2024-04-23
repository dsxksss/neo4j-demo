import axios from 'axios';

const BASE_URL = 'http://localhost:3001/upload'; // Replace with your actual backend API URL

// Function to upload images
const uploadImages = async (pname,dirname, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${pname}/${dirname}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get images in a directory
const getImages = async (pname,dirname) => {
    try {
        const response = await axios.get(`${BASE_URL}/${pname}/${dirname}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get texts in a directory
const getTexts = async (pname,dirname) => {
    try {
        const response = await axios.get(`${BASE_URL}/text/${pname}/${dirname}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get all directories
const getAllDirectories = async (pname) => {
    try {
        const response = await axios.get(`${BASE_URL}/${pname}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to rename an image
const renameImage = async (pname,dirname, filename, newName) => {
    try {
        const response = await axios.put(`${BASE_URL}/${pname}/${dirname}/${filename}`, { newName });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to rename a directory
const renameDirectory = async (pname,dirname, newDirName) => {
    try {
        const response = await axios.put(`${BASE_URL}/${pname}/${dirname}`, { newDirName });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete an image
const deleteImage = async (pname,dirname, filename) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${pname}/${dirname}/${filename}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete a directory
const deleteDirectory = async (pname,dirname) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${pname}/${dirname}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export {
    uploadImages,
    getImages,
    getTexts,
    getAllDirectories,
    renameImage,
    renameDirectory,
    deleteImage,
    deleteDirectory,
};
