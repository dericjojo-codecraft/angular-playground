import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  router: Router = inject(Router);

  goHome() {
    this.router.navigate(['home']);
  }
  goToSignalDemo() {
    this.router.navigate(['linked-signal']);
  }
}
