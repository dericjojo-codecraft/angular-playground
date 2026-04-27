import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '@models/housing-location';
import { BASE_URL, LocationService } from '@services/location-service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  locationService: LocationService = inject(LocationService);
  router = inject(Router)
  baseUrl = inject(BASE_URL)

  mode = signal<"Normal" | "Edit Mode">('Normal');
  panelClass = signal<boolean>(false);

  modeStatus = computed(() => {return this.mode() === "Normal" ? "Normal" : "Edit Mode"});

  showDeleteConfirmation = signal<boolean>(false);

  selectedLocationIds = computed(() => this.locationService.locationServiceData().filter(loc => loc.selected && !this.locationService.isDeleted(loc.id)).map(loc => loc.id));
  selectedCount = computed(() => this.locationService.locationServiceData().filter(loc => loc.selected && !this.locationService.isDeleted(loc.id)).length);
  deletedCount = computed(() => this.locationService.getDeletedIds().length);

  handleSelectionChange(event: { id: number; selected: boolean }) {
    this.locationService.locationServiceData.update(list =>
      list.map(loc => loc.id === event.id && !this.locationService.isDeleted(loc.id) ? { ...loc, selected: event.selected } : loc)
    );
  }

  ngOnInit() {
    this.modeStatus();
  }
  
  handleDelete() {
    const selectedIds = this.locationService.locationServiceData()
      .filter(loc => loc.selected)
      .map(loc => loc.id);
    
    if(selectedIds.length > 0) {
      this.locationService.deleteSelectedLocations(selectedIds);
    
      this.locationService.locationServiceData.update(locations =>
        locations.map(loc => selectedIds.includes(loc.id) ? { ...loc, selected: false } : loc)
      );
      
    } else {
      alert("Select at least one location to delete");
    } 
  }

  confirmDelete() {
    this.showDeleteConfirmation.set(false);
  }

  cancelDelete() {
    this.showDeleteConfirmation.set(false);
  }

  restoreOriginal() {
    this.locationService.restoreItems();
  }

  handleLocationClick(housingLocationInfo: HousingLocationInfo) {
    if(this.mode() === "Normal") {
      this.router.navigate(['details', housingLocationInfo.id])
      const viewModels = this.locationService.locationServiceData().map(vm => {
        const newVm = { ...vm };
        newVm.selected = false;
        return newVm;
      })
      this.locationService.locationServiceData.set(viewModels);
    }
  }

  handleCheckbox() {
    this.mode.update(prev => prev === "Normal" ? 'Edit Mode' : "Normal")

    if(this.mode() === 'Normal'){
      this.locationService.locationServiceData.update(list => list.map(loc => ({ ...loc, selected: false })));
    }
  }

  showAddOnly = signal<boolean>(false);
  toggleAddView() {
    this.showAddOnly.update(prev => !prev);
  }
  
  showDeletedOnly = signal<boolean>(false);
  toggleDeletedView() {
    this.showDeletedOnly.update(prev => !prev);
  }

  deletedButtonMessage = computed(() => 
    this.showDeletedOnly() ? "Hide Deleted Locations ^" : "See Deleted Locations V"
  );

  openLocationForm() {
    this.router.navigate(['home', 'edit']);
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