export interface USState {
  name: string;
  slug: string;
  abbreviation: string;
  lat: number;
  lng: number;
}

export const usStates: USState[] = [
  { name: "Alabama", slug: "alabama", abbreviation: "AL", lat: 32.806671, lng: -86.791130 },
  { name: "Alaska", slug: "alaska", abbreviation: "AK", lat: 61.370716, lng: -152.404419 },
  { name: "Arizona", slug: "arizona", abbreviation: "AZ", lat: 33.729759, lng: -111.431221 },
  { name: "Arkansas", slug: "arkansas", abbreviation: "AR", lat: 34.969704, lng: -92.373123 },
  { name: "California", slug: "california", abbreviation: "CA", lat: 36.116203, lng: -119.681564 },
  { name: "Colorado", slug: "colorado", abbreviation: "CO", lat: 39.059811, lng: -105.311104 },
  { name: "Connecticut", slug: "connecticut", abbreviation: "CT", lat: 41.597782, lng: -72.755371 },
  { name: "Delaware", slug: "delaware", abbreviation: "DE", lat: 39.318523, lng: -75.507141 },
  { name: "Florida", slug: "florida", abbreviation: "FL", lat: 27.766279, lng: -81.686783 },
  { name: "Georgia", slug: "georgia", abbreviation: "GA", lat: 33.040619, lng: -83.643074 },
  { name: "Hawaii", slug: "hawaii", abbreviation: "HI", lat: 21.094318, lng: -157.498337 },
  { name: "Idaho", slug: "idaho", abbreviation: "ID", lat: 44.240459, lng: -114.478828 },
  { name: "Illinois", slug: "illinois", abbreviation: "IL", lat: 40.349457, lng: -88.986137 },
  { name: "Indiana", slug: "indiana", abbreviation: "IN", lat: 39.849426, lng: -86.258278 },
  { name: "Iowa", slug: "iowa", abbreviation: "IA", lat: 42.011539, lng: -93.210526 },
  { name: "Kansas", slug: "kansas", abbreviation: "KS", lat: 38.526600, lng: -96.726486 },
  { name: "Kentucky", slug: "kentucky", abbreviation: "KY", lat: 37.668140, lng: -84.670067 },
  { name: "Louisiana", slug: "louisiana", abbreviation: "LA", lat: 31.169546, lng: -91.867805 },
  { name: "Maine", slug: "maine", abbreviation: "ME", lat: 44.693947, lng: -69.381927 },
  { name: "Maryland", slug: "maryland", abbreviation: "MD", lat: 39.063946, lng: -76.802101 },
  { name: "Massachusetts", slug: "massachusetts", abbreviation: "MA", lat: 42.230171, lng: -71.530106 },
  { name: "Michigan", slug: "michigan", abbreviation: "MI", lat: 43.326618, lng: -84.536095 },
  { name: "Minnesota", slug: "minnesota", abbreviation: "MN", lat: 45.694454, lng: -93.900192 },
  { name: "Mississippi", slug: "mississippi", abbreviation: "MS", lat: 32.741646, lng: -89.678696 },
  { name: "Missouri", slug: "missouri", abbreviation: "MO", lat: 38.456085, lng: -92.288368 },
  { name: "Montana", slug: "montana", abbreviation: "MT", lat: 46.921925, lng: -110.454353 },
  { name: "Nebraska", slug: "nebraska", abbreviation: "NE", lat: 41.125370, lng: -98.268082 },
  { name: "Nevada", slug: "nevada", abbreviation: "NV", lat: 38.313515, lng: -117.055374 },
  { name: "New Hampshire", slug: "new-hampshire", abbreviation: "NH", lat: 43.452492, lng: -71.563896 },
  { name: "New Jersey", slug: "new-jersey", abbreviation: "NJ", lat: 40.298904, lng: -74.521011 },
  { name: "New Mexico", slug: "new-mexico", abbreviation: "NM", lat: 34.840515, lng: -106.248482 },
  { name: "New York", slug: "new-york", abbreviation: "NY", lat: 42.165726, lng: -74.948051 },
  { name: "North Carolina", slug: "north-carolina", abbreviation: "NC", lat: 35.630066, lng: -79.806419 },
  { name: "North Dakota", slug: "north-dakota", abbreviation: "ND", lat: 47.528912, lng: -99.784012 },
  { name: "Ohio", slug: "ohio", abbreviation: "OH", lat: 40.388783, lng: -82.764915 },
  { name: "Oklahoma", slug: "oklahoma", abbreviation: "OK", lat: 35.565342, lng: -96.928917 },
  { name: "Oregon", slug: "oregon", abbreviation: "OR", lat: 44.572021, lng: -122.070938 },
  { name: "Pennsylvania", slug: "pennsylvania", abbreviation: "PA", lat: 40.590752, lng: -77.209755 },
  { name: "Rhode Island", slug: "rhode-island", abbreviation: "RI", lat: 41.680893, lng: -71.511780 },
  { name: "South Carolina", slug: "south-carolina", abbreviation: "SC", lat: 33.856892, lng: -80.945007 },
  { name: "South Dakota", slug: "south-dakota", abbreviation: "SD", lat: 44.299782, lng: -99.438828 },
  { name: "Tennessee", slug: "tennessee", abbreviation: "TN", lat: 35.747845, lng: -86.692345 },
  { name: "Texas", slug: "texas", abbreviation: "TX", lat: 31.054487, lng: -97.563461 },
  { name: "Utah", slug: "utah", abbreviation: "UT", lat: 40.150032, lng: -111.862434 },
  { name: "Vermont", slug: "vermont", abbreviation: "VT", lat: 44.045876, lng: -72.710686 },
  { name: "Virginia", slug: "virginia", abbreviation: "VA", lat: 37.769337, lng: -78.169968 },
  { name: "Washington", slug: "washington", abbreviation: "WA", lat: 47.400902, lng: -121.490494 },
  { name: "West Virginia", slug: "west-virginia", abbreviation: "WV", lat: 38.491226, lng: -80.954453 },
  { name: "Wisconsin", slug: "wisconsin", abbreviation: "WI", lat: 44.268543, lng: -89.616508 },
  { name: "Wyoming", slug: "wyoming", abbreviation: "WY", lat: 42.755966, lng: -107.302490 }
];

export function getStateBySlug(slug: string): USState | undefined {
  return usStates.find(s => s.slug === slug);
}

export function getGoogleMapsEmbedUrl(state: USState): string {
  return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000000!2d${state.lng}!3d${state.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`;
}
