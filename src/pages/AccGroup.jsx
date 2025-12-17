import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAccGroup, saveAccGroup } from '../api/accgroupApi';
import { fetchAllSystems } from '../api/SystemApi';
import { fetchMenuGroup } from '../api/menugroupApi';
import DataTable from '../components/common/DataTable';
import EditModal from '../components/accountgroup/EditModal';
import ActionsCell from '../components/accountgroup/ActionsCell';
import Settingmenu from '../components/accountgroup/Settingmenu';
import SettingFeature from '../components/accountgroup/SettingFeature';


const AccGroup = () => {
  const [accGroups, setAccGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    namaGroup: '',
    codeGroup: '',
    idSistem: '',
    isAdministrator: false,
    status: true
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccGroup, setEditingAccGroup] = useState(null);
  const [systems, setSystems] = useState([]);
  const [endpointGroups, setEndpointGroups] = useState([]);
  const [showSettingmenuModal, setShowSettingmenuModal] = useState(false);
  const [showSettingFeatureModal, setShowSettingFeatureModal] = useState(false);
  const [selectedAccGroupForTree, setSelectedAccGroupForTree] = useState(null);
  
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
      const [accGroupData, systemsData, endpointGroupsData] = await Promise.all([
        fetchAccGroup(),
        fetchAllSystems(),
        fetchMenuGroup()
      ]);
      setAccGroups(accGroupData);
      setSystems(systemsData);
      setEndpointGroups(endpointGroupsData);
      // Set default idSistem to first available system if exists
      if (systemsData.length > 0) {
        setAddFormData(prev => ({ ...prev, idSistem: systemsData[0].id }));
      }
    } catch (error) {
      console.error("Error loading account groups:", error);
      setError(error.message || 'Failed to load account groups');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAccGroup();
      setAccGroups(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    // Reset form data
    setAddFormData({
      namaGroup: '',
      codeGroup: '',
      idSistem: systems.length > 0 ? systems[0].id : '',
      isAdministrator: false,
      status: true
    });
  };

  const handleAddSubmit = async (data) => {
    try {
      // The data parameter contains the form values from EditModal
      const response = await saveAccGroup(data);
      console.log("Account Group saved successfully:", response);
      
      // Reset form after successful submission
      setAddFormData({
        namaGroup: '',
        codeGroup: '',
        idSistem: systems.length > 0 ? systems[0].id : '',
        isAdministrator: false,
        status: true
      });
      
      // Close the modal
      setShowAddModal(false);
      
      // Refresh the data to show the new item
      handleRefresh();
    } catch (error) {
      console.error("Error saving account group:", error);
      alert('Error saving account group: ' + error.message);
    }
  };

  const handleEditAccGroup = (accGroup) => {
    setEditingAccGroup(accGroup);
    setShowEditModal(true);
  };

  const handleShowSettingmenu = (accGroup) => {
    setSelectedAccGroupForTree(accGroup);
    setShowSettingmenuModal(true);
  };

  const handleShowSettingFeature = (accGroup) => {
    setSelectedAccGroupForTree(accGroup);
    setShowSettingFeatureModal(true);
  };

  const handleUpdateAccGroup = async (data) => {
    try {
      // The data parameter contains the updated form values from EditModal
      await saveAccGroup(data);
      console.log("Account Group updated successfully");
      
      // Refresh the data to show updated changes
      handleRefresh();
      
      setEditingAccGroup(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating account group:", error);
      alert('Error updating account group: ' + error.message);
    }
  };

  const handleExport = (data) => {
    const exportData = data.map(item => ({
      ID: item.id,
      'Group Name': item.namaGroup,
      'Group Code': item.codeGroup,
      'System ID': item.idSistem,
      'Is Administrator': item.isAdministrator ? 'Yes' : 'No',
      Status: item.status ? 'Active' : 'Inactive',
      'Created By': item.createdBy || '',
      'Updated By': item.updatedBy || '',
      'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
      'Updated At': item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ''
    }));

    // This will be handled by the DataTable component's default export
    return exportData;
  };

  // Column configuration for account group data
  const columns = [
    {
      key: 'namaGroup',
      label: 'Group Name',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'codeGroup',
      label: 'Group Code',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'idSistem',
      label: 'System ID',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'isAdministrator',
      label: 'Administrator',
      searchable: true,
      sortable: true,
      exportable: true,
      isBoolean: true,
      trueLabel: 'Yes',
      falseLabel: 'No',
      trueColor: 'bg-purple-100 text-purple-800',
      falseColor: 'bg-gray-100 text-gray-800'
    },
    {
      key: 'status',
      label: 'Status',
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
      render: (item) => <ActionsCell item={item} onEdit={handleEditAccGroup} onShowSettingmenu={handleShowSettingmenu} onShowSettingFeature={handleShowSettingFeature} />
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <DataTable
        data={accGroups}
        columns={columns}
        title="Account Group Management"
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onExport={handleExport}
        refreshing={refreshing}
        showAddButton={true}
        onAdd={handleAddNew}
      />

      {/* Add Account Group Modal */}
      <EditModal
        showModal={showAddModal}
        formData={addFormData}
        systems={systems}
        endpointGroups={endpointGroups}
        setFormData={setAddFormData}
        setShowModal={setShowAddModal}
        handleSubmit={handleAddSubmit}
        isEdit={false}
      />
      {/* Edit Account Group Modal */}
      <EditModal
        showModal={showEditModal}
        formData={editingAccGroup}
        systems={systems}
        endpointGroups={endpointGroups}
        setFormData={setEditingAccGroup}
        setShowModal={setShowEditModal}
        handleSubmit={handleUpdateAccGroup}
        isEdit={true}
      />
      
      {/* Settingmenu Modal */}
      <Settingmenu
        showModal={showSettingmenuModal}
        setShowModal={setShowSettingmenuModal}
        accGroupData={selectedAccGroupForTree}
      />
      
      {/* SettingFeature Modal */}
      <SettingFeature
        showModal={showSettingFeatureModal}
        setShowModal={setShowSettingFeatureModal}
        accGroupData={selectedAccGroupForTree}
      />
    </div>
  );
};

export default AccGroup;