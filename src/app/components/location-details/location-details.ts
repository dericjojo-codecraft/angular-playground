import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})

export class LocationDetails {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  
  locationService: LocationService = inject(LocationService);
  location = signal<HousingLocationInfo | undefined>(undefined);
  allLocations = this.locationService.getAllLocations();

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      const fetchedLocation = this.locationService.getLocationForId(id);
      
      this.location.set(fetchedLocation);
    });
  }

  goToPrevious() {
    if (this.location()) {
      const allLocations = this.allLocations();
      const currentIndex = allLocations.findIndex(loc => loc.id === this.location()!.id);
      let prevIndex = currentIndex - 1;

      while (prevIndex >= 0) {
        if (this.locationService.visibleItems().map(loc => loc.id).includes(prevIndex)) {
          this.router.navigate(['/details', allLocations[prevIndex].id]);
          break;
        } else {
          prevIndex -= 1;
        }
      }
    }
  }

  goToNext() {
    if (this.location()) {
      const allLocations = this.allLocations();
      const currentIndex = allLocations.findIndex(loc => loc.id === this.location()!.id);
      let nextIndex = currentIndex + 1;

      while (nextIndex < allLocations.length) {
        if (this.locationService.visibleItems().map(loc => loc.id).includes(nextIndex)) {
          this.router.navigate(['/details', allLocations[nextIndex].id]);
          break;
        } else {
          nextIndex += 1;
        }
      }
    }
  }

  hasPrevious(): boolean {
    if (!this.location()) return false;
    const allLocations = this.allLocations();
    const currentIndex = allLocations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex > 0;
  }

  hasNext(): boolean {
    if (!this.location()) return false;
    const allLocations = this.allLocations();
    const currentIndex = allLocations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex < allLocations.length - 1;
  }
}