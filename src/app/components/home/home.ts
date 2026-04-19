import { Component, inject, ElementRef, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home {
  router: Router = new Router();
  locationService: LocationService = inject(LocationService);
  mode = signal<'Normal' | 'Edit Mode'>('Normal');
  
  selectedLocations: HousingLocationInfo[] = [];
  deletedLocations: HousingLocationInfo[] = [];

  deletedButtonMessage = signal<"See Deleted Locations V" | "Hide Deleted Locations ^">("See Deleted Locations V");

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
      this.selectedLocations.forEach(loc => this.deletedLocations.push(loc));
      this.selectedLocations = [];
    } else {
      alert("Select at least one location")
    }
  }
}
