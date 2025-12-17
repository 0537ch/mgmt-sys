import apiClient from './axiosConfig';

const ENDPOINT_FITUR = import.meta.env.VITE_API_FITUR;
const ENDPOINT_FITUR_SAVE = import.meta.env.VITE_API_FITUR_SAVE;

export const fetchMenu = async () => {
  try {
    const response = await apiClient.get(ENDPOINT_FITUR);
    const apiResponse = response.data;

    // Validasi: Pastikan data ada dan berupa array
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;

  } catch (error) {
    console.error("Error in fetchMenu:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const saveMenu = async (menuData: any) => {
  try {
    const response = await apiClient.post(ENDPOINT_FITUR_SAVE, menuData);
    const apiResponse = response.data;

    // Validasi response
    if (!apiResponse.data) {
      throw new Error('Failed to save menu');
    }

    return apiResponse.data;

  } catch (error) {
    console.error("Error in saveMenu:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};