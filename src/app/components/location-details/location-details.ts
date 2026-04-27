import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-location-details',
  imports: [RouterOutlet],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})

export class LocationDetails {
  router: Router = inject(Router);
  
  id = input.required<string>();
  locationService: LocationService = inject(LocationService);
  allLocations = this.locationService.getAllLocations();
  panelClass = signal<boolean>(false);

  location = computed(() => this.locationService.getLocationForId(Number(this.id())));

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

  openLocationForm() {
    this.router.navigate([`details/${this.location()?.id}`, 'edit']);
  }

  editLocation() {
    console.log(this.location()?.address);
  }

  togglePanelSignal(isOpen: boolean) {
    this.panelClass.set(isOpen);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

}