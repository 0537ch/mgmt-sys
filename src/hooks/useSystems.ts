import { useState, useEffect } from 'react';
import { fetchAllSystems } from '@/api/SystemApi';

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

interface UseSystemsReturn {
  systems: SystemItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSystems(): UseSystemsReturn {
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSystems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllSystems();
      setSystems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load systems';
      setError(errorMessage);
      console.error('Failed to load systems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    loadSystems();
  }, []);

  return { systems, loading, error, refetch: loadSystems };
}

export default useSystems;