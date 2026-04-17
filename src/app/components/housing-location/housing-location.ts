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

//! each card shouldnt inject to location-services, only corresponding parent
export class HousingLocation {
  location = input.required<HousingLocationInfo | undefined>();
  onLocationClick = output<HousingLocationInfo | undefined>();

  isSelected = input(false);

  handleClick() {
    this.onLocationClick.emit(this.location());
  }
}
