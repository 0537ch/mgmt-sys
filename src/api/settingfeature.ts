import apiClient from './axiosConfig';

const SETTING_FEATURE = import.meta.env.VITE_API_SETTING_FEATURE;

export const fetchSettingFeature = async (idGroup: string = '') => {
  try {
    const fullUrl = `${SETTING_FEATURE}${idGroup}`;
    console.log('Fetching setting feature from URL:', fullUrl);
    const response = await apiClient.get(fullUrl);
    const apiResponse = response.data;

    // Check if response has the expected structure
    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      // Handle case where response is directly an array in data property
      return { data: apiResponse.data };
    } else if (apiResponse.data && apiResponse.data.all_menu) {
      return apiResponse.data;
    } else if (Array.isArray(apiResponse.data)) {
      // Handle case where response is directly an array
      return { data: apiResponse.data };
    } else {
      console.warn('Unexpected API response structure:', apiResponse);
      return { data: [] }; // Return empty structure as fallback
    }

  } catch (error) {
    console.error("Error in fetchMenu:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};