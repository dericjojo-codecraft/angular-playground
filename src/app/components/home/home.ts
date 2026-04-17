import { Component, inject, input, signal, computed } from '@angular/core';
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
  mode = signal<'normal' | 'edit'>('normal');

  recentId = signal<number>(-1);
  recentLocation = computed(() => 
    this.recentId() >= 0 
      ? this.locationService.getAllLocations()[this.recentId()] 
      : undefined
  );
  
  message = "Normal";
  selectedLocations: HousingLocationInfo[] = [];

  handleLocationClicked(location: HousingLocationInfo | undefined) {
    if(location) {
      if(this.mode() === "normal") {
        this.router.navigate([`/details/${location.id}`]);
      } else {
        const index = this.locationService.housingLocations.findIndex(loc => loc.id === location.id);

        if(index !== -1) {
          this.selectedLocations.splice(index, 1);  // Remove
        } else {
          this.selectedLocations.push(location);  // Add
        }
        
        // add border for every item in array
        this.selectedLocations.forEach(loc=>{console.log(loc.id)});
      }
    }  
  }

  handleCheckbox() {
    this.mode.update(prev => prev === 'normal' ? 'edit' : 'normal');
    this.message = this.mode() === "normal" ? 'Normal':"Edit"

    console.log("Mode toggled to", this.mode());
  }
}
