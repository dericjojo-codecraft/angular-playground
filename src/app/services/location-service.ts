import { Injectable, InjectionToken } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
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
    private selectedLocationIdsSubject = new BehaviorSubject<Set<number>>(new Set());
    public selectedLocationIds$ = this.selectedLocationIdsSubject.asObservable();

    constructor(private http: HttpClient) {
        LocationService.numberOfInstances += 1;
        console.log("Number of instances:", LocationService.numberOfInstances);
        this.loadLocations();
    }

    ngOnDestroy() {
      LocationService.numberOfInstances = 0;
    }
    
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

    deleteLocation(id: number): void {
      const locations = this.locationsSubject.value;
      const index = locations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        locations[index].isActive = false;
        this.locationsSubject.next([...locations]);
        this.saveToLocalStorage(locations);
      }
    }

    restoreLocation(id: number): void {
      const locations = this.locationsSubject.value;
      const index = locations.findIndex(loc => loc.id === id);
      if (index !== -1) {
        locations[index].isActive = true;
        this.locationsSubject.next([...locations]);
        this.saveToLocalStorage(locations);
      }
    }

    selectLocation(id: number): void {
      const selected = new Set(this.selectedLocationIdsSubject.value);
      selected.add(id);
      this.selectedLocationIdsSubject.next(selected);
    }

    deselectLocation(id: number): void {
      const selected = new Set(this.selectedLocationIdsSubject.value);
      selected.delete(id);
      this.selectedLocationIdsSubject.next(selected);
    }

    clearSelection(): void {
      this.selectedLocationIdsSubject.next(new Set());
    }

    getSelectedLocationIds(): Set<number> {
      return this.selectedLocationIdsSubject.value;
    }

    deleteSelectedLocations(): void {
      const selectedIds = this.selectedLocationIdsSubject.value;
      selectedIds.forEach(id => {
        this.deleteLocation(id);
      });
      this.clearSelection();
    }
}