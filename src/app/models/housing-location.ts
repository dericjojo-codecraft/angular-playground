export type HousingLocationInfo = {
  id: number;
  name: string;
  img: string;
  address: string;
  availableUnits: number;
  properties?: ("wifi" | "ac" | "garage")[];
  isActive: boolean;
}

export interface HousingLocationViewModel extends HousingLocationInfo {
  selected: boolean;
}