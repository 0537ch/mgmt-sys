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
    codeGroup: formData?.codeGroup || '',
    idSistem: formData?.idSistem || (systems.length > 0 ? systems[0].id : ''),
    isAdministrator: formData?.isAdministrator || false,
    status: formData?.status !== undefined ? formData.status : true
  });

  // Update internal form data when formData prop changes (for edit mode)
  React.useEffect(() => {
    if (formData) {
      setInternalFormData({
        namaGroup: formData.namaGroup || '',
        // Handle codeGroup data type conversion - ensure it's a string for the select value
        codeGroup: formData.codeGroup ? String(formData.codeGroup) : '',
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...(formData?.id && { id: formData.id }),
      ...internalFormData,
      // Ensure codeGroup is properly converted to integer if it exists
      codeGroup: internalFormData.codeGroup ? parseInt(internalFormData.codeGroup) : null
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
              <select
                required
                value={internalFormData.codeGroup || ''}
                onChange={(e) => handleChange('codeGroup', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Endpoint Group</option>
                {endpointGroups.map(endpointGroup => (
                  <option key={endpointGroup.id} value={endpointGroup.id}>
                    {endpointGroup.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">System</label>
              <select
                required
                value={internalFormData.idSistem || ''}
                onChange={(e) => handleChange('idSistem', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select System</option>
                {systems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.nama}
                  </option>
                ))}
              </select>
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
          <div className="flex justify-end space-x-3 p-6 border-t border-border bg-muted/50">
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