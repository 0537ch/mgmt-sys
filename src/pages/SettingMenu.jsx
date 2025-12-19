import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAccGroup, saveAccGroupMenus } from '../api/settingmenu';
import { Button } from '@/components/ui/button';
import { Check, Minus,Folder, } from "lucide-react";

const SettingMenu = () => {
  const { accGroupId } = useParams();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedMenus, setCheckedMenus] = useState([]);
  const [accGroupData, setAccGroupData] = useState(null);

  useEffect(() => {
    if (accGroupId) {
      loadAccGroupData();
      loadMenuData();
    }
  }, [accGroupId]);

  const loadAccGroupData = async () => {
    try {
      setAccGroupData({ codeGroup: accGroupId });
    } catch (err) {
      console.error('Error loading account group data:', err);
      setError(err.message || 'Failed to load account group data');
    }
  };

  const loadMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAccGroup(accGroupId);
      console.log('API Response:', data); 
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
      
      // Show success message (optional)
      // You could add a toast notification here if you have one
      console.log('Menu settings saved successfully');
    } catch (err) {
      console.error('Error saving menu settings:', err);
      setError(err.message || 'Failed to save menu settings');
    }
  };
  const getGroupState = (groupMenus) => {
    const allIds = groupMenus.map(m => m.id);
    const checkedCount = allIds.filter(id => checkedMenus.includes(id)).length;
    
    if (checkedCount === 0) return 'unchecked';
    if (checkedCount === allIds.length) return 'checked';
    return 'indeterminate';
  };
  const handleGroupClick = (groupMenus) => {
    const allIds = groupMenus.map(m => m.id);
    const state = getGroupState(groupMenus);
    
    if (state === 'checked') {
      // Uncheck all
      setCheckedMenus(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      // Check all (even if indeterminate)
      setCheckedMenus(prev => {
        const newIds = allIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const renderMenuHierarchy = (systems) => {
    return systems.map((system, systemIndex) => (
      <div key={systemIndex} className="mb-6">
        {/* Level 1: System (Root) */}
        <div className="flex items-center gap-2 mb-2">
           <div className="p-1.5 bg-primary/10 rounded text-primary">
              <Folder className="w-4 h-4" />
           </div>
           <h3 className="font-bold text-foreground">{system.nama}</h3>
        </div>

        {/* Tree Container */}
        <div className="relative ml-3 pl-6 border-l border-border pb-2">
          {system.group_menu?.map((group, groupIndex) => {
            const isLastGroup = groupIndex === system.group_menu.length - 1;
            
            // 1. Calculate the state for THIS group (Checked, Unchecked, or Indeterminate)
            const groupState = getGroupState(group.menus);
            
            return (
              <div key={groupIndex} className="relative pt-4">
                {/* 90-Degree Connector */}
                <div className="absolute -left-6 top-7 w-6 h-px bg-border"></div>
                {isLastGroup && (
                    <div className="absolute -left-6.25 top-7 bottom-0 w-1 bg-background"></div>
                )}

                {/* Level 2: Group Item (Select All Click Area) */}
                <div className="flex items-center gap-2">
                  <div 
                    className="relative z-10 flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md pr-3 transition-colors select-none"
                    // 2. CONNECT THE CLICK HANDLER HERE
                    onClick={() => handleGroupClick(group.menus)}
                  >
                    {/* Checkbox Visual */}
                    <div className={`
                      w-4 h-4 rounded border flex items-center justify-center transition-colors
                      ${groupState === 'checked' ? 'bg-primary border-primary text-primary-foreground' : 
                        groupState === 'indeterminate' ? 'bg-primary/20 border-primary text-primary' : 
                        'border-input bg-card'}
                    `}>
                       {/* 3. RENDER THE ICON BASED ON STATE */}
                       {groupState === 'checked' && <Check className="w-3 h-3" />}
                       {groupState === 'indeterminate' && <Minus className="w-3 h-3" />}
                    </div>
                    <span className="text-sm font-semibold">{group.nama}</span>
                  </div>
                </div>

                {/* Level 3: Menus */}
                <div className="relative ml-3 pl-6 border-l border-border pt-1">
                  {group.menus?.map((menu, menuIndex) => {
                    const isLastMenu = menuIndex === group.menus.length - 1;

                    return (
                      <div key={menuIndex} className="relative pt-3 pb-1">
                        <div className="absolute -left-6 top-6 w-6 h-px bg-border"></div>
                        {isLastMenu && (
                            <div className="absolute -left-[25px] top-6 bottom-0 w-1 bg-background"></div>
                        )}

                        <label className="flex items-center gap-2 relative z-10 cursor-pointer hover:bg-muted/50 p-1.5 rounded-md pr-3 transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-input text-primary accent-primary"
                            checked={checkedMenus.includes(menu.id)}
                            onChange={() => handleMenuToggle(menu.id)}
                          />
                          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {menu.nama}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ));
  };


  return (
    <div className="h-full flex flex-col p-6 max-w-4xl mx-auto bg-background">
      {/* 1. Header Section */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Setting Menu</h1>
      </div>
      
      {/* 2. Scrollable Tree Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          menuData && renderMenuHierarchy(menuData.all_menu)
        )}
      </div>

      {/* 3. Footer / Action Buttons (Fixed at bottom) */}
      <div className="shrink-0 pt-4 mt-4 border-t border-border flex justify-between items-center bg-background">
        <div className="text-sm text-muted-foreground">
           {checkedMenus.length} items selected
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/account-group')}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingMenu;