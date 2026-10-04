import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, validateGeofence } from './geo';
import { GeofenceLocation } from '../types';

describe('Geo Utilities', () => {
  it('calculates zero distance for identical coordinates', () => {
    const dist = calculateHaversineDistance(-6.917464, 107.619123, -6.917464, 107.619123);
    expect(dist).toBe(0);
  });

  it('calculates accurate distance between Jakarta and Bandung (~118-125km)', () => {
    // Jakarta approx (-6.2088, 106.8456), Bandung approx (-6.9175, 107.6191)
    const dist = calculateHaversineDistance(-6.2088, 106.8456, -6.9175, 107.6191);
    expect(dist).toBeGreaterThan(110000);
    expect(dist).toBeLessThan(130000);
  });

  const mockOffice: GeofenceLocation = {
    id: 'geo-1',
    name: 'Kantor Pusat Bandung',
    city: 'Bandung',
    address: 'Jl. Asia Afrika No. 10',
    latitude: -6.917464,
    longitude: 107.619123,
    radiusMeters: 100,
    active: true,
    totalEmployees: 45,
  };

  it('validates user inside geofence radius', () => {
    // Exact same coordinates, GPS accuracy 10m
    const result = validateGeofence(
      { latitude: -6.917464, longitude: 107.619123 },
      10,
      [mockOffice]
    );
    expect(result.isWithin).toBe(true);
    expect(result.distanceMeters).toBeLessThan(10);
    expect(result.targetGeofence?.name).toBe('Kantor Pusat Bandung');
  });

  it('rejects user far outside geofence radius', () => {
    // Jakarta user trying to check-in to Bandung office
    const result = validateGeofence(
      { latitude: -6.2088, longitude: 106.8456 },
      10,
      [mockOffice]
    );
    expect(result.isWithin).toBe(false);
    expect(result.distanceMeters).toBeGreaterThan(1000);
    expect(result.message).toContain('Di luar radius');
  });

  it('rejects when GPS accuracy exceeds maximum threshold', () => {
    // Accurate coordinates but poor GPS (e.g. 150m accuracy error)
    const result = validateGeofence(
      { latitude: -6.917464, longitude: 107.619123 },
      150,
      [mockOffice],
      50
    );
    expect(result.accuracyAcceptable).toBe(false);
    expect(result.message).toContain('Akurasi GPS rendah');
  });
});
