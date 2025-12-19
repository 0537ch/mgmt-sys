import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenu, saveMenu } from '../api/fiturApi';
import { fetchAllSystems } from '../api/SystemApi';
import DataTable from '../components/common/DataTable';
import ActionsCell from '../components/Fitur/ActionsCell';
import EditModal from '../components/Fitur/EditModal';

const Fitur = () => {
  const [fiturs, setFiturs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  
  // Data for Dropdowns
  const [systems, setSystems] = useState([]);
  const [loadingSystems, setLoadingSystems] = useState(true);

  // Searchable Dropdown States
  const [systemSearchTerm, setSystemSearchTerm] = useState("");
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);

  
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fiturData, systemsData] = await Promise.all([
        fetchMenu(),
        fetchAllSystems()
      ]);
      setFiturs(fiturData);
      setSystems(systemsData);
    } catch (error) {
      console.error("Error loading fiturs:", error);
      setError(error.message || 'Failed to load fiturs');
    } finally {
      setLoading(false);
      setLoadingSystems(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchMenu();
      setFiturs(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setSystemSearchTerm("");
    setFormData({
      menu: '',
      route: '',
      urutan: '',
      icon: '',
      showFiture: '',
      status: true,
      idSistem: ''
    });
    setShowModal(true);
  };

  const handleEditFitur = (fitur) => {
    setFormData(fitur);
    // Extract system name properly - handle both ID and object cases
    let systemName = "";
    if (fitur.idSistem) {
      if (typeof fitur.idSistem === 'object') {
        systemName = fitur.idSistem.nama;
      } else {
        // If it's just an ID, find the system name
        const currentSystem = systems.find(s => s.id === fitur.idSistem);
        systemName = currentSystem ? currentSystem.nama : "";
      }
    }
    setSystemSearchTerm(systemName);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData) return;
    
    try {
      // Determine if this is an add or edit operation based on whether formData has an id
      const isEdit = formData.id;
      
      // Extract the ID from idSistem if it's an object, otherwise use it directly
      const sistemId = formData.idSistem && typeof formData.idSistem === 'object'
        ? formData.idSistem.id
        : formData.idSistem;
      
      // Struktur Data sesuai permintaan
      const dataToSend = {
        menu: formData.menu,
        route: formData.route,
        urutan: parseInt(formData.urutan) || 0, // Convert to number
        icon: formData.icon,
        showFiture: formData.showFiture,
        status: formData.status,
        idSistem: parseInt(sistemId) || 0 // Convert to number
      };

      // Add ID only for edit operations
      if (isEdit) {
        dataToSend.id = formData.id;
      }

      await saveMenu(dataToSend);
      console.log(`Fitur ${isEdit ? 'updated' : 'saved'} successfully:`, dataToSend);
      
      setShowModal(false);
      setFormData(null);
      setSystemSearchTerm("");
      setIsSystemDropdownOpen(false);
      handleRefresh();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'saving'} fitur:`, error);
      alert(`Error ${formData.id ? 'updating' : 'saving'} fitur: ` + error.message);
    }
  };

  const handleExport = (data) => {
    return data.map(item => ({
      Menu: item.menu || '',
      Route: item.route || '',
      Order: item.urutan || '',
      Icon: item.icon || '',
      'Show Feature': item.showFiture || '',
      Status: item.status ? 'Active' : 'Inactive',
      'System ID': item.idSistem || '',
      'Created By': item.createdBy || '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
    }));
  };

  const columns = [
    { key: 'menu', label: 'Menu', searchable: true, sortable: true },
    { key: 'route', label: 'Route', searchable: true, sortable: true },
    { key: 'urutan', label: 'Order', searchable: true, sortable: true },
    {
      key: 'icon',
      label: 'Icon',
      searchable: true,
      sortable: true,
      render: (item) => (
        <span className="text-sm text-foreground">
          {item.icon || '-'}
        </span>
      )
    },
    {
      key: 'showFiture',
      label: 'Show Feature',
      searchable: true,
      sortable: true,
      render: (item) => (
        <span className="text-sm text-foreground">
          {item.showFiture || '-'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      isBoolean: true,
      trueLabel: 'Active',
      falseLabel: 'Inactive',
      render: (item) => (
        <span className={`px-2 py-1 rounded text-xs ${item.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.status ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'idSistem',
      label: 'System',
      searchable: true,
      sortable: true,
      render: (item) => {
        if (item.idSistem && typeof item.idSistem === 'object') {
            return item.idSistem.nama; // Ambil namanya saja
        }
        // If it's just an ID, find the system name
        const system = systems.find(s => s.id === item.idSistem);
        return system ? system.nama : item.idSistem; // Jika ternyata string/number, tampilkan apa adanya
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      render: (item) => (
        <ActionsCell item={item} onEdit={handleEditFitur} />
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <DataTable
        data={fiturs}
        columns={columns}
        title="Fitur Management"
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onAdd={handleAddNew}
        onExport={handleExport}
        refreshing={refreshing}
      />

      <EditModal
        showModal={showModal}
        formData={formData}
        systems={systems}
        systemSearchTerm={systemSearchTerm}
        isSystemDropdownOpen={isSystemDropdownOpen}
        setFormData={setFormData}
        setShowModal={setShowModal}
        setSystemSearchTerm={setSystemSearchTerm}
        setIsSystemDropdownOpen={setIsSystemDropdownOpen}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Fitur;