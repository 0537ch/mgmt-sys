import apiClient from './axiosConfig';

const ENDPOINT_LIST = import.meta.env.VITE_API_MENU_GROUP;

const ENDPOINT_SELECT = import.meta.env.VITE_API_MENU_GROUP_CB;

const ENDPOINT_SAVE = import.meta.env.VITE_API_MENU_GROUP_SAVE;

interface MenuGroupItem {
  id?: number;
  nama?: string;
  value?: string;
  label?: string;
  sistem?: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
  [key: string]: any;
}

export const fetchMenuGroup = async (): Promise<MenuGroupItem[]> => {
  try {
    const response = await apiClient.get(ENDPOINT_LIST);
    const apiResponse: ApiResponse<MenuGroupItem[]> = response.data;

    // Validasi: Pastikan data ada dan berupa array
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in fetchMenuGroup:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Mengambil data ringan untuk Dropdown/Select Input
 * Endpoint: .../get_data_cb
 */
export const fetchMenuGroupSelect = async (): Promise<MenuGroupItem[]> => {
  try {
    const response = await apiClient.get(ENDPOINT_SELECT);
    const apiResponse: ApiResponse<MenuGroupItem[]> = response.data;

    // Validasi
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    // Mengembalikan array opsi (value, label, sistem)
    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in fetchMenuGroupSelect:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const saveMenuGroup = async (menuData: MenuGroupItem): Promise<MenuGroupItem> => {
  try {
    const response = await apiClient.post(ENDPOINT_SAVE, menuData);
    const apiResponse: ApiResponse<MenuGroupItem> = response.data;

    // Validasi response
    if (!apiResponse.data) {
      throw new Error('Failed to save menu group');
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in saveMenuGroup:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};