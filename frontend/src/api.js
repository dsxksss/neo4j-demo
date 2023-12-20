import axios from 'axios';

const BASE_URL = 'http://localhost:3001/upload'; // Replace with your actual backend API URL

// Function to upload images
const uploadImages = async (dirname, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/${dirname}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get images in a directory
const getImages = async (dirname) => {
    try {
        const response = await axios.get(`${BASE_URL}/${dirname}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to get all directories
const getAllDirectories = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to rename an image
const renameImage = async (dirname, filename, newName) => {
    try {
        const response = await axios.put(`${BASE_URL}/${dirname}/${filename}`, { newName });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to rename a directory
const renameDirectory = async (dirname, newDirName) => {
    try {
        const response = await axios.put(`${BASE_URL}/${dirname}`, { newDirName });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete an image
const deleteImage = async (dirname, filename) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${dirname}/${filename}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to delete a directory
const deleteDirectory = async (dirname) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${dirname}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export {
    uploadImages,
    getImages,
    getAllDirectories,
    renameImage,
    renameDirectory,
    deleteImage,
    deleteDirectory,
};
