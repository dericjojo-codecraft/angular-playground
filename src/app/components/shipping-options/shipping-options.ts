import { Component, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-shipping-options',
  imports: [],
  templateUrl: './shipping-options.html',
  styleUrl: './shipping-options.css',
})

export class ShippingOptions {
  shippingSelection = signal<string[]>(["Ground", " Sea", " Air"])

  userSelectedShippingOption = linkedSignal<string[], string>({
    source: this.shippingSelection,
    computation: (newDependencyValue, myPreviousValue): string => {
      if (newDependencyValue.includes(myPreviousValue?.value as string)) {
        return myPreviousValue?.value ?? '';
      } else {
        return newDependencyValue[0];
      }
    },
  });

  changeShippingOptions() {
    this.shippingSelection.set(['Postal Service', ' Sea', ' Corier']);
  }

  handleUserInput(event: Event) {
    const userSelectedValue = (event.target as HTMLInputElement).value;
    console.log((event.target as HTMLInputElement).value);
  }
}
