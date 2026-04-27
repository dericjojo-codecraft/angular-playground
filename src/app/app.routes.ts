import { Home } from '@components/home/home';
import { LinkedSignal } from '@components/linked-signal/linked-signal';
import { Routes } from '@angular/router';
import { LocationForm } from '@components/location-form/location-form';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: Home,
        title: 'Home Page',
        children: [
            {
                path: 'edit',
                component: LocationForm,
                title: 'Panel Form',
            },
        ]
    },
    {
        path: 'details/:id',
        title: 'Details',
        loadComponent: () => import('@components/location-details/location-details').then(m => m.LocationDetails),
        children: [
            {
                path: 'edit',
                component: LocationForm,
                title: 'Panel Demo',
            },
        ]
    },
    {
        path: 'linked-signal',
        component: LinkedSignal,
        title: 'Linked Signal Demo'
    },
];