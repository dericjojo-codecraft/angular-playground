import { Component, inject } from '@angular/core';
import { HousingLocation } from '@components/housing-component/housing-location';
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
  counter: number = 0;
  
  handleIncrement() {
    this.counter++;
  }

  handleDecrement() {
    this.counter--;
  }
}
