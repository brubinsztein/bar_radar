import { Bar } from '../types';

// Cache to store OSM data by area
const osmCache: Record<string, any> = {};

export async function fetchOSMData(latitude: number, longitude: number, radius: number = 0.01): Promise<any> {
  const key = `${latitude},${longitude},${radius}`;
  if (osmCache[key]) {
    return osmCache[key];
  }

  // Modified query to only get nodes with tags
  const query = `[out:json][timeout:25];
    (
      node[amenity~'bar|pub'][~"^.*$"~"."](${latitude - radius},${longitude - radius},${latitude + radius},${longitude + radius});
      way[amenity~'bar|pub'][~"^.*$"~"."](${latitude - radius},${longitude - radius},${latitude + radius},${longitude + radius});
    );
    out body;
    >;
    out skel qt;`;
  
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    console.log('[OSM DEBUG] Fetching OSM data for area:', {
      lat: latitude,
      lon: longitude,
      radius
    });
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('[OSM DEBUG] OSM data received:', {
      elementCount: data.elements?.length,
      firstElement: data.elements?.[0]?.tags
    });
    
    osmCache[key] = data;
    return data;
  } catch (error) {
    console.error('Error fetching OSM data:', error);
    return null;
  }
}

export function enrichBarWithOSMData(bar: Bar, osmData: any): Bar {
  if (!osmData || !osmData.elements) {
    console.log(`[OSM DEBUG] No OSM data for ${bar.name}`);
    return bar;
  }

  console.log(`[OSM DEBUG] Looking for match for ${bar.name} at:`, {
    barLat: bar.location.latitude,
    barLon: bar.location.longitude
  });

  // Filter out way nodes and nodes without tags
  const validNodes = osmData.elements.filter((node: any) => 
    node.type === 'node' && node.tags && node.tags.name
  );

  // Find the closest OSM node that has tags and similar name
  const osmNode = validNodes.find((node: any) => {
    const nodeLat = parseFloat(node.lat);
    const nodeLon = parseFloat(node.lon);
    const barLat = bar.location.latitude;
    const barLon = bar.location.longitude;
    
    const latDiff = Math.abs(nodeLat - barLat);
    const lonDiff = Math.abs(nodeLon - barLon);
    const isCloseEnough = latDiff < 0.002 && lonDiff < 0.002; // ~200m threshold

    // Check name similarity - more lenient matching
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const barName = normalize(bar.name);
    const nodeName = normalize(node.tags.name);
    
    // Check if names share significant words
    const barWords = barName.split(/\s+/).filter(w => w.length > 2);
    const nodeWords = nodeName.split(/\s+/).filter(w => w.length > 2);
    const sharedWords = barWords.filter(word => nodeWords.includes(word));
    const isNameSimilar = sharedWords.length > 0 || 
                         barName.includes(nodeName) || 
                         nodeName.includes(barName);

    // Only log if both conditions are met
    if (isCloseEnough && isNameSimilar) {
      console.log(`[OSM DEBUG] Found potential match for ${bar.name}:`, {
        nodeName: node.tags?.name,
        nodeLat,
        nodeLon,
        latDiff,
        lonDiff,
        isNameSimilar,
        sharedWords,
        tags: node.tags
      });
    }

    return isCloseEnough && isNameSimilar;
  });

  if (osmNode && osmNode.tags) {
    console.log(`[OSM DEBUG] Matched ${bar.name} with OSM node:`, {
      osmName: osmNode.tags.name,
      opening_hours: osmNode.tags.opening_hours,
      allTags: osmNode.tags
    });

    bar.osmTags = {
      real_ale: osmNode.tags.real_ale === 'yes',
      real_fire: osmNode.tags.real_fire === 'yes',
      dog: osmNode.tags.dog === 'yes',
      wheelchair: osmNode.tags.wheelchair === 'yes',
      amenity: osmNode.tags.amenity,
      opening_hours: osmNode.tags.opening_hours,
    };
  } else {
    console.log(`[OSM DEBUG] No OSM match found for ${bar.name}`);
  }

  return bar;
}

export function osmNodeToBar(node: any): Bar | null {
  // Validate coordinates
  const lat = parseFloat(node.lat);
  const lon = parseFloat(node.lon);
  
  if (isNaN(lat) || isNaN(lon)) {
    console.warn('[OSM] Invalid coordinates in node:', node);
    return null;
  }

  return {
    id: `osm-${node.id}`,
    name: node.tags.name || 'Unnamed',
    location: {
      latitude: lat,
      longitude: lon,
    },
    address: node.tags['addr:full'] || node.tags['addr:street'] || '',
    rating: undefined,
    isOpen: undefined,
    placeId: `osm-${node.id}`,
    photos: [],
    priceLevel: undefined,
    vicinity: node.tags['addr:full'] || node.tags['addr:street'] || '',
    types: [node.tags.amenity].filter(Boolean),
    osmTags: {
      real_ale: node.tags.real_ale === 'yes',
      real_fire: node.tags.real_fire === 'yes',
      dog: node.tags.dog === 'yes',
      wheelchair: node.tags.wheelchair === 'yes',
      amenity: node.tags.amenity,
      opening_hours: node.tags.opening_hours,
    },
  };
} 