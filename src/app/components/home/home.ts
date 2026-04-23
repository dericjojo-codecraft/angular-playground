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

  handleAddition() {
    console.log("Starting to add housing location...")

    const data: HousingLocationInfo = {
      id: 10,
      name: 'Codecraft',
      city: 'Mangalore',
      state: 'Karnataka',
      img: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 1,
      isActive: true,
    }

    this.locationService.addLocation(data)
  }

  showDeletedOnly = signal<boolean>(false);
  toggleDeletedView() {
    this.showDeletedOnly.update(prev => !prev);
  }

  deletedButtonMessage = computed(() => 
    this.showDeletedOnly() ? "Hide Deleted Locations ^" : "See Deleted Locations V"
  );

  openLocationForm() {
    this.router.navigate(['home', 'edit', 'form'])
  }
}