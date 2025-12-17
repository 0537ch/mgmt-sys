import React from 'react';

const DetailsModal = ({ showModal, item, setShowModal }) => {
  if (!showModal || !item) {
    return null;
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 z-10000 border border-border/50">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Endpoint Details</h3>
          <button
            className="text-muted-foreground hover:text-foreground text-2xl font-light leading-none"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{item.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{item.nama}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Number</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{item.noMenu}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Show in Sidebar</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {item.isSidebar ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <p className="text-sm text-foreground bg-muted/50 p-2 rounded">{item.fitur}</p>
            </div>

            {/* Endpoint Path */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Endpoint Path</label>
              <p className="text-sm text-foreground bg-muted/50 p-2 rounded font-mono break-all">{item.pathMenu}</p>
            </div>

            {/* System Information */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">System Information</label>
              <div className="bg-muted/50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">System ID:</span>
                    <p className="text-sm text-foreground">{item.idSistem || 'Not assigned'}</p>
                  </div>
                  {item.group_menu?.sistem && (
                    <div>
                      <span className="text-xs text-muted-foreground">System Name:</span>
                      <p className="text-sm text-foreground">{item.group_menu.sistem.nama}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Group Information */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Group Information</label>
              <div className="bg-muted/50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Group ID:</span>
                    <p className="text-sm text-foreground">{item.group_menu?.id || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Group Name:</span>
                    <p className="text-sm text-foreground">{item.group_menu?.nama || 'Not assigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timestamps</label>
              <div className="bg-gray-50 p-3 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">Created At:</span>
                    <p className="text-sm text-gray-900">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Updated At:</span>
                    <p className="text-sm text-gray-900">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'Not available'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-xs text-gray-500">Created By:</span>
                    <p className="text-sm text-gray-900">{item.createdBy || 'Not available'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Updated By:</span>
                    <p className="text-sm text-gray-900">{item.updatedBy || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-border bg-muted/50">
            <button
              type="button"
              className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded-md transition-colors"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;