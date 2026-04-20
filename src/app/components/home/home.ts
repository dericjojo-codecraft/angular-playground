import { Component, inject, ElementRef, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocation, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit, OnDestroy {
  router: Router = new Router();
  locationService: LocationService = inject(LocationService);
  mode = signal<'Normal' | 'Edit Mode'>('Normal');
  housingLocations = signal<HousingLocationInfo[]>([]);
  showDeletedOnly = signal<boolean>(false);
  
  selectedLocations: HousingLocationInfo[] = [];
  private destroy$ = new Subject<void>();

  deletedButtonMessage = computed(() => 
    this.showDeletedOnly() ? "Hide Deleted Locations ^" : "See Deleted Locations V"
  );

  activeLocations = computed(() => 
    this.housingLocations().filter(loc => loc.isActive)
  );

  deletedLocations = computed(() => 
    this.housingLocations().filter(loc => !loc.isActive)
  );

  ngOnInit() {
    // Subscribe to location updates from the service
    this.locationService.getAllLocations$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.housingLocations.set(locations);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleLocationClicked(location: HousingLocationInfo | undefined) {
    if (location) {
      if (this.mode() === 'Normal') {
        this.router.navigate([`/details/${location.id}`]);
      } else {
        const index = this.selectedLocations.findIndex(loc => loc.id === location.id);

        if (index !== -1) {
          this.selectedLocations.splice(index, 1);  // Remove
        } else {
          this.selectedLocations.push(location);    // Add
        }
      }
    }
  }

  handleCheckbox() {
    this.mode.update(prev => prev === 'Normal' ? 'Edit Mode' : 'Normal');
    this.selectedLocations = []; 

    console.log("Mode toggled to", this.mode());
  }

  handleDelete() {
    if(this.selectedLocations.length) {
      this.selectedLocations.forEach(loc => {
        this.locationService.deleteLocation(loc.id);
      });
      this.selectedLocations = [];
    } else {
      alert("Select at least one location")
    }
  }

  toggleDeletedView() {
    this.showDeletedOnly.update(prev => !prev);
  }

  restoreLocation(location: HousingLocationInfo) {
    this.locationService.restoreLocation(location.id);
  }
}
