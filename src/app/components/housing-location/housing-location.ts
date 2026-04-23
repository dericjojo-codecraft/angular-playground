import { Component, input, output } from '@angular/core';
import { HousingLocationInfo, HousingLocationViewModel } from '@models/housing-location';
import { BASE_URL } from '@services/location-service';

@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  providers: [{ provide: BASE_URL, useValue: "hehe hehe heee"}],
  host: {
    '[class.selected]': 'isEditMode() && isSelected()'
  }
})
export class HousingLocation {
  location = input.required<HousingLocationViewModel>();
  onLocationClick = output<HousingLocationInfo>();
  isEditMode = input<boolean>(false);
  isSelected = input<boolean>(false);
  selectedLocation = output<{ id: number, selected: boolean}>();

  handleClick() {
    if(this.isEditMode()) {
      this.selectedLocation.emit({
        id: this.location().id,
        selected: !this.isSelected()
      });
    }
    this.onLocationClick.emit(this.location());
  }
}