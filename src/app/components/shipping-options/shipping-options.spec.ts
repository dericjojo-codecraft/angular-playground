import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingOptions } from './shipping-options';

describe('ShippingOptions', () => {
  let component: ShippingOptions;
  let fixture: ComponentFixture<ShippingOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
