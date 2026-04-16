import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '@components/housing-component/housing-location';
import { HousingLocationInfo } from '@models/housing-location';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  counter: number = 0;
  private readonly imglink = 'https://plus.unsplash.com/premium_photo-1675826539716-54a369329428?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8';

  locations: HousingLocationInfo[] = [
    { id: 1, name: 'Downtown Apartment', img: this.imglink, properties: ["wifi"]},
    { id: 2, name: 'Suburban House', img: this.imglink, properties: ["ac"]},
    { id: 3, name: 'Beachfront Condo', img: this.imglink, properties: ["ac", "wifi"]},
    { id: 4, name: 'Mountain Cabin', img: this.imglink, properties: ["ac", "ac"]},
    { id: 5, name: 'City Loft', img: this.imglink, properties: []},
    { id: 6, name: 'Countryside Estate', img: this.imglink, properties: []}
  ];

  handleLocationClicked(location: HousingLocationInfo) {
    console.log(`Home: ${location.name} clicked!`);

    const locationIndex:number = this.locations.findIndex(loc => loc.id === location.id);
    const locationItem:HousingLocationInfo = this.locations[locationIndex];
    
    this.locations.splice(locationIndex, 1);
    this.locations.unshift(locationItem);
  }

  handleIncrement() {
    this.counter++;
  }

  handleDecrement() {
    this.counter--;
  }
}
