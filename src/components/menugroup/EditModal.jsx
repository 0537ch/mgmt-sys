import React from 'react';

const EditModal = ({ editingMenuGroup, onSave, onCancel, systems }) => {
  const [formData, setFormData] = React.useState({
    nama: editingMenuGroup?.nama || '',
    idSistem: editingMenuGroup?.idSistem || (systems.length > 0 ? systems[0].id : ''),
    status: editingMenuGroup?.status !== undefined ? editingMenuGroup.status : true
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...(editingMenuGroup?.id && { id: editingMenuGroup.id }),
      ...formData
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 z-10000 border border-border/50">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            {editingMenuGroup?.id ? 'Edit Menu Group' : 'Add New Menu Group'}
          </h3>
          <button
            className="text-muted-foreground hover:text-foreground text-2xl font-light leading-none"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Menu Name</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">System</label>
              <select
                value={formData.idSistem}
                onChange={(e) => handleChange('idSistem', parseInt(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {systems.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    formData.status ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-primary-foreground transition-transform ${
                      formData.status ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-foreground">
                  {formData.status ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 p-6 border-border ">
            <button
              type="button"
              className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-md transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md transition-colors"
            >
              {editingMenuGroup?.id ? 'Update Menu Group' : 'Save Menu Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;