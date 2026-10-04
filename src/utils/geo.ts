/**
 * Geolocation & Geofencing Utilities
 * Implements the Haversine formula to compute great-circle distance between two GPS coordinates.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeofenceTarget {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface GeofenceValidationResult {
  isWithin: boolean;
  distanceMeters: number;
  targetGeofence: GeofenceTarget | null;
  accuracyAcceptable: boolean;
  message: string;
}

/**
 * Calculates distance in meters between two lat/lon pairs using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Validates whether user coordinates are within any of the provided geofences
 */
export function validateGeofence(
  userCoords: Coordinates,
  accuracyMeters: number,
  geofences: GeofenceTarget[],
  maxAccuracyThreshold: number = 50
): GeofenceValidationResult {
  const accuracyAcceptable = accuracyMeters <= maxAccuracyThreshold;

  if (geofences.length === 0) {
    return {
      isWithin: false,
      distanceMeters: Infinity,
      targetGeofence: null,
      accuracyAcceptable,
      message: 'Tidak ada data geofence kantor aktif.',
    };
  }

  // Find nearest geofence
  let nearestGeofence: GeofenceTarget = geofences[0];
  let minDistance = Infinity;

  for (const gf of geofences) {
    const dist = calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      gf.latitude,
      gf.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearestGeofence = gf;
    }
  }

  const isWithin = minDistance <= nearestGeofence.radiusMeters;

  let message = '';
  if (!accuracyAcceptable) {
    message = `Akurasi GPS rendah (${Math.round(accuracyMeters)}m > batas ${maxAccuracyThreshold}m). Pastikan GPS berada di area terbuka.`;
  } else if (isWithin) {
    message = `Di dalam area ${nearestGeofence.name} (jarak ${minDistance}m, radius ${nearestGeofence.radiusMeters}m).`;
  } else {
    message = `Di luar radius kantor ${nearestGeofence.name} (jarak ${minDistance}m > radius ${nearestGeofence.radiusMeters}m).`;
  }

  return {
    isWithin,
    distanceMeters: minDistance,
    targetGeofence: nearestGeofence,
    accuracyAcceptable,
    message,
  };
}
