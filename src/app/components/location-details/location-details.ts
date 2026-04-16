import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  
  locationService: LocationService = inject(LocationService);
  location = signal<HousingLocationInfo | undefined>(undefined);
  allLocations = this.locationService.getAllLocations();
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.location.set(this.locationService.getLocationById(id));
    });
  }

  ngOnDestroy() {
    console.log("Instances are destroyed");
  }

  goToPrevious() {
    if (this.location()) {
      const currentIndex = this.allLocations.findIndex(loc => loc.id === this.location()!.id);
      if (currentIndex > 0) {
        const prevLocation = this.allLocations[currentIndex - 1];
        this.router.navigate(['/details', prevLocation.id]);
      }
    }
  }

  goToNext() {
    if (this.location()) {
      const currentIndex = this.allLocations.findIndex(loc => loc.id === this.location()!.id);
      if (currentIndex < this.allLocations.length - 1) {
        const nextLocation = this.allLocations[currentIndex + 1];
        this.router.navigate(['/details', nextLocation.id]);
      }
    }
  }

  hasPrevious(): boolean {
    if (!this.location()) return false;
    const currentIndex = this.allLocations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex > 0;
  }

  hasNext(): boolean {
    if (!this.location()) return false;
    const currentIndex = this.allLocations.findIndex(loc => loc.id === this.location()!.id);
    return currentIndex < this.allLocations.length - 1;
  }
}
