import React, { useState, useEffect } from 'react';
import { fetchAccGroup, saveAccGroupMenus } from '../../api/settingmenu';

const Settingmenu = ({ showModal, setShowModal, accGroupData }) => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedMenus, setCheckedMenus] = useState([]);

  useEffect(() => {
    if (showModal && accGroupData) {
      loadMenuData();
    }
  }, [showModal, accGroupData]);

  const loadMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAccGroup(accGroupData.codeGroup);
      console.log('API Response:', data); // Debug log to see the actual response
      setMenuData(data);
      
      // Initialize checked menus from the API response
      if (data && data.checked) {
        setCheckedMenus(data.checked);
      }
    } catch (err) {
      console.error('API Error:', err); // Debug log to see the error
      setError(err.message || 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = (menuId) => {
    setCheckedMenus(prev => {
      if (prev.includes(menuId)) {
        // Remove from checked array
        return prev.filter(id => id !== menuId);
      } else {
        // Add to checked array
        return [...prev, menuId];
      }
    });
  };

  const handleSelectAllInGroup = (groupMenus) => {
    const allMenuIds = groupMenus.map(menu => menu.id);
    const allChecked = allMenuIds.every(id => checkedMenus.includes(id));
    
    if (allChecked) {
      // Deselect all in this group
      setCheckedMenus(prev => prev.filter(id => !allMenuIds.includes(id)));
    } else {
      // Select all in this group
      setCheckedMenus(prev => {
        const newChecked = [...prev];
        allMenuIds.forEach(id => {
          if (!newChecked.includes(id)) {
            newChecked.push(id);
          }
        });
        return newChecked;
      });
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving checked menus:', checkedMenus);
      await saveAccGroupMenus(accGroupData.codeGroup, checkedMenus);
      
      // Optionally refresh the data after saving
      await loadMenuData();
      
      setShowModal(false);
    } catch (err) {
      console.error('Error saving menu settings:', err);
      setError(err.message || 'Failed to save menu settings');
    }
  };

  const renderMenuHierarchy = (systems) => {
    return systems.map((system, systemIndex) => (
      <div key={systemIndex} className="mb-6">
        <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3">
            <h4 className="font-semibold text-lg text-primary-foreground">
              {system.nama}
            </h4>
          </div>
          <div className="p-4">
            {system.group_menu && system.group_menu.length > 0 ? (
              system.group_menu.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  <div className="bg-muted border-l-4 border-border rounded-md overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground px-3 py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-md text-secondary-foreground">
                            {group.nama}
                          </h5>
                        </div>
                        {group.menus && group.menus.length > 0 && (
                          <button
                              onClick={() => handleSelectAllInGroup(group.menus)}
                              className="bg-accent hover:bg-accent/80 text-accent-foreground px-2 py-1 rounded text-xs transition-colors"
                            >
                              {group.menus.every(menu => checkedMenus.includes(menu.id)) ? 'Deselect All' : 'Select All'}
                            </button>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {group.menus && group.menus.length > 0 ? (
                        <div className="space-y-2">
                          {group.menus.map((menu, menuIndex) => (
                            <div key={menuIndex} className="flex items-center p-3 bg-card rounded-md border border-border hover:shadow-sm transition-shadow">
                              <input
                                type="checkbox"
                                id={`menu-${menu.id}`}
                                checked={checkedMenus.includes(menu.id)}
                                onChange={() => handleMenuToggle(menu.id)}
                                className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-2 mr-3"
                              />
                             
                              <div className="flex-1">
                                <div className="font-medium text-foreground">{menu.nama}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground italic bg-muted rounded-md">
                          No menus available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground italic bg-muted rounded-md">
                No groups available
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
      
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] m-4 z-[10000]">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium text-foreground">
            Setting Menu
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground text-2xl font-light leading-none"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading menu data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error: {error}</p>
            </div>
          ) : menuData ? (
            <div>
              <h4 className="font-semibold text-lg mb-4 text-foreground">
                Menu Hierarchy
              </h4>
              {menuData && menuData.all_menu && menuData.all_menu.length > 0 ? (
                renderMenuHierarchy(menuData.all_menu)
              ) : (
                <p className="text-muted-foreground">No menu data available</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu data available</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-6 border-t bg-muted">
          <div className="text-sm text-muted-foreground">
            {menuData && menuData.all_menu && (
              <span>
                {checkedMenus.length} menus selected
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-2 rounded-md transition-colors"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settingmenu;