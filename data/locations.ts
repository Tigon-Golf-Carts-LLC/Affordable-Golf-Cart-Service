export interface ServiceLocation {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

export const serviceLocations: ServiceLocation[] = [
  {
    id: "dover-de",
    slug: "dover-de",
    name: "Dover, DE",
    address: "5158 N Dupont Hwy",
    city: "Dover",
    state: "Delaware",
    stateAbbr: "DE",
    zip: "19901",
    phone: "302-546-0010",
    lat: 39.22044318468275,
    lng: -75.57452048907642,
    googleMapsUrl: "https://www.google.com/maps?cid=12843447677705895190"
  },
  {
    id: "pocono-pa",
    slug: "pocono-pa",
    name: "Pocono Pines, PA",
    address: "1712 Pennsylvania 940",
    city: "Pocono Pines",
    state: "Pennsylvania",
    stateAbbr: "PA",
    zip: "18350",
    phone: "570-643-0152",
    lat: 41.10286354605563,
    lng: -75.48758590250345,
    googleMapsUrl: "https://www.google.com/maps?cid=17137841834562046914"
  },
  {
    id: "ocean-view-nj",
    slug: "ocean-view-nj",
    name: "Ocean View, NJ",
    address: "101 NJ-50",
    city: "Ocean View",
    state: "New Jersey",
    stateAbbr: "NJ",
    zip: "08230",
    phone: "609-840-0404",
    lat: 39.22254797811702,
    lng: -74.70417212536503,
    googleMapsUrl: "https://www.google.com/maps?cid=6446924254429489274"
  },
  {
    id: "hatfield-pa",
    slug: "hatfield-pa",
    name: "Hatfield, PA",
    address: "2333 Bethlehem Pike",
    city: "Hatfield",
    state: "Pennsylvania",
    stateAbbr: "PA",
    zip: "19440",
    phone: "215-595-8736",
    lat: 40.29839945958623,
    lng: -75.28308913039525,
    googleMapsUrl: "https://www.google.com/maps?cid=8221925612164093496"
  },
  {
    id: "scranton-pa",
    slug: "scranton-pa",
    name: "Scranton-Wilkes-Barre, PA",
    address: "1225 N Keyser Ave #2",
    city: "Scranton",
    state: "Pennsylvania",
    stateAbbr: "PA",
    zip: "18504",
    phone: "570-344-4443",
    lat: 41.4374075,
    lng: -75.6835104,
    googleMapsUrl: "https://www.google.com/maps?cid=13243686786001524416"
  },
  {
    id: "raleigh-nc",
    slug: "raleigh-nc",
    name: "Raleigh, NC",
    address: "2700 S Wilmington St",
    city: "Raleigh",
    state: "North Carolina",
    stateAbbr: "NC",
    zip: "27603",
    phone: "984-489-0296",
    lat: 35.7471032,
    lng: -78.6452007,
    googleMapsUrl: "https://www.google.com/maps?cid=14570072271497929915"
  },
  {
    id: "south-bend-in",
    slug: "south-bend-in",
    name: "South Bend, IN",
    address: "52129 State Road 933",
    city: "South Bend",
    state: "Indiana",
    stateAbbr: "IN",
    zip: "46637",
    phone: "574-703-0456",
    lat: 41.7360283,
    lng: -86.2511865,
    googleMapsUrl: "https://www.google.com/maps?cid=17532455648086849827"
  },
  {
    id: "gloucester-point-va",
    slug: "gloucester-point-va",
    name: "Gloucester Point, VA",
    address: "2810 George Washington Memorial Hwy",
    city: "Gloucester Point",
    state: "Virginia",
    stateAbbr: "VA",
    zip: "23072",
    phone: "804-792-0234",
    lat: 37.2850625,
    lng: -76.5074161,
    googleMapsUrl: "https://www.google.com/maps?cid=16682967888503617377"
  },
  {
    id: "bayville-nj",
    slug: "bayville-nj",
    name: "Bayville, NJ",
    address: "155 Atlantic City Blvd",
    city: "Bayville",
    state: "New Jersey",
    stateAbbr: "NJ",
    zip: "08721",
    phone: "732-908-7166",
    lat: 39.9277698,
    lng: -74.1748497,
    googleMapsUrl: "https://www.google.com/maps?cid=16812778070531162551"
  },
  {
    id: "waretown-nj",
    slug: "waretown-nj",
    name: "Waretown, NJ",
    address: "526 US-9",
    city: "Waretown",
    state: "New Jersey",
    stateAbbr: "NJ",
    zip: "08758",
    phone: "732-998-8146",
    lat: 39.7932,
    lng: -74.1951,
    googleMapsUrl: "https://www.google.com/maps?cid=11595558320608622005"
  },
  {
    id: "orangeburg-sc",
    slug: "orangeburg-sc",
    name: "Orangeburg, SC",
    address: "4166 North Rd",
    city: "Orangeburg",
    state: "South Carolina",
    stateAbbr: "SC",
    zip: "29118",
    phone: "803-596-0246",
    lat: 33.547201,
    lng: -80.9162039,
    googleMapsUrl: "https://www.google.com/maps?cid=17192321019507936230"
  },
  {
    id: "swanton-oh",
    slug: "swanton-oh",
    name: "Swanton, OH",
    address: "10420 Airport Hwy",
    city: "Swanton",
    state: "Ohio",
    stateAbbr: "OH",
    zip: "43558",
    phone: "419-402-8400",
    lat: 41.6013184,
    lng: -83.7926472,
    googleMapsUrl: "https://www.google.com/maps?cid=16517552730289967239"
  },
  {
    id: "lecanto-fl",
    slug: "lecanto-fl",
    name: "Lecanto, FL",
    address: "299 E. Gulf to Lake Hwy",
    city: "Lecanto",
    state: "Florida",
    stateAbbr: "FL",
    zip: "34461",
    phone: "352-453-0345",
    lat: 28.858622,
    lng: -82.4295381,
    googleMapsUrl: "https://www.google.com/maps?cid=4773802157529013859"
  },
  {
    id: "long-pond-pa",
    slug: "long-pond-pa",
    name: "Long Pond, PA",
    address: "4738 PA-115",
    city: "Long Pond",
    state: "Pennsylvania",
    stateAbbr: "PA",
    zip: "18334",
    phone: "570-580-0567",
    lat: 41.053988,
    lng: -75.534146,
    googleMapsUrl: "https://www.google.com/maps?cid=11714838830522733253"
  }
];

export function getLocationBySlug(slug: string): ServiceLocation | undefined {
  return serviceLocations.find(l => l.slug === slug);
}

export function getFullAddress(location: ServiceLocation): string {
  return `${location.address}, ${location.city}, ${location.stateAbbr} ${location.zip}`;
}

export function getDirectionsUrl(location: ServiceLocation): string {
  const address = encodeURIComponent(getFullAddress(location));
  return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestLocations(lat: number, lng: number, count: number = 3): Array<ServiceLocation & { distance: number }> {
  const locationsWithDistance = serviceLocations.map(location => ({
    ...location,
    distance: haversineDistance(lat, lng, location.lat, location.lng)
  }));
  
  locationsWithDistance.sort((a, b) => a.distance - b.distance);
  return locationsWithDistance.slice(0, count);
}

export function searchLocationsByText(query: string): ServiceLocation[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return serviceLocations.filter(location => 
    location.city.toLowerCase().includes(lowerQuery) ||
    location.state.toLowerCase().includes(lowerQuery) ||
    location.stateAbbr.toLowerCase() === lowerQuery ||
    location.zip.includes(lowerQuery) ||
    location.address.toLowerCase().includes(lowerQuery)
  );
}
