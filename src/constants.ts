import { SmartSeat, UrbanInsight } from './types';

export const INITIAL_SEATS: SmartSeat[] = [
  { id: 'S1', status: 'occupied', location: { lat: 24.7136, lng: 46.6753 }, lastOccupied: '2026-02-28T05:00:00Z', temperature: 32, sunlight: 85 },
  { id: 'S2', status: 'folded', location: { lat: 24.7140, lng: 46.6760 }, lastOccupied: '2026-02-28T04:30:00Z', temperature: 34, sunlight: 90 },
  { id: 'S3', status: 'shaded', location: { lat: 24.7130, lng: 46.6745 }, lastOccupied: '2026-02-28T05:15:00Z', temperature: 28, sunlight: 40 },
  { id: 'S4', status: 'folded', location: { lat: 24.7150, lng: 46.6770 }, lastOccupied: '2026-02-28T03:00:00Z', temperature: 35, sunlight: 95 },
];

export const MOCK_INSIGHTS: UrbanInsight[] = [
  { id: 'I1', title: 'Walkability Hotspot', description: 'High pedestrian flow detected near Section 4. Recommend adding 2 more smart seats.', category: 'walkability', impact: 'high' },
  { id: 'I2', title: 'Heat Island Alert', description: 'Temperature spikes detected. Shading mechanisms deployed automatically.', category: 'environment', impact: 'medium' },
  { id: 'I3', title: 'Social Hub Potential', description: 'Users often gather near the Digital Fountain. Suggesting a pop-up retail zone.', category: 'social', impact: 'medium' },
];
