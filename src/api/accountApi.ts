import apiClient from './axiosConfig';

const ENDPOINT_ACC = import.meta.env.VITE_API_ACC_ENDPOINT;
const ENDPOINT_ACC_SAVE = import.meta.env.VITE_API_ACC_SAVE;

export const fetchAccounts = async () => {
  try {
    const response = await apiClient.get(ENDPOINT_ACC);
    const apiResponse = response.data;

    // Validasi: Pastikan data ada dan berupa array
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;

  } catch (error) {
    console.error("Error in fetchAccGroup:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const saveAccount = async (accountData: any) => {
  try {
    const response = await apiClient.post(ENDPOINT_ACC_SAVE, accountData);
    const apiResponse = response.data;

    // Validasi response
    if (!apiResponse.data) {
      throw new Error('Failed to save account group');
    }

    return apiResponse.data;

  } catch (error) {
    console.error("Error in saveAccGroup:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};