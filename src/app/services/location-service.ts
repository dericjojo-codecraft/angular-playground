import { computed, inject, Injectable, InjectionToken, linkedSignal, signal } from '@angular/core';
import { HousingLocationInfo, HousingLocationViewModel } from '@models/housing-location';

export const BASE_URL = new InjectionToken<string>('base url', {
  providedIn: 'root',
  factory: () => 'https://angular.dev/assets/images/tutorials/common',
});

interface LocationAppConfig {
  env: "DEV" | "PROD",
  os: "win" | "mac"    
}

export const LOCATION_APP_CONFIG = new InjectionToken<LocationAppConfig>("App configuration", {
  factory: () => ({ env: "DEV", os: "win"})
  }
)

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  static numberOfInstances = 0;
  private deletedIds = signal<number[]>([]);

  constructor() {
    LocationService.numberOfInstances += 1;
  }

  private readonly baseUrl = inject(BASE_URL);

  private readonly housingLocationList: HousingLocationInfo[] = [
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      img: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      isActive: true
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      img: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      isActive: true,
       
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      img: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      isActive: true,
       
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      img: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      isActive: true,
       
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      img: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      isActive: true,
       
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      img: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      isActive: true,
       
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      img: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      isActive: true,
       
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      img: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      isActive: true,
       
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      img: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      isActive: true,
       
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      img: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      isActive: true,
       
    },
  ];

  private location = signal<HousingLocationInfo[]>(this.housingLocationList);

  getAllLocations() {
    return this.location.asReadonly();
  }

  getLocationForId(id: number): HousingLocationInfo | undefined {
    return this.location().find((location) => location.id === id);
  }

  deleteSelectedLocations(ids: number[]) {
    this.deletedIds.update(currentIds => [...currentIds, ...ids])
  }

  restoreItems() {
    this.deletedIds.set([]);
  }

  isDeleted(id: number) {
    return this.deletedIds().includes(id)
  }

  getDeletedIds() {
    return this.deletedIds()
  }

  locationServiceData = linkedSignal<HousingLocationInfo[], HousingLocationViewModel[]>({
    source: this.getAllLocations(),
    computation: (newHouseLocationInfoArray, previousValue) => {
      const prevLocationViewModels = (previousValue?.value as HousingLocationViewModel[]) ?? []

      const viewLocationsModels = newHouseLocationInfoArray.map(location => {
        const matchedModel = prevLocationViewModels.find(prevLocation => prevLocation.id === location.id)
        return { ...location, selected: matchedModel?.selected ?? false }
      })

      return viewLocationsModels
    }
  })
  
  visibleItems = computed(() => this.locationServiceData().filter(loc => !this.isDeleted(loc.id)));
  
  addLocation(location: HousingLocationInfo) {
  //   const currentLocations = this.location();
  //   location.id = currentLocations.length;
  //   console.log(this.location())
  //   currentLocations.push(location);
  //   this.location.set([...this.location(), ...currentLocations])
    
  //   this.location.set(currentLocations);
  //   console.log(this.location())

    console.log(location)
    const newLocation = { ...location, id: this.getTotalLocations() };
    console.log(newLocation)

    this.location.update(prev => [...prev, newLocation])
  
  }

  getTotalLocations() {
    return this.location().length
  }

}