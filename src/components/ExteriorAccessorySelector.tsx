'use client';

import React from 'react';
import { IExteriorAccessory, IVehicle } from '@/types';
import { availableAccessories } from '@/data/accessories';

interface ExteriorAccessorySelectorProps {
  selectedVehicle: IVehicle | null;
  selectedAccessories: IExteriorAccessory[];
  onAccessoryToggle: (accessory: IExteriorAccessory) => void;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'aesthetic': return 'Aesthetic Enhancements';
    case 'aerodynamic': return 'Aerodynamic Upgrades';
    case 'functional': return 'Functional Accessories';
    default: return 'Other Accessories';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'aesthetic': return '✨';
    case 'aerodynamic': return '🏁';
    case 'functional': return '🔧';
    default: return '🛠️';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'spoiler': return '🪃';
    case 'body-kit': return '🏎️';
    case 'side-skirts': return '📐';
    case 'front-lip': return '🔽';
    case 'rear-diffuser': return '🔼';
    case 'roof-rack': return '📦';
    case 'running-boards': return '🪜';
    default: return '🛠️';
  }
};

const getMaterialBadgeColor = (material: string) => {
  switch (material) {
    case 'carbon-fiber': return 'bg-black text-white';
    case 'aluminum': return 'bg-gray-400 text-white';
    case 'fiberglass': return 'bg-blue-500 text-white';
    case 'abs-plastic': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const ExteriorAccessorySelector: React.FC<ExteriorAccessorySelectorProps> = ({
  selectedVehicle,
  selectedAccessories,
  onAccessoryToggle,
}) => {
  // Filter accessories compatible with selected vehicle
  const compatibleAccessories = availableAccessories.filter(accessory => 
    !selectedVehicle || accessory.compatibility.includes(selectedVehicle.id)
  );

  // Group accessories by category
  const accessoriesByCategory = compatibleAccessories.reduce((acc, accessory) => {
    if (!acc[accessory.category]) {
      acc[accessory.category] = [];
    }
    acc[accessory.category].push(accessory);
    return acc;
  }, {} as Record<string, IExteriorAccessory[]>);

  // Define category order
  const categoryOrder = ['aesthetic', 'aerodynamic', 'functional'];

  if (!selectedVehicle) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Select a vehicle to view compatible accessories</p>
      </div>
    );
  }

  if (compatibleAccessories.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No accessories available for this vehicle</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoryOrder.map((category) => {
        const accessories = accessoriesByCategory[category];
        if (!accessories || accessories.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <h3 className="text-sm font-semibold text-gray-900">
                {getCategoryLabel(category)}
              </h3>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                Optional
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {accessories.map((accessory) => {
                const isSelected = selectedAccessories.some(a => a.id === accessory.id);
                
                return (
                  <button
                    key={accessory.id}
                    onClick={() => onAccessoryToggle(accessory)}
                    className={`relative group ${
                      isSelected ? 'ring-2 ring-offset-2 ring-purple-500 bg-purple-50' : 'bg-white'
                    } rounded-lg transition-all hover:scale-[1.02] p-4 border border-gray-200 hover:border-gray-300 text-left`}
                    data-testid={`accessory-button-${accessory.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Accessory Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">{getTypeIcon(accessory.type)}</span>
                        </div>
                      </div>

                      {/* Accessory Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {accessory.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {accessory.brand} • {accessory.type.replace('-', ' ')}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {accessory.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm font-semibold text-green-600">
                              +₹{accessory.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Material and Finish Badges */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getMaterialBadgeColor(accessory.material)}`}>
                            {accessory.material.replace('-', ' ')}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {accessory.finish.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {selectedAccessories.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Selected Accessories ({selectedAccessories.length})
              </span>
              <span className="text-sm font-medium text-gray-900">
                +₹{selectedAccessories.reduce((sum, acc) => sum + acc.price, 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="space-y-1">
              {selectedAccessories.map((accessory) => (
                <div key={accessory.id} className="flex justify-between text-xs text-gray-600">
                  <span>{accessory.name}</span>
                  <span>₹{accessory.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
