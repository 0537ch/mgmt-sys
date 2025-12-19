import React, { useState, useEffect } from 'react';
import { fetchSettingFeature } from '../../api/settingfeature';

const SettingFeature = ({ showModal, setShowModal, accGroupData }) => {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState({});

  useEffect(() => {
    if (showModal && accGroupData) {
      loadFeatureData();
    }
  }, [showModal, accGroupData]);

  const loadFeatureData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettingFeature(accGroupData.id);
      setFeatureData(data);
      
      // Initialize selected features state
      if (data && data.data) {
        const initialSelections = {};
        data.data.forEach(feature => {
          initialSelections[feature.id] = false; // Default to unchecked
        });
        setSelectedFeatures(initialSelections);
      }
    } catch (err) {
      setError(err.message || 'Failed to load feature data');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
  };

  const handleSelectAll = () => {
    if (featureData && featureData.data) {
      const allSelected = featureData.data.every(feature => selectedFeatures[feature.id]);
      const newSelections = {};
      featureData.data.forEach(feature => {
        newSelections[feature.id] = !allSelected;
      });
      setSelectedFeatures(newSelections);
    }
  };

  const renderFeatureList = (features) => {
    return (
      <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-lg text-primary-foreground">
                Available Features
              </h4>
              <div className="text-xs text-primary-foreground/80">Total Features: {features.length}</div>
            </div>
            <button
              onClick={handleSelectAll}
              className="bg-card/20 hover:bg-card/30 text-card-foreground px-3 py-1 rounded text-sm transition-colors"
            >
              {features.every(feature => selectedFeatures[feature.id]) ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
        <div className="p-4">
          {features && features.length > 0 ? (
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-card rounded-md border border-border hover:bg-muted transition-colors">
                  <input
                    type="checkbox"
                    id={`feature-${feature.id}`}
                    checked={selectedFeatures[feature.id] || false}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary focus:ring-2 mr-3"
                  />
                  <label htmlFor={`feature-${feature.id}`} className="flex-1 cursor-pointer">
                    <div className="font-medium text-foreground">{feature.menu}</div>
                    <div className="text-sm text-muted-foreground">Route: {feature.route}</div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground italic bg-muted rounded-md">
              No features available
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
      
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] m-4 z-[10000]">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">
            Setting Feature
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
              <p className="text-muted-foreground">Loading feature data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error: {error}</p>
            </div>
          ) : featureData ? (
            <div>
              <h4 className="font-semibold text-lg mb-4 text-foreground">
                Feature List
              </h4>
              {featureData && featureData.data && featureData.data.length > 0 ? (
                renderFeatureList(featureData.data)
              ) : (
                <p className="text-muted-foreground">No feature data available</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No feature data available</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-6 border-t border-border bg-muted">
          <div className="text-sm text-muted-foreground">
            {featureData && featureData.data && (
              <span>
                {Object.values(selectedFeatures).filter(Boolean).length} of {featureData.data.length} features selected
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
              onClick={() => {
                console.log('Selected features:', selectedFeatures);
                // Here you can add logic to save the selected features
                setShowModal(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingFeature;