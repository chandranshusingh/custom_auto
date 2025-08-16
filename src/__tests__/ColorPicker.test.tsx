import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorPicker } from '@/components/ColorPicker';
import { availableColors } from '@/data/colors'; // Import centralized data

describe('ColorPicker', () => {
  const mockOnColorChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button for each available color', () => {
    render(<ColorPicker selectedColor={null} onColorChange={mockOnColorChange} />);

    // Should render a button for each color in the data file
    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons).toHaveLength(availableColors.length);
  });

  it('calls onColorChange with the correct color when a button is clicked', () => {
    render(<ColorPicker selectedColor={null} onColorChange={mockOnColorChange} />);

    // Find and click the button for "Deep Ocean Blue"
    const deepBlueButton = screen.getByTestId('color-button-deep-blue');
    fireEvent.click(deepBlueButton);

    // Find the corresponding color object from the data
    const deepBlueColor = availableColors.find(c => c.id === 'deep-blue');
    expect(mockOnColorChange).toHaveBeenCalledWith(deepBlueColor);
  });

  it('applies selected styles to the currently selected color', () => {
    const selectedColor = availableColors.find(c => c.id === 'ruby-red')!;
    render(
      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={mockOnColorChange}
      />
    );

    // The button for the selected color should have the ring class
    const rubyRedButton = screen.getByTestId('color-button-ruby-red');
    expect(rubyRedButton).toHaveClass('ring-2 ring-offset-2 ring-blue-500');

    // A non-selected button should not have the ring class
    const whiteButton = screen.getByTestId('color-button-pearl-white');
    expect(whiteButton).not.toHaveClass('ring-2 ring-offset-2 ring-blue-500');
  });

  it('displays the name and price of the selected color', () => {
    const selectedColor = availableColors.find(c => c.id === 'sunset-orange')!;
    render(
      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Should show the name and formatted price of the selected color
    expect(screen.getByText('Sunset Orange')).toBeInTheDocument();
    expect(screen.getByText('+₹30,000')).toBeInTheDocument();
  });

  it('does not display a price for free colors', () => {
    const selectedColor = availableColors.find(c => c.id === 'pearl-white')!;
    render(
      <ColorPicker
        selectedColor={selectedColor}
        onColorChange={mockOnColorChange}
      />
    );

    // Should show the name of the selected color
    expect(screen.getByText('Pearl White')).toBeInTheDocument();

    // Should not render a price since it's 0
    const priceElement = screen.queryByText(/^\+₹/);
    expect(priceElement).not.toBeInTheDocument();
  });

  it('renders color swatches with the correct background color', () => {
    render(<ColorPicker selectedColor={null} onColorChange={mockOnColorChange} />);
    
    const forestGreenButton = screen.getByTestId('color-button-forest-green');
    const swatch = forestGreenButton.querySelector('div[style]');

    // Check if the background color is set correctly via inline style
    expect(swatch).toHaveStyle({ backgroundColor: '#228B22' });
  });

  it('groups colors by category', () => {
    render(<ColorPicker selectedColor={null} onColorChange={mockOnColorChange} />);

    // Check for category headers
    expect(screen.getByText('Standard Colors')).toBeInTheDocument();
    expect(screen.getByText('Premium Colors')).toBeInTheDocument();
  });
});
