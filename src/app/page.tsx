'use client';

import React, { useState, useEffect } from 'react';
import { CarScene } from '@/components/CarScene';
import { ColorPicker } from '@/components/ColorPicker';
import { VehicleSelector } from '@/components/VehicleSelector';
import { WheelSelector } from '@/components/WheelSelector';
import { ExteriorAccessorySelector } from '@/components/ExteriorAccessorySelector';
import { IVehicle, IColor, IWheel, IExteriorAccessory } from '@/types';
import { loadCustomization, saveCustomization, clearCustomization } from '@/lib/localStorage';
import { vehicles } from '@/data/vehicles';

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
  const [selectedWheel, setSelectedWheel] = useState<IWheel | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<IExteriorAccessory[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load saved customizations on mount
  useEffect(() => {
    const savedVehicle = loadCustomization('vehicle') as IVehicle | null;
    const savedColor = loadCustomization('color') as IColor | null;
    const savedWheel = loadCustomization('wheel') as IWheel | null;
    const savedAccessories = loadCustomization('accessories') as IExteriorAccessory[] | null;
    
    if (savedVehicle) setSelectedVehicle(savedVehicle);
    if (savedColor) setSelectedColor(savedColor);
    if (savedWheel) setSelectedWheel(savedWheel);
    if (savedAccessories) setSelectedAccessories(savedAccessories);
  }, []);

  // Save customizations whenever they change
  useEffect(() => {
    if (selectedVehicle) {
      saveCustomization('vehicle', selectedVehicle);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (selectedColor) {
      saveCustomization('color', selectedColor);
    }
  }, [selectedColor]);

  useEffect(() => {
    if (selectedWheel) {
      saveCustomization('wheel', selectedWheel);
    }
  }, [selectedWheel]);

  useEffect(() => {
    saveCustomization('accessories', selectedAccessories);
  }, [selectedAccessories]);

  const handleVehicleSelect = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    // Reset accessories when vehicle changes (compatibility)
    setSelectedAccessories([]);
  };

  const handleColorChange = (color: IColor) => {
    setSelectedColor(color);
  };

  const handleWheelChange = (wheel: IWheel) => {
    setSelectedWheel(wheel);
  };

  const handleAccessoryToggle = (accessory: IExteriorAccessory) => {
    setSelectedAccessories(prev => {
      const isSelected = prev.some(a => a.id === accessory.id);
      if (isSelected) {
        return prev.filter(a => a.id !== accessory.id);
      } else {
        return [...prev, accessory];
      }
    });
  };

  const handleReset = () => {
    clearCustomization();
    setSelectedVehicle(null);
    setSelectedColor(null);
    setSelectedWheel(null);
    setSelectedAccessories([]);
  };

  // Calculate total price
  const totalPrice = (selectedVehicle?.basePrice || 0) + 
                    (selectedColor?.price || 0) + 
                    (selectedWheel?.price || 0) + 
                    selectedAccessories.reduce((sum, acc) => sum + acc.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Auto Customizer</h1>
              <span className="ml-3 text-sm text-gray-500">Professional 3D Car Configurator</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset Configuration
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Professional Configuration Panel */}
        <aside className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 bg-white shadow-lg overflow-hidden`}>
          <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Vehicle Selection Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle</h2>
                <VehicleSelector
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                />
              </div>

              {/* Color Selection Section */}
              {selectedVehicle && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Exterior Color</h2>
                  <ColorPicker
                    selectedColor={selectedColor}
                    onColorChange={handleColorChange}
                  />
                </div>
              )}

              {/* Wheel Selection Section */}
              {selectedVehicle && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Wheels & Tires</h2>
                  <WheelSelector
                    selectedWheel={selectedWheel}
                    onWheelChange={handleWheelChange}
                  />
                </div>
              )}

              {/* Exterior Accessories Section */}
              {selectedVehicle && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Exterior Accessories</h2>
                  <ExteriorAccessorySelector
                    selectedVehicle={selectedVehicle}
                    selectedAccessories={selectedAccessories}
                    onAccessoryToggle={handleAccessoryToggle}
                  />
                </div>
              )}

              {/* Price Summary */}
              {selectedVehicle && (
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">₹{selectedVehicle.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {selectedColor && selectedColor.price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{selectedColor.name}</span>
                        <span className="font-medium">+₹{selectedColor.price.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    
                    {selectedWheel && selectedWheel.price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{selectedWheel.name}</span>
                        <span className="font-medium">+₹{selectedWheel.price.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    
                    {selectedAccessories.map((accessory) => (
                      <div key={accessory.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">{accessory.name}</span>
                        <span className="font-medium">+₹{accessory.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-base font-semibold text-gray-900">Total Price</span>
                      <span className="text-xl font-bold text-blue-600">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    {(selectedColor?.price || 0) + (selectedWheel?.price || 0) + selectedAccessories.reduce((sum, acc) => sum + acc.price, 0) > 0 && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Savings vs individual purchase: ₹{Math.floor(totalPrice * 0.05).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* 3D Viewer Area */}
        <main className="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Floating Toggle for Mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 left-4 z-10 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 3D Scene */}
          <div className="w-full h-full">
            <CarScene
              vehicle={selectedVehicle}
              colorHex={selectedColor?.hexCode || '#FFFFFF'}
            />
          </div>

          {/* Help Text Overlay */}
          {!selectedVehicle && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-md">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Vehicle to Begin</h3>
                <p className="text-gray-600">Choose a car model from the configuration panel to start customizing your dream vehicle.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}