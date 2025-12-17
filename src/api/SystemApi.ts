import apiClient from './axiosConfig';

const SYSTEM_ENDPOINT = import.meta.env.VITE_API_SISTEM_ENDPOINT
const SAVE_DATA_ENDPOINT = import.meta.env.VITE_API_SISTEM_SAVE_DATA_ENDPOINT

interface SystemItem {
  id?: number;
  nama: string;
  url: string;
  destination: string;
  typeApi: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  headers: string;
  token: string | null;
}

interface ApiData {
  status?: string;
  message?: string;
  data?: SystemItem[];
  systems?: SystemItem[];
  [key: string]: any;
}

const transformSystemData = (apiData: ApiData | SystemItem[]): SystemItem[] => {
  if (apiData && !Array.isArray(apiData) && apiData.status === "false") {
    throw new Error(apiData.message || "API access denied");
  }

  const dataArray = Array.isArray(apiData) ? apiData : (apiData.data || apiData.systems || []);
  
  return dataArray.map((item: any, index: number): SystemItem => ({
    id: item.id || index + 1,
    nama: item.nama || '',
    url: item.url || '',
    destination: item.destination || '',
    typeApi: item.typeApi || '',
    status: item.status !== undefined ? item.status : true,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    headers: item.headers || '',
    token: item.token || null
  }));
};

export const fetchAllSystems = async (retryCount = 3) => {
  const maxRetries = retryCount;
  let currentAttempt = 0;
  
  while (currentAttempt < maxRetries) {
    try {
      const response = await apiClient.get(SYSTEM_ENDPOINT);
      
      const transformedData = transformSystemData(response.data);
      
      return transformedData;
    } catch (error: unknown) {
      currentAttempt++;
      console.error(`Error fetching users (attempt ${currentAttempt}/${maxRetries}):`, error instanceof Error ? error.message : String(error));
      
      if (currentAttempt >= maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, currentAttempt - 1)));
    }
  }
};


export const saveSystemData = async (systemData: Partial<SystemItem>) => {
  try {
    const dataToSave = {
      ...(systemData.id && { id: systemData.id }),
      nama: systemData.nama,
      url: systemData.url,
      destination: systemData.destination,
      typeApi: systemData.typeApi,
      status: systemData.status,
      headers: systemData.headers,
      token: systemData.token
    };
    
    const response = await apiClient.post(SAVE_DATA_ENDPOINT, dataToSave);
    return response.data;
  } catch (error: unknown) {
    console.error('Save system data error:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};
