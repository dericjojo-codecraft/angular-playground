import { Component, inject, signal } from '@angular/core';
import { HousingLocation } from '@components/housing-component/housing-location';
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
  
  handleLocationClicked(location: HousingLocationInfo) {
    console.log(`Home: ${location.name} clicked!`);

    const locationIndex:number = this.locationService.locations.findIndex(loc => loc.id === location.id);
    const locationItem:HousingLocationInfo = this.locationService.locations[locationIndex];
    
    this.locationService.locations.splice(locationIndex, 1);
    this.locationService.locations.unshift(locationItem);
  }

  handleCheckbox(event: Event) {
    console.log("Mode toggled");
    this.mode = this.mode === signal('normal') ? this.mode = signal('edit') : signal('normal');
  }
  
}
