import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAccounts, saveAccount } from '../api/accountApi';
import DataTable from '../components/common/DataTable';
import EditModal from '../components/Account/EditModal';
import ActionsCell from '../components/Account/ActionsCell';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
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
      const accountData = await fetchAccounts();
      setAccounts(accountData);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setError(error.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddNew = () => {
    setEditingAccount(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingAccount(null);
  };

  const handleAddSubmit = async (data) => {
    try {
      await saveAccount(data);
      console.log("Account saved successfully:", data);
      
      // Close modal
      setShowAddModal(false);
      setEditingAccount(null);
      
      // Refresh data to show new item
      handleRefresh();
    } catch (error) {
      console.error("Error saving account:", error);
      alert('Error saving account: ' + error.message);
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowEditModal(true);
  };

  const handleResetMacAddress = (account) => {
    // Placeholder functionality until API is available
    console.log("Reset MAC address for account:", account);
    // In the future, this would call an API endpoint
    // For now, the ActionsCell component shows an alert
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAccount(null);
  };

  const handleUpdateAccount = async (data) => {
    try {
      await saveAccount(data);
      console.log("Account updated successfully:", data);
      
      // Close modal
      setShowEditModal(false);
      setEditingAccount(null);
      
      // Refresh data to show updated changes
      handleRefresh();
    } catch (error) {
      console.error("Error updating account:", error);
      alert('Error updating account: ' + error.message);
    }
  };

  const handleExport = (data) => {
    const exportData = data.map(item => ({
      ID: item.id,
      NIPP: item.nipp,
      Email: item.email
    }));

    // This will be handled by DataTable component's default export
    return exportData;
  };

  // Column configuration for account data
  const columns = [
    {
      key: 'nipp',
      label: 'NIPP',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
      sortable: true,
      exportable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      searchable: false,
      sortable: false,
      exportable: false,
      render: (item) => (
        <ActionsCell
          item={item}
          onEdit={handleEditAccount}
          onResetMac={handleResetMacAddress}
        />
      )
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <DataTable
        data={accounts}
        columns={columns}
        title="Account Management"
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onExport={handleExport}
        refreshing={refreshing}
        showAddButton={true}
        onAdd={handleAddNew}
      />

      {/* Add Account Modal */}
      <EditModal
        showModal={showAddModal}
        formData={null}
        setShowModal={handleCloseAddModal}
        handleSubmit={handleAddSubmit}
        isEdit={false}
      />
      
      {/* Edit Account Modal */}
      <EditModal
        showModal={showEditModal}
        formData={editingAccount}
        setShowModal={handleCloseEditModal}
        handleSubmit={handleUpdateAccount}
        isEdit={true}
      />
    </div>
  );
};

export default Account;
