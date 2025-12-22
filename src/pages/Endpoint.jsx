import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenu, saveMenu } from '../api/menuApi';
import { fetchMenuGroup } from '../api/menugroupApi';
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
  
  // Data for Dropdowns
  const [menuGroups, setMenuGroups] = useState([]);
  const [loadingMenuGroups, setLoadingMenuGroups] = useState(true);

  // Searchable Dropdown States
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  
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
      const [menuData, menuGroupsData] = await Promise.all([
        fetchMenu(),
        fetchMenuGroup()
      ]);
      setMenus(menuData);
      setMenuGroups(menuGroupsData);
    } catch (error) {
      console.error("Error loading menus:", error);
      setError(error.message || 'Failed to load menus');
    } finally {
      setLoading(false);
      setLoadingMenuGroups(false);
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
    setGroupSearchTerm("");
    setFormData({
      isSidebar: false,
      nama: '',
      fitur: '',
      pathMenu: '',
      group_menu: ''
    });
    setShowModal(true);
  };

  const handleEditMenu = (menu) => {
    setFormData(menu);
    // Extract group name properly - handle both ID and object cases
    let groupName = "";
    if (menu.group_menu) {
      if (typeof menu.group_menu === 'object') {
        groupName = menu.group_menu.nama;
      } else {
        // If it's just an ID, find the group name
        const currentGroup = menuGroups.find(g => g.id === menu.group_menu);
        groupName = currentGroup ? currentGroup.nama : "";
      }
    }
    setGroupSearchTerm(groupName);
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
      const groupId = formData.group_menu && typeof formData.group_menu === 'object'
        ? formData.group_menu.id
        : formData.group_menu;
      
      // Struktur Data sesuai permintaan
      const dataToSend = {
        isSidebar: formData.isSidebar, // boolean
        nama: formData.nama,
        fitur: formData.fitur,
        pathMenu: formData.pathMenu,
        group_menu: groupId, // ID only
        noMenu: groupId // Use group_menu ID as noMenu
      };

      // Add ID only for edit operations
      if (isEdit) {
        dataToSend.id = formData.id;
      }

      await saveMenu(dataToSend);
      console.log(`Menu ${isEdit ? 'updated' : 'saved'} successfully:`, dataToSend);
      
      setShowModal(false);
      setFormData(null);
      setGroupSearchTerm("");
      setIsGroupDropdownOpen(false);
      handleRefresh();
    } catch (error) {
      console.error(`Error ${formData.id ? 'updating' : 'saving'} menu:`, error);
      alert(`Error ${formData.id ? 'updating' : 'saving'} menu: ` + error.message);
    }
  };

  const handleExport = (data) => {
    return data.map(item => ({
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
    { key: 'nama', label: 'Nama', searchable: true, sortable: true },
    { key: 'fitur', label: 'Modul', searchable: true, sortable: true },
    { key: 'pathMenu', label: 'Path', searchable: true, sortable: true },
    { 
      key: 'group_menu', 
      label: 'Menu Group', 
      searchable: true, 
      sortable: true,
      render: (item) => {
        if (item.group_menu && typeof item.group_menu === 'object') {
            return item.group_menu.nama; // Ambil namanya saja
        }
        return item.group_menu; // Jika ternyata string/number, tampilkan apa adanya
      }
    },
    {
      key: 'isSidebar',
      label: 'Is Sidebar?',
      searchable: true,
      sortable: true,
      exportable: true,
      isBoolean: true,
      trueLabel: 'Yes',
      falseLabel: 'No',
      trueColor: 'bg-emerald-100 text-emerald-800',
      falseColor: 'bg-slate-100 text-slate-800'
    },
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
        menuGroups={menuGroups}
        groupSearchTerm={groupSearchTerm}
        isGroupDropdownOpen={isGroupDropdownOpen}
        setFormData={setFormData}
        setShowModal={setShowModal}
        setGroupSearchTerm={setGroupSearchTerm}
        setIsGroupDropdownOpen={setIsGroupDropdownOpen}
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