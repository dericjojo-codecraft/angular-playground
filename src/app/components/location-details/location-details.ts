import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails implements OnInit, OnDestroy {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  
  locationService: LocationService = inject(LocationService);
  location = signal<HousingLocationInfo | undefined>(undefined);
  allLocations = signal<HousingLocationInfo[]>([]);
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    // Load all locations
    this.locationService.getAllLocations$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.allLocations.set(locations);
      });

    // Load current location from route params
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = Number(params['id']);
        this.location.set(this.locationService.getLocationById(id));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    console.log("Location details component destroyed");
  }

  goToPrevious() {
    if (this.location()) {
      const locations = this.allLocations();
      const currentIndex = locations.findIndex(loc => loc.id === this.location()!.id);
      if (currentIndex > 0) {
        const prevLocation = locations[currentIndex - 1];
        this.router.navigate(['/details', prevLocation.id]);
      }
    }
  }

  goToNext() {
    if (this.location()) {
      const locations = this.allLocations();
      const currentIndex = locations.findIndex(loc => loc.id === this.location()!.id);
      if (currentIndex < locations.length - 1) {
        const nextLocation = locations[currentIndex + 1];
        this.router.navigate(['/details', nextLocation.id]);
      }
    }
  }

  hasPrevious(): boolean {
    if (!this.location()) return false;
    const locations = this.allLocations();
    const currentIndex = locations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex > 0;
  }

  hasNext(): boolean {
    if (!this.location()) return false;
    const locations = this.allLocations();
    const currentIndex = locations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex < locations.length - 1;
  }
}