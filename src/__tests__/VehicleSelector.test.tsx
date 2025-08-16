import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { VehicleSelector } from '@/components/VehicleSelector';
import { vehicles } from '@/data/vehicles'; // Import centralized data

describe('VehicleSelector', () => {
  const mockOnVehicleSelect = jest.fn();
  const mockVehicles = vehicles; // Use centralized data for tests

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button for each vehicle option', () => {
    render(
      <VehicleSelector
        vehicles={mockVehicles}
        selectedVehicle={null}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // Should show a button for each vehicle
    const vehicleButtons = screen.getAllByRole('button');
    expect(vehicleButtons).toHaveLength(mockVehicles.length);

    // Check that vehicle names are present in the buttons
    expect(screen.getByText(/BMW X3/)).toBeInTheDocument();
    expect(screen.getByText(/BMW 5 Series/)).toBeInTheDocument();
  });

  it('calls onVehicleSelect with the correct vehicle when a button is clicked', () => {
    render(
      <VehicleSelector
        vehicles={mockVehicles}
        selectedVehicle={null}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // Find and click the button for the first vehicle
    const firstVehicleButton = screen.getByText(/BMW X3/);
    fireEvent.click(firstVehicleButton);

    // The component should call onVehicleSelect with the corresponding vehicle data
    expect(mockOnVehicleSelect).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('highlights the selected vehicle', () => {
    const selectedVehicle = mockVehicles[1]; // Select the second vehicle
    render(
      <VehicleSelector
        vehicles={mockVehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // The button for the selected vehicle should have a specific style (e.g., a border)
    const selectedButton = screen.getByText(/BMW 3 Series/).closest('button');
    expect(selectedButton).toHaveClass('border-blue-500');
  });

  it('shows correct vehicle names, details, and formatted prices', () => {
    render(
      <VehicleSelector
        vehicles={mockVehicles}
        selectedVehicle={null}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // Scope search to the first vehicle card
    const firstVehicleCard = screen.getByText(/BMW X3/).closest('button');
    expect(within(firstVehicleCard!).getByText(/2024 • suv/)).toBeInTheDocument();
    expect(within(firstVehicleCard!).getByText('₹65,00,000')).toBeInTheDocument();
  });

  it('handles an empty vehicle list gracefully', () => {
    render(
      <VehicleSelector
        vehicles={[]}
        selectedVehicle={null}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // The component should not render any buttons and perhaps show a message
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
    expect(screen.getByText(/No vehicles available/i)).toBeInTheDocument();
  });

  it('displays vehicle category and fuel type information correctly', () => {
    render(
      <VehicleSelector
        vehicles={mockVehicles}
        selectedVehicle={null}
        onVehicleSelect={mockOnVehicleSelect}
      />
    );

    // Scope search to individual vehicle cards to avoid ambiguity
    const x3Card = screen.getByText(/BMW X3/).closest('button');
    expect(within(x3Card!).getByText(/2024 • suv/)).toBeInTheDocument();

    const series3Card = screen.getByText(/BMW 3 Series/).closest('button');
    expect(within(series3Card!).getByText(/2024 • sedan/)).toBeInTheDocument();
  });
});
