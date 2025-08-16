'use client';

import React from 'react';
import { IVehicle } from '@/types';

interface VehicleSelectorProps {
  vehicles: IVehicle[];
  selectedVehicle: IVehicle | null;
  onVehicleSelect: (vehicle: IVehicle) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No vehicles available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicle?.id === vehicle.id;
        return (
          <button
            key={vehicle.id}
            onClick={() => onVehicleSelect(vehicle)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">
                  {vehicle.brand} {vehicle.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {vehicle.year} • {vehicle.category}
                </p>
                <p className="text-sm font-medium text-gray-700 mt-1">
                  ₹{vehicle.basePrice.toLocaleString('en-IN')}
                </p>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};