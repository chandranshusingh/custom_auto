import { IColor } from '@/types';

export const availableColors: IColor[] = [
  // Standard Colors (No Extra Cost)
  { id: 'pearl-white', name: 'Pearl White', hexCode: '#FAFAFA', category: 'standard', price: 0, region: 'india' },
  { id: 'midnight-black', name: 'Midnight Black', hexCode: '#1A1A1A', category: 'standard', price: 0, region: 'india' },
  { id: 'storm-grey', name: 'Storm Grey', hexCode: '#6B7280', category: 'standard', price: 0, region: 'india' },
  
  // Metallic Colors (Premium)
  { id: 'silver-metallic', name: 'Silver Metallic', hexCode: '#C0C0C0', category: 'metallic', price: 25000, region: 'india' },
  { id: 'graphite-metallic', name: 'Graphite Metallic', hexCode: '#41424C', category: 'metallic', price: 25000, region: 'india' },
  { id: 'bronze-metallic', name: 'Bronze Metallic', hexCode: '#CD7F32', category: 'metallic', price: 30000, region: 'india' },
  { id: 'champagne-metallic', name: 'Champagne Metallic', hexCode: '#F7E7CE', category: 'metallic', price: 30000, region: 'india' },
  { id: 'titanium-metallic', name: 'Titanium Metallic', hexCode: '#878681', category: 'metallic', price: 35000, region: 'india' },
  
  // Premium Colors
  { id: 'deep-blue', name: 'Deep Ocean Blue', hexCode: '#003366', category: 'premium', price: 40000, region: 'india' },
  { id: 'ruby-red', name: 'Ruby Red', hexCode: '#9B111E', category: 'premium', price: 45000, region: 'india' },
  { id: 'forest-green', name: 'Forest Green', hexCode: '#228B22', category: 'premium', price: 40000, region: 'india' },
  { id: 'sunset-orange', name: 'Sunset Orange', hexCode: '#FF4500', category: 'premium', price: 50000, region: 'india' },
  
  // Special Edition Colors (Highest Premium)
  { id: 'bmw-estoril-blue', name: 'BMW Estoril Blue', hexCode: '#0066CC', category: 'special', price: 75000, region: 'india' },
  { id: 'alpine-white', name: 'Alpine White', hexCode: '#F8F8FF', category: 'special', price: 60000, region: 'india' },
  { id: 'jet-black', name: 'Jet Black', hexCode: '#0C0C0C', category: 'special', price: 65000, region: 'india' },
  { id: 'mineral-grey', name: 'Mineral Grey Metallic', hexCode: '#5D6D7E', category: 'special', price: 70000, region: 'india' },
  { id: 'storm-bay', name: 'Storm Bay', hexCode: '#4A6FA5', category: 'special', price: 80000, region: 'india' },
];
