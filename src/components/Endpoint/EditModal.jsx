import React, { useState, useEffect } from 'react';

const EditModal = ({
  showModal,
  formData,
  menuGroups,
  groupSearchTerm,
  isGroupDropdownOpen,
  setFormData,
  setShowModal,
  setGroupSearchTerm,
  setIsGroupDropdownOpen,
  handleSubmit
}) => {
  if (!showModal) {
    return null;
  }

  // Determine if this is an edit operation based on whether formData has an id
  const isEdit = formData && formData.id;

  const getFilteredGroups = () => {
    return menuGroups.filter((group) =>
      group.nama.toLowerCase().includes(groupSearchTerm.toLowerCase())
    );
  };

  const handleSelectGroup = (group) => {
    setFormData({ ...formData, group_menu: group.id });
    setGroupSearchTerm(group.nama);
    setIsGroupDropdownOpen(false);
  };

  const handleCloseForm = () => {
    setShowModal(false);
    if (!isEdit) {
      // Reset form data only for add mode
      setFormData({
        isSidebar: false,
        nama: '',
        fitur: '',
        pathMenu: '',
        group_menu: ''
      });
    }
    setGroupSearchTerm("");
    setIsGroupDropdownOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 z-10000 border border-border/50">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            {isEdit ? 'Edit Endpoint' : 'Add New Menu'}
          </h3>
          <button className="text-muted-foreground hover:text-foreground text-2xl font-light leading-none" onClick={handleCloseForm}>×</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Input Nama */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Endpoint Name</label>
              <input
                type="text"
                className="w-full border border-input bg-background p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.nama || ''}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                required
              />
            </div>

            {/* Input Fitur */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
              <input
                type="text"
                className="w-full border border-input bg-background p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.fitur || ''}
                onChange={(e) => setFormData({...formData, fitur: e.target.value})}
                required
              />
            </div>

            {/* Input Path */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Endpoint Path</label>
              <input
                type="text"
                className="w-full border border-input bg-background p-2 rounded focus:ring-2 focus:ring-ring focus:outline-none"
                value={formData.pathMenu || ''}
                onChange={(e) => setFormData({...formData, pathMenu: e.target.value})}
                required
              />
            </div>

            {/* Searchable Dropdown: Menu Group */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Endpoint Group</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8"
                  placeholder="Search group..."
                  value={groupSearchTerm}
                  onChange={(e) => {
                    setGroupSearchTerm(e.target.value);
                    setIsGroupDropdownOpen(true);
                  }}
                  onClick={() => setIsGroupDropdownOpen(true)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {isGroupDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsGroupDropdownOpen(false)}></div>
                    <ul className="absolute z-20 w-full mt-1 bg-popover border border-border rounded shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredGroups().length > 0 ? (
                        getFilteredGroups().map((group) => (
                          <li
                            key={group.id}
                            onClick={() => handleSelectGroup(group)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          >
                            {group.nama}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500 text-sm italic">No groups found</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Checkbox Sidebar */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                id="isSidebar"
                type="checkbox"
                className="h-5 w-5 text-primary border-input bg-background rounded focus:ring-ring"
                checked={formData.isSidebar || false}
                onChange={(e) => setFormData({...formData, isSidebar: e.target.checked})}
              />
              <label htmlFor="isSidebar" className="text-sm font-medium text-foreground select-none">
                Show in Sidebar (True/False)
              </label>
            </div>

            {isEdit ? (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-md transition-colors"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md transition-colors"
                  onClick={handleSubmit}
                >
                  Update Endpoint
                </button>
              </div>
            ) : (
              <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded w-full transition-colors">
                Save Data
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;