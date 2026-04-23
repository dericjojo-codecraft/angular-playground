import { Component, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemo {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit() {
    this.locationForm;
  }

  locationForm = this.formBuilder.group({
    location: ['', Validators.required],
    address: ['', Validators.required],
    img: ['', Validators.required],
    wifi: [false],
    ac: [false],
    garage: [false]
});

  updateProfile() {
    console.log();
  }

  hidePanel() {
    this.router.navigate(['home']);
  }
}
