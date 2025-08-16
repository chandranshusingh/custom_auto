'use client';

import React from 'react';
import { IWheel } from '@/types';
import { availableWheels } from '@/data/wheels';

interface WheelSelectorProps {
  selectedWheel: IWheel | null;
  onWheelChange: (wheel: IWheel) => void;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'standard': return 'Standard Wheels';
    case 'sport': return 'Sport Wheels';
    case 'luxury': return 'Luxury Wheels';
    case 'performance': return 'Performance Wheels';
    default: return 'Other Wheels';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'standard': return '⚪';
    case 'sport': return '🏁';
    case 'luxury': return '💎';
    case 'performance': return '🏆';
    default: return '🛞';
  }
};

const getFinishColor = (finish: string) => {
  switch (finish) {
    case 'chrome': return '#C0C0C0';
    case 'black': return '#1A1A1A';
    case 'gunmetal': return '#41424C';
    case 'matte': return '#6B7280';
    case 'glossy': return '#E5E7EB';
    default: return '#E5E7EB';
  }
};

export const WheelSelector: React.FC<WheelSelectorProps> = ({
  selectedWheel,
  onWheelChange,
}) => {
  // Group wheels by category
  const wheelsByCategory = availableWheels.reduce((acc, wheel) => {
    if (!acc[wheel.category]) {
      acc[wheel.category] = [];
    }
    acc[wheel.category].push(wheel);
    return acc;
  }, {} as Record<string, IWheel[]>);

  // Define category order
  const categoryOrder = ['standard', 'sport', 'luxury', 'performance'];

  return (
    <div className="space-y-6">
      {categoryOrder.map((category) => {
        const wheels = wheelsByCategory[category];
        if (!wheels || wheels.length === 0) return null;

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <h3 className="text-sm font-semibold text-gray-900">
                {getCategoryLabel(category)}
              </h3>
              {category !== 'standard' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Upgrade
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {wheels.map((wheel) => {
                const isSelected = selectedWheel?.id === wheel.id;
                
                return (
                  <button
                    key={wheel.id}
                    onClick={() => onWheelChange(wheel)}
                    className={`relative group ${
                      isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    } rounded-lg transition-all hover:scale-105 p-3 bg-white border border-gray-200 hover:border-gray-300`}
                    data-testid={`wheel-button-${wheel.id}`}
                  >
                    {/* Wheel Visual */}
                    <div className="flex justify-center mb-3">
                      <div
                        className="w-16 h-16 rounded-full border-4 flex items-center justify-center relative"
                        style={{ 
                          borderColor: getFinishColor(wheel.finish),
                          backgroundColor: getFinishColor(wheel.finish)
                        }}
                      >
                        {/* Spoke pattern simulation */}
                        <div className="absolute inset-2 rounded-full border-2 border-gray-400 opacity-60" />
                        <div className="absolute inset-4 rounded-full border border-gray-500 opacity-40" />
                        
                        {/* Size indicator */}
                        <span className="text-xs font-bold text-white drop-shadow">
                          {wheel.size}&quot;
                        </span>
                        
                        {/* Material badge */}
                        {wheel.style === 'carbon-fiber' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs text-white">C</span>
                          </div>
                        )}
                        {wheel.style === 'forged' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs text-white">F</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Wheel Info */}
                    <div className="text-center space-y-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {wheel.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {wheel.brand} • {wheel.finish}
                      </p>
                      <p className="text-xs text-gray-500">
                        {wheel.size}&quot; × {wheel.width}mm
                      </p>
                      {wheel.price > 0 ? (
                        <p className="text-sm text-green-600 font-semibold">
                          +₹{wheel.price.toLocaleString('en-IN')}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Included</p>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
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
      
      {selectedWheel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Selected Wheel</span>
              {selectedWheel.price > 0 && (
                <span className="text-sm font-medium text-gray-900">
                  +₹{selectedWheel.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{selectedWheel.name}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{selectedWheel.design}</span>
              <span>{selectedWheel.style} • {selectedWheel.finish}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};