'use client';

import React from 'react';
import { IColor } from '@/types';
import { availableColors } from '@/data/colors';

interface ColorPickerProps {
  selectedColor: IColor | null;
  onColorChange: (color: IColor) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const groupedColors = availableColors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, IColor[]>);

  const categoryLabels = {
    standard: 'Standard Colors',
    metallic: 'Metallic Finish',
    premium: 'Premium Colors',
    special: 'Special Edition'
  };

  const categoryIcons = {
    standard: '⚪',
    metallic: '✨',
    premium: '💎',
    special: '🏆'
  };

  const categoryOrder = ['standard', 'metallic', 'premium', 'special'];

  return (
    <div className="space-y-6">
      {categoryOrder.map((category) => {
        const colors = groupedColors[category];
        if (!colors || colors.length === 0) return null;
        
        return (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <h3 className="text-sm font-semibold text-gray-900">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </h3>
              {category !== 'standard' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Premium
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => {
                const isSelected = selectedColor?.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => onColorChange(color)}
                    className={`relative group ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''} rounded-lg transition-all hover:scale-105`}
                    data-testid={`color-button-${color.id}`}
                  >
                    <div
                      className="w-full h-16 rounded-lg shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden"
                      style={{ backgroundColor: color.hexCode }}
                    >
                      {/* Metallic effect overlay */}
                      {category === 'metallic' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-60" />
                      )}
                      {/* Special edition badge */}
                      {category === 'special' && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600" />
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                    {isSelected && (
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {color.name}
                      </p>
                      {color.price > 0 ? (
                        <p className="text-xs text-green-600 font-semibold">
                          +₹{color.price.toLocaleString('en-IN')}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Included</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {selectedColor && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{selectedColor.name}</span>
            {selectedColor.price > 0 && (
              <span className="text-sm font-medium text-gray-900">
                +₹{selectedColor.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};