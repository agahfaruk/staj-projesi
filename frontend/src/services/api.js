import axios from 'axios';

const API_URL = 'http://localhost:8080/api/etkinlikler';

// 1. Tüm verileri çekme
export const getEtkinlikler = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// 2. Sadece Haber Ekleme (/api/etkinlikler/haber)
export const createHaber = async (formData) => {
    const response = await axios.post(`${API_URL}/haber`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// 3. Sadece Duyuru Ekleme (/api/etkinlikler/duyuru)
export const createDuyuru = async (formData) => {
    const response = await axios.post(`${API_URL}/duyuru`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// 4. Haber güncelleme
export const updateHaber = async (id, formData) => {
    const response = await axios.put(`${API_URL}/haber/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// 5. Duyuru güncelleme
export const updateDuyuru = async (id, formData) => {
    const response = await axios.put(`${API_URL}/duyuru/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// 6. İçerik Silme
export const deleteEtkinlik = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};