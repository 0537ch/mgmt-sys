import apiClient from './axiosConfig';

const SETTING_FEATURE = import.meta.env.VITE_API_SETTING_FEATURE;

interface SettingFeatureItem {
  id?: number;
  idGroup?: string;
  featureId?: string;
  isEnabled?: boolean;
  [key: string]: any;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
  [key: string]: any;
}

export const fetchSettingFeature = async (idGroup: string = ''): Promise<SettingFeatureItem[]> => {
  try {
    const fullUrl = `${SETTING_FEATURE}${idGroup}`;
    const response = await apiClient.get(fullUrl);
    const apiResponse: ApiResponse<SettingFeatureItem[]> = response.data;

    // Validasi: Pastikan data ada dan berupa array
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in fetchSettingFeature:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const saveSettingFeature = async (settingFeatureData: SettingFeatureItem): Promise<SettingFeatureItem> => {
  try {
    const response = await apiClient.post(SETTING_FEATURE, settingFeatureData);
    const apiResponse: ApiResponse<SettingFeatureItem> = response.data;

    // Validasi response
    if (!apiResponse.data) {
      throw new Error('Failed to save setting feature');
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in saveSettingFeature:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};