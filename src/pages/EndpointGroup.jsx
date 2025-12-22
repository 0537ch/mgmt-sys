import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenuGroup, saveMenuGroup } from '../api/menugroupApi';
import { fetchAllSystems } from '../api/SystemApi';
import DataTable from '../components/common/DataTable';
import EditModal from '../components/menugroup/EditModal';
import DetailsModal from '../components/menugroup/DetailsModal';
import ActionsCell from '../components/menugroup/ActionsCell';

const Dashboard = () => {
  const [menuGroups, setMenuGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingMenuGroup, setEditingMenuGroup] = useState(null);
  const [detailsMenuGroup, setDetailsMenuGroup] = useState(null);
  const [systems, setSystems] = useState([]);
  const [addFormData, setAddFormData] = useState({
    nama: '',
    idSistem: '',
    status: true
  });
  const [loadingSystems, setLoadingSystems] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load initial data
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuData, systemsData] = await Promise.all([
        fetchMenuGroup(),
        fetchAllSystems()
      ]);
      setMenuGroups(menuData);
      setSystems(systemsData);
      // Set default idSistem to first available system if exists
      if (systemsData.length > 0) {
        setAddFormData(prev => ({ ...prev, idSistem: systemsData[0].id }));
      }
    } catch (error) {
      console.error("Error loading menu groups:", error);
      setError(error.message || 'Failed to load menu groups');
    } finally {
      setLoading(false);
      setLoadingSystems(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchMenuGroup();
      setMenuGroups(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    // Create a new empty menu group object for the form
    const newMenuGroup = {
      nama: '',
      idSistem: systems.length > 0 ? systems[0].id : '',
      status: true
    };
    setEditingMenuGroup(newMenuGroup);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    // Reset form data
    setAddFormData({
      nama: '',
      idSistem: systems.length > 0 ? systems[0].id : '',
      status: true
    });
    // Reset editingMenuGroup to null
    setEditingMenuGroup(null);
  };

  const handleEditMenuGroup = (menuGroup) => {
    setEditingMenuGroup(menuGroup);
    setShowEditModal(true);
  };

  const handleShowDetails = (menuGroup) => {
    setDetailsMenuGroup(menuGroup);
    setShowDetailsModal(true);
  };

  const handleCancelEdit = () => {
    setEditingMenuGroup(null);
    setShowEditModal(false);
  };

  const handleCloseDetails = () => {
    setDetailsMenuGroup(null);
    setShowDetailsModal(false);
  };

  const handleUpdateMenuGroup = async (data) => {
    try {
      // The data parameter contains the updated form values from EditModal
      const dataToSend = {
        id: data.id,
        nama: data.nama,
        idSistem: data.idSistem,
        status: data.status
      };
      
      await saveMenuGroup(dataToSend);
      
      // Refresh the data to show updated changes
      handleRefresh();
      
      setEditingMenuGroup(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating menu group:", error);
      alert('Error updating menu group: ' + error.message);
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      // Create the data object in the format expected by the API
      const dataToSend = {
        nama: data.nama,
        idSistem: data.idSistem,
        status: data.status,
        isAdministrator: data.isAdministrator || false
      };
      
      const response = await saveMenuGroup(dataToSend);
      // Reset form after successful submission
      setAddFormData({
        nama: '',
        idSistem: systems.length > 0 ? systems[0].id : '',
        status: true
      });
      // Close the modal
      setShowAddForm(false);
      // Refresh the data to show the new item
      handleRefresh();
    } catch (error) {
      console.error("Error saving menu group:", error);
      // You might want to show an error message to the user
    }
  };

  const handleExport = (data) => {
    const exportData = data.map(item => ({
      'Endpoint Group': item.nama,
      'System': item.sistem?.nama || '-',
      Status: item.status ? 'Active' : 'Inactive',
      'Administrator': item.isAdministrator ? 'Yes' : 'No',
      'Created By': item.createdBy || '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
    }));

  // This will be handled by DataTable component's default export
    return exportData;
  };

  // Column configuration for endpoint group data
  const columns = [
    {
      key: 'nama',
      label: 'Nama',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'sistem.nama',
      label: 'Sistem',
      searchable: true,
      sortable: true,
      exportable: true,
      render: (item) => item.sistem?.nama || '-'
    },
    {
      key: 'status',
      label: 'Is Active?',
      searchable: true,
      sortable: true,
      exportable: true,
      isBoolean: true,
      trueLabel: 'Active',
      falseLabel: 'Inactive',
      trueColor: 'bg-green-100 text-green-800',
      falseColor: 'bg-red-100 text-red-800'
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      sortable: false,
      exportable: false,
      render: (item) => <ActionsCell item={item} onEdit={handleEditMenuGroup} onShowDetails={handleShowDetails} />
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <DataTable
        data={menuGroups}
        columns={columns}
        title="Endpoint Group"
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onAdd={handleAddNew}
        onExport={handleExport}
        refreshing={refreshing}
      />
      
      {/* Add Menu Form Modal */}
      {showAddForm && (
        <EditModal
          editingMenuGroup={editingMenuGroup}
          onSave={handleAddSubmit}
          onCancel={handleCloseForm}
          systems={systems}
        />
      )}
      
      {/* Edit Menu Group Modal */}
      {showEditModal && editingMenuGroup && (
        <EditModal
          editingMenuGroup={editingMenuGroup}
          onSave={handleUpdateMenuGroup}
          onCancel={handleCancelEdit}
          systems={systems}
        />
      )}
      
      <DetailsModal
        detailsMenuGroup={detailsMenuGroup}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default Dashboard;

