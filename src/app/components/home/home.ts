import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocation, CommonModule, ReactiveFormsModule],
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
  private fb = inject(FormBuilder);
  addLocationForm = this.fb.group({
    name: ['', Validators.required],
    img: ['', Validators.required],
    wifi: [false],
    ac: [false],
    garage: [false]
  });

  showDeleteConfirmation = signal<boolean>(false);
  showAddDialog = signal<boolean>(false);
  
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

  handleAddition() {
    this.showAddDialog.set(true);
  }

  confirmAddition() {
    if(this.addLocationForm.valid) {
      const val = this.addLocationForm.value;

      const properties: ("wifi" | "ac" | "garage")[] = [];
      if (val.wifi) properties.push("wifi");
      if (val.ac) properties.push("ac");
      if (val.garage) properties.push("garage");

      const newLocation: any = {
        name: val.name,
        img: val.img,
        properties: properties,
      };

      this.locationService.addLocations([newLocation]);
      this.cancelAddition();
    }
  }

  cancelAddition() {
    this.showAddDialog.set(false);
    this.addLocationForm.reset();
  }
}
