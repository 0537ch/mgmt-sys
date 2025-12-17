import apiClient from './axiosConfig';

const ENDPOINT_MENU = import.meta.env.VITE_API_MENU;
const ENDPOINT_MENU_SAVE = import.meta.env.VITE_API_MENU_SAVE;

interface MenuItem {
  isSidebar: boolean;
  nama: string;
  fitur: string;
  noMenu: number;
  pathMenu: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  group_menu: {
    nama: string;
    sistem: {
      nama: string;
    };
  };
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
  [key: string]: any;
}

export const fetchMenu = async (): Promise<MenuItem[]> => {
  try {
    const response = await apiClient.get(ENDPOINT_MENU);
    const apiResponse: ApiResponse<MenuItem[]> = response.data;

    // Validasi: Pastikan data ada dan berupa array
    if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in fetchMenu:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

export const saveMenu = async (menuData: MenuItem): Promise<MenuItem> => {
  try {
    const response = await apiClient.post(ENDPOINT_MENU_SAVE, menuData);
    const apiResponse: ApiResponse<MenuItem> = response.data;

    // Validasi response
    if (!apiResponse.data) {
      throw new Error('Failed to save menu');
    }

    return apiResponse.data;

  } catch (error: unknown) {
    console.error("Error in saveMenu:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};