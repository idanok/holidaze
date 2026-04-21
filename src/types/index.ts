export interface VenueMedia {
    url: string;
    alt: string;
  }
  
  export interface VenueMeta {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  }
  
  export interface VenueLocation {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
  }
  
  export interface Venue {
    id: string;
    name: string;
    description: string;
    media: VenueMedia[];
    price: number;
    maxGuests: number;
    rating: number;
    created: string;
    updated: string;
    meta: VenueMeta;
    location: VenueLocation;
  }