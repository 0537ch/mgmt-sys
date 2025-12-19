import React from 'react';

const EditModal = ({
  showModal,
  formData,
  systems,
  endpointGroups,
  setFormData,
  setShowModal,
  handleSubmit,
  isEdit = false
}) => {
  const [internalFormData, setInternalFormData] = React.useState({
    namaGroup: formData?.namaGroup || '',
    codeGroup: formData?.codeGroup ? (typeof formData.codeGroup === 'object' ? String(formData.codeGroup.id) : String(formData.codeGroup)) : '',
    idSistem: formData?.idSistem || (systems.length > 0 ? systems[0].id : ''),
    isAdministrator: formData?.isAdministrator || false,
    status: formData?.status !== undefined ? formData.status : true
  });

  // State for searchable dropdowns
  const [groupSearchTerm, setGroupSearchTerm] = React.useState('');
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = React.useState(false);
  const [systemSearchTerm, setSystemSearchTerm] = React.useState('');
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = React.useState(false);

  // Update internal form data when formData prop changes (for edit mode)
  React.useEffect(() => {
    if (formData) {
      setInternalFormData({
        namaGroup: formData.namaGroup || '',
        codeGroup: formData.codeGroup ? (typeof formData.codeGroup === 'object' ? String(formData.codeGroup.id) : String(formData.codeGroup)) : '',
        idSistem: formData.idSistem || (systems.length > 0 ? systems[0].id : ''),
        isAdministrator: formData.isAdministrator || false,
        status: formData.status !== undefined ? formData.status : true
      });
    }
  }, [formData, systems]);

  const handleChange = (field, value) => {
    setInternalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFilteredGroups = () => {
    return endpointGroups.filter((group) =>
      group.nama.toLowerCase().includes(groupSearchTerm.toLowerCase())
    );
  };

  const getFilteredSystems = () => {
    return systems.filter((system) =>
      system.nama.toLowerCase().includes(systemSearchTerm.toLowerCase())
    );
  };

  const handleSelectGroup = (group) => {
    setInternalFormData({
      ...internalFormData,
      codeGroup: group.id
    });
    setGroupSearchTerm(group.nama);
    setIsGroupDropdownOpen(false);
  };

  const handleSelectSystem = (system) => {
    setInternalFormData({
      ...internalFormData,
      idSistem: system.id
    });
    setSystemSearchTerm(system.nama);
    setIsSystemDropdownOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...(formData?.id && { id: formData.id }),
      ...internalFormData,
      // Ensure codeGroup is properly converted to string if it exists
      codeGroup: internalFormData.codeGroup ? String(internalFormData.codeGroup) : ''
    };

    handleSubmit(dataToSave);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
      
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 z-10000 border border-border/50">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            {isEdit ? 'Edit Account Group' : 'Add New Account Group'}
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground text-2xl font-light leading-none"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Group Name</label>
              <input
                type="text"
                required
                value={internalFormData.namaGroup}
                onChange={(e) => handleChange('namaGroup', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Endpoint Group</label>
              <div className="relative">
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
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
            <div>
              <label className="block text-sm font-medium text-foreground">System</label>
              <div className="relative">
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                  placeholder="Search system..."
                  value={systemSearchTerm}
                  onChange={(e) => {
                    setSystemSearchTerm(e.target.value);
                    setIsSystemDropdownOpen(true);
                  }}
                  onClick={() => setIsSystemDropdownOpen(true)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                {isSystemDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSystemDropdownOpen(false)}></div>
                    <ul className="absolute z-20 w-full mt-1 bg-popover border border-border rounded shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredSystems().length > 0 ? (
                        getFilteredSystems().map((system) => (
                          <li
                            key={system.id}
                            onClick={() => handleSelectSystem(system)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          >
                            {system.nama}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500 text-sm italic">No systems found</li>
                      )}
                    </ul>
                  </>
                )}
              </div>
            </div>
            {/* Is Administrator Toggle */}
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={internalFormData.isAdministrator}
                  onChange={(e) => handleChange('isAdministrator', e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-primary-foreground after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-foreground">Is Administrator</span>
              </label>
            </div>

            {/* Status Toggle */}
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={internalFormData.status}
                  onChange={(e) => handleChange('status', e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-primary-foreground after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-foreground">
                  {internalFormData.status ? 'Status Active' : 'Status Inactive'}
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t border-border">
            <button
              type="button"
              className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-md transition-colors"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md transition-colors"
            >
              {isEdit ? 'Update Account Group' : 'Save Account Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;