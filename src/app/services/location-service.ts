import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { HousingLocationInfo } from "@models/housing-location";

export const BASE_URL = new InjectionToken<string>('base url', {providedIn: 'root', factory: () => 'string'})

@Injectable({
    providedIn: 'root',
})

export class LocationService {
    static numberOfInstances = 0;
    private readonly storageKey = 'housingLocations';
    private locationsSubject = new BehaviorSubject<HousingLocationInfo[]>([]);
    public locations$ = this.locationsSubject.asObservable();

    constructor(private http: HttpClient) {
        LocationService.numberOfInstances += 1;
        console.log("Number of instances:", LocationService.numberOfInstances);
        this.loadLocations();
    }

    ngOnDestroy() {
      LocationService.numberOfInstances = 0;
    }

    /**
     * Load locations from localStorage if available, otherwise fetch from JSON file
     */
    private loadLocations(): void {
      const cachedData = localStorage.getItem(this.storageKey);
      if (cachedData) {
        try {
          const locations = JSON.parse(cachedData);
          this.locationsSubject.next(locations);
        } catch (e) {
          console.error('Error parsing cached locations:', e);
          this.fetchLocationsFromJson();
        }
      } else {
        this.fetchLocationsFromJson();
      }
    }

    /**
     * Fetch locations from the JSON file and cache in localStorage
     */
    private fetchLocationsFromJson(): void {
      this.http.get<HousingLocationInfo[]>('assets/data/locations.json').subscribe({
        next: (data) => {
          this.locationsSubject.next(data);
          this.saveToLocalStorage(data);
        },
        error: (err) => {
          console.error('Error loading locations from JSON:', err);
          this.locationsSubject.next([]);
        }
      });
    }

    /**
     * Save locations to localStorage
     */
    private saveToLocalStorage(locations: HousingLocationInfo[]): void {
      localStorage.setItem(this.storageKey, JSON.stringify(locations));
    }

    getAllLocations(): HousingLocationInfo[] {
      return this.locationsSubject.value;
    }

    getAllLocations$(): Observable<HousingLocationInfo[]> {
      return this.locations$;
    }

    getLocationById(id: number): HousingLocationInfo | undefined {
      return this.locationsSubject.value.find(location => location.id === id);
    }

    /**
     * Update a location and persist changes
     */
    updateLocation(location: HousingLocationInfo): void {
      const locations = this.locationsSubject.value;
      const index = locations.findIndex(loc => loc.id === location.id);
      if (index !== -1) {
        locations[index] = location;
        this.locationsSubject.next([...locations]);
        this.saveToLocalStorage(locations);
      }
    }

    /**
     * Add a new location and persist changes
     */
    addLocation(location: Omit<HousingLocationInfo, 'id' | 'isActive'>): void {
      const locations = this.locationsSubject.value;
      const newId = Math.max(...locations.map(l => l.id), 0) + 1;
      const newLocation: HousingLocationInfo = { ...location, id: newId, isActive: true } as HousingLocationInfo;
      locations.push(newLocation);
      this.locationsSubject.next([...locations]);
      this.saveToLocalStorage(locations);
    }

    /**
     * Soft delete a location (set isActive to false) and persist changes
     */
    deleteLocation(id: number): void {
      const locations = this.locationsSubject.value;
      const index = locations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        locations[index].isActive = false;
        this.locationsSubject.next([...locations]);
        this.saveToLocalStorage(locations);
      }
    }

    /**
     * Restore a deleted location (set isActive to true)
     */
    restoreLocation(id: number): void {
      const locations = this.locationsSubject.value;
      const index = locations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        locations[index].isActive = true;
        this.locationsSubject.next([...locations]);
        this.saveToLocalStorage(locations);
      }
    }
}