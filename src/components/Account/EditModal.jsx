import React, { useState, useEffect } from 'react';

const EditModal = ({
  showModal,
  formData,
  setFormData,
  setShowModal,
  handleSubmit,
  isEdit = false
}) => {
  const [internalFormData, setInternalFormData] = useState({
    nipp: formData?.nipp || '',
    email: formData?.email || ''
  });

  // Update internal form data when formData prop changes (for edit mode)
  useEffect(() => {
    if (formData) {
      setInternalFormData({
        nipp: formData.nipp || '',
        email: formData.email || ''
      });
    }
  }, [formData]);

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
      ...internalFormData
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
            {isEdit ? 'Edit Account' : 'Add New Account'}
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
              <label className="block text-sm font-medium text-foreground">NIPP</label>
              <input
                type="text"
                required
                value={internalFormData.nipp}
                onChange={(e) => handleChange('nipp', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={internalFormData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
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
              {isEdit ? 'Update Account' : 'Save Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;