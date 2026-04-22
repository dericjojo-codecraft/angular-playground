import {Component, signal, ChangeDetectionStrategy, effect, linkedSignal, computed} from '@angular/core';
import { ShippingOptions } from "@components/shipping-options/shipping-options";

@Component({
  selector: 'app-linked-signal',
  templateUrl: './linked-signal.html', 
  styleUrl: './linked-signal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShippingOptions],
})

export class LinkedSignal {
  userStatus = signal<'online' | 'away' | 'offline'>('offline');

  // TODO: Create notificationsEnabled computed signal that returns true when status is 'online'
  notificationPreference = linkedSignal<boolean>(() => this.userStatus() === "online");

  // TODO: Create statusMessage computed signal that returns appropriate message for each status
  // statusEffect = effect((cleanup) => {
        // use untracked if only want to read the value once
  //   if(this.userStatus() === "online") {
  //     this.notificationPreference.set(true);
  //   } else {
  //     this.notificationPreference.set(false);
  //   }

  //   cleanup(() => {
  //     // do some cleanup
  //   })
  // })

  // TODO: Create isWithinWorkingHours computed signal that calculates if user is within working hours
  private currentTime = signal(new Date());
  isWithinWorkingHours = computed(() => {
    const now = this.currentTime();
    const day = now.getDay();
    const hour = now.getHours();

    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHours = hour >= 9 && hour < 17;

    return isWeekday && isBusinessHours;
  });

  goOnline() {
    this.userStatus.set('online');
  }

  goAway() {
    this.userStatus.set('away');
  }

  goOffline() {
    this.userStatus.set('offline');
  }

  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        break;
      case 'online':
        this.userStatus.set('away');
        break;
      case 'away':
        this.userStatus.set('offline');
        break;
    }
  }
}
