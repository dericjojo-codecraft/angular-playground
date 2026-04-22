import { Home } from '@components/home/home';
import { LocationDetails } from '@components/location-details/location-details';
import { LinkedSignal } from '@components/linked-signal/linked-signal';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Home Page'
    },
    {
        path: 'details/:id',
        component: LocationDetails,
        title: 'Details'
    },
    {
        path: 'linked-signal',
        component: LinkedSignal,
        title: 'Details'
    }
];