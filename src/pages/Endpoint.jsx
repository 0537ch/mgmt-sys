import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenu, saveMenu } from '../api/menuApi';
import DataTable from '../components/common/DataTable';
import ActionsCell from '../components/Endpoint/ActionsCell';
import EditModal from '../components/Endpoint/EditModal';
import DetailsModal from '../components/Endpoint/DetailsModal';

const Endpoint = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  

  
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
      const menuData = await fetchMenu();
      setMenus(menuData);
    } catch (error) {
      console.error("Error loading menus:", error);
      setError(error.message || 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchMenu();
      setMenus(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      isSidebar: false,
      nama: '',
      fitur: '',
      pathMenu: '',
      group_menu: '',
      noMenu: ''
    });
    setShowModal(true);
  };

  const handleEditMenu = (menu) => {
    setFormData({
      ...menu,
      group_menu: typeof menu.group_menu === 'object' ? menu.group_menu.id : menu.group_menu,
      noMenu: typeof menu.group_menu === 'object' ? menu.group_menu.id : menu.group_menu
    });
    setShowModal(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleSubmit = async () => {
    if (!formData) return;
    
    try {
      // Determine if this is an add or edit operation based on whether formData has an id
      const isEdit = formData.id;
      
      // Extract the ID from group_menu if it's an object, otherwise use it directly
      // Struktur Data sesuai permintaan
      const dataToSend = {
        isSidebar: formData.isSidebar, // boolean
        nama: formData.nama,
        fitur: formData.fitur,
        pathMenu: formData.pathMenu,
        group_menu: formData.group_menu, // ID only
        noMenu: formData.noMenu // Use group_menu ID as noMenu
      };

      // Add ID only for edit operations
      if (isEdit) {
        dataToSend.id = formData.id;
      }

      await saveMenu(dataToSend);
      console.log(`Menu ${isEdit ? 'updated' : 'saved'} successfully:`, dataToSend);
      
      setShowModal(false);
      setFormData(null);
      handleRefresh();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'saving'} menu:`, error);
      alert(`Error ${formData.id ? 'updating' : 'saving'} menu: ` + error.message);
    }
  };

  const handleExport = (data) => {
    return data.map(item => ({
      'System': item.group_menu.sistem,
      Name: item.nama || '',
      Feature: item.fitur || '',
      'Menu Path': item.pathMenu || '',
      'Group ID': item.group_menu || '',
      'Sidebar': item.isSidebar ? 'Yes' : 'No',
      'Created By': item.createdBy || '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
    }));
  };

  const columns = [
    { key: 'system', label: 'Sistem', searchable: true, sortable: true,
      render: (item) => {
        if (item.group_menu && typeof item.group_menu === 'object') {
            return item.group_menu.sistem.nama; 
        }
        return item.group_menu;
      }
    },
    { key: 'pathMenu', label: 'Endpoint', searchable: true, sortable: true },
    { key: 'fitur', label: 'Deskripsi', searchable: true, sortable: true },
    { key: 'baseurl', label: 'Base URL', searchable: true, sortable: true },
    { key: 'nama', label: 'Nama', searchable: true, sortable: true },
    { 
      key: 'actions', 
      label: 'Actions', 
      render: (item) => (
        <ActionsCell item={item} onEdit={handleEditMenu} onViewDetails={handleViewDetails} />
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <DataTable
        data={menus}
        columns={columns}
        title="Endpoint Management"
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
        setFormData={setFormData}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
      />

      <DetailsModal
        showModal={showDetailsModal}
        item={selectedItem}
        setShowModal={setShowDetailsModal}
      />
    </div>
  );
};

export default Endpoint;