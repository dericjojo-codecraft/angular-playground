import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-location-form',
  imports: [RouterOutlet],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  router = inject(Router);

  panelClass = signal<boolean>(false);
  showPanel() {
    this.panelClass.set(true);
  }
  
  hidePanel() {
    this.panelClass.set(false);
    setTimeout(() => {
      this.router.navigate(['home']);
    }, 10);
  }

  ngOnInit() {
    console.log("Location Panel should be seen");
    setTimeout(() => {
      this.showPanel();
    }, 10);
  }

  overlayClick() {
    // if any of the input fields have any data, do nothing
    if(false) {
      const object = document.getElementById("overlay-click");
    } else {
      this.hidePanel();
    }
  }
}
