import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WheelSelector } from '@/components/WheelSelector';
import { availableWheels } from '@/data/wheels';

describe('WheelSelector', () => {
  const mockOnWheelChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders wheel categories', () => {
    render(<WheelSelector selectedWheel={null} onWheelChange={mockOnWheelChange} />);
    
    expect(screen.getByText('Standard Wheels')).toBeInTheDocument();
    expect(screen.getByText('Sport Wheels')).toBeInTheDocument();
    expect(screen.getByText('Luxury Wheels')).toBeInTheDocument();
    expect(screen.getByText('Performance Wheels')).toBeInTheDocument();
  });

  it('renders wheel options from data', () => {
    render(<WheelSelector selectedWheel={null} onWheelChange={mockOnWheelChange} />);
    
    // Check for some specific wheels from our data
    expect(screen.getByText('16" Standard Alloy')).toBeInTheDocument();
    expect(screen.getByText('18" M Sport Alloy')).toBeInTheDocument();
  });

  it('shows wheel prices correctly', () => {
    render(<WheelSelector selectedWheel={null} onWheelChange={mockOnWheelChange} />);
    
    // Standard wheels should show "Included"
    expect(screen.getAllByText('Included')).toHaveLength(2); // 2 standard wheels
    
    // Premium wheels should show prices
    expect(screen.getByText('+₹85,000')).toBeInTheDocument(); // M Sport wheel
  });

  it('calls onWheelChange when a wheel is clicked', () => {
    render(<WheelSelector selectedWheel={null} onWheelChange={mockOnWheelChange} />);
    
    const wheelButton = screen.getByTestId('wheel-button-bmw-16-standard');
    fireEvent.click(wheelButton);
    
    expect(mockOnWheelChange).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'bmw-16-standard',
        name: '16" Standard Alloy'
      })
    );
  });

  it('shows selected wheel with proper styling', () => {
    const selectedWheel = availableWheels[0]; // First wheel
    render(<WheelSelector selectedWheel={selectedWheel} onWheelChange={mockOnWheelChange} />);
    
    const selectedButton = screen.getByTestId(`wheel-button-${selectedWheel.id}`);
    expect(selectedButton).toHaveClass('ring-2', 'ring-offset-2', 'ring-blue-500');
  });

  it('displays selected wheel summary', () => {
    const selectedWheel = availableWheels.find(w => w.price > 0) || null; // Find a paid wheel
    render(<WheelSelector selectedWheel={selectedWheel} onWheelChange={mockOnWheelChange} />);
    
    expect(screen.getByText('Selected Wheel')).toBeInTheDocument();
    expect(screen.getByText(selectedWheel!.name)).toBeInTheDocument();
  });

  it('shows upgrade badges for non-standard categories', () => {
    render(<WheelSelector selectedWheel={null} onWheelChange={mockOnWheelChange} />);
    
    const upgradeBadges = screen.getAllByText('Upgrade');
    expect(upgradeBadges.length).toBeGreaterThan(0); // Should have upgrade badges for sport, luxury, performance
  });
});
