import SunCalc from 'suncalc';

interface SunExposureResult {
  isInSun: boolean;
  azimuth: number;
  elevation: number;
}

export function calculateSunExposure(
  latitude: number,
  longitude: number,
  datetime: string
): SunExposureResult {
  const date = new Date(datetime);
  const sunPosition = SunCalc.getPosition(date, latitude, longitude);
  
  // Convert radians to degrees
  const azimuth = (sunPosition.azimuth * 180 / Math.PI + 360) % 360;
  const elevation = sunPosition.altitude * 180 / Math.PI;
  
  // Consider a location to be in sun if elevation is above 10 degrees
  const isInSun = elevation > 10;
  
  return {
    isInSun,
    azimuth,
    elevation,
  };
} 