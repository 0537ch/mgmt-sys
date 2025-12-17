import { useState, useEffect } from 'react';
import { fetchAllSystems, saveSystemData } from '../api/SystemApi';

const useSystems = () => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSystems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllSystems();
      setSystems(data);
    } catch (error) {
      console.error("Error loading systems:", error);
      setError(error.message || 'Failed to load systems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial data
    loadSystems();
  }, []);

  return { systems, loading, error, loadSystems };
};

export { useSystems };
export default useSystems;