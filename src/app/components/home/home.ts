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
  router: Router = inject(Router);
  locationService: LocationService = inject(LocationService);
  mode = signal<'Normal' | 'Edit Mode'>('Normal');
  housingLocations = signal<HousingLocationInfo[]>([]);
  showDeletedOnly = signal<boolean>(false);
  selectedLocationIds = signal<Set<number>>(new Set());
  showDeleteConfirmation = signal<boolean>(false);
  
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
    this.locationService.getAllLocations$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locations => {
        this.housingLocations.set(locations);
      });

    this.locationService.selectedLocationIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedIds => {
        this.selectedLocationIds.set(selectedIds);
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
        if (this.selectedLocationIds().has(location.id)) {
          this.locationService.deselectLocation(location.id);
        } else {
          this.locationService.selectLocation(location.id);
        }
      }
    }
  }

  handleCheckbox() {
    this.mode.update(prev => prev === 'Normal' ? 'Edit Mode' : 'Normal');
    this.locationService.clearSelection();

    console.log("Mode toggled to", this.mode());
  }

  handleDelete() {
    if(this.selectedLocationIds().size > 0) {
      this.showDeleteConfirmation.set(true);
    } else {
      alert("Select at least one location")
    }
  }

  confirmDelete() {
    this.locationService.deleteSelectedLocations();
    this.showDeleteConfirmation.set(false);
  }

  cancelDelete() {
    this.showDeleteConfirmation.set(false);
  }

  toggleDeletedView() {
    this.showDeletedOnly.update(prev => !prev);
  }

  restoreLocation(location: HousingLocationInfo) {
    this.locationService.restoreLocation(location.id);
  }
}
