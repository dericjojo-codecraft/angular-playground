import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationInfo } from '@models/housing-location';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})

export class HousingLocation {
  location = input.required<HousingLocationInfo>();
  onLocationClick = output<HousingLocationInfo>();

  handleClick() {
    this.onLocationClick.emit(this.location());
  }
}
