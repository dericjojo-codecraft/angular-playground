import { Component, inject, Signal, signal, computed } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [LocationService]
})

export class Home {
  locationService: LocationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  recentId = signal<number>(-1);
  recentLocation = computed(() => 
    this.recentId() >= 0 
      ? this.locationService.getAllLocations()[this.recentId()] 
      : undefined
  );
  message = "";
  checked = signal<string>("")
  messageComputed = computed(() => {
    
  })

  
  handleLocationClicked(location: HousingLocationInfo | undefined) {
    if(location) {
      console.log(`${location.name} clicked!`);

      const index = this.locationService.housingLocations.findIndex(loc => loc.id === location.id);
      this.recentId.set(index);
    }  
  }

  handleCheckbox(event: Event) {
    this.mode.update(prev => prev === 'normal' ? 'edit' : 'normal');
    console.log("Mode toggled to ", this.mode.name);
  }
  
}
