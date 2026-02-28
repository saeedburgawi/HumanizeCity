export interface SmartSeat {
  id: string;
  status: 'occupied' | 'folded' | 'shaded';
  location: { lat: number; lng: number };
  lastOccupied: string;
  temperature: number;
  sunlight: number;
}

export interface UserStats {
  steps: number;
  target: number;
  rewards: number;
  points: number;
}

export interface UrbanInsight {
  id: string;
  title: string;
  description: string;
  category: 'walkability' | 'environment' | 'social';
  impact: 'high' | 'medium' | 'low';
}
