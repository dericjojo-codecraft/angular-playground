export type HousingLocationInfo = {
  id: number;
  name: string;
  img: string;
  properties?: ("wifi" | "ac" | "garage")[];
  isActive: boolean;
}

export interface HousingLocationViewModel extends HousingLocationInfo {
  selected: boolean;
}