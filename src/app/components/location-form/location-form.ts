import { Component, HostListener, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HousingLocationInfo } from '@models/housing-location';
import { LocationService } from '@services/location-service';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  locationService = inject(LocationService);
  route: ActivatedRoute = inject(ActivatedRoute);
  isFormEmpty = signal<boolean>(true);
  private _rootPage = signal<string>('');
  id = input.required<string>();

  locationForm = this.formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    img: ['', Validators.required],
    wifi: [false],
    ac: [false],
    garage: [false]
  });

  panelClass = signal<boolean>(false);
  showPanel() {
    this.panelClass.set(true);
  }
  
  hidePanel(state: boolean = false) {
    if(state) {
      if(this.panelClass()) {
        this.panelClass.set(false);
        setTimeout(() => {
          this.router.navigate([this._rootPage()]);
        }, 10);
      }
    } else {
      if (this.locationForm.dirty) {
        const confirmClose = confirm("You have unsaved changes. Are you sure you want to close?");
        if (!confirmClose) {
          return;
        }
      }
    }

    if(this.panelClass()) {
      this.panelClass.set(false);
      setTimeout(() => {
        this.router.navigate([this._rootPage()]);
      }, 10);
    }
  }

  addLocation() {
    const locationObject:HousingLocationInfo = {
      id: this.locationService.getTotalLocations(),
      availableUnits: 1,
      name: this.locationForm.controls.name.value!,
      img: this.locationForm.controls.img.value!,
      address: this.locationForm.controls.address.value!,
      isActive: true,
    }
    this.locationService.addLocation(locationObject);
  }

  updateLocation() {
    const propList = [];
    if(this.locationForm.controls.ac) {
      propList.push('ac');
    }
    if(this.locationForm.controls.wifi) {
      propList.push('wifi');
    }
    if(this.locationForm.controls.garage) {
      propList.push('garage');
    }
    const updatedLocation: HousingLocationInfo = {
      id: Number(this.id()),
      availableUnits: 1,
      name: this.locationForm.controls.name.value!,
      img: this.locationForm.controls.img.value!,
      address: this.locationForm.controls.address.value!,
      isActive: true,
      properties: propList as ("ac" | "wifi" | "garage")[]
    }
    this.locationService.updateLocation(updatedLocation);
  }

  ngOnInit() {
    const currentUrl = this.router.url;
    const parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
    this._rootPage.set(parentUrl);

    this.locationForm;
    this.locationForm.valueChanges.subscribe((values) => {
      const isCurrentlyEmpty = 
        (!values.name || values.name.trim() === '') &&
        (!values.address || values.address.trim() === '') &&
        (!values.img || values.img.trim() === '') &&
        !values.wifi &&
        !values.ac &&
        !values.garage;

      this.isFormEmpty.set(isCurrentlyEmpty);
    });

    setTimeout(() => {
      this.showPanel();
    }, 10);
  }

  stopEventPropagation(event: Event) {
    event.stopPropagation()
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    this.hidePanel();
  }

  handleSubmit() {
    if(this.router.url.includes('home')) {
      //this.addLocation();
      console.log("added");
    } else if(this.router.url.includes('details')) {
      //this.updateLocation();
      console.log("updated");
    }
    this.hidePanel(true);
  }


}
