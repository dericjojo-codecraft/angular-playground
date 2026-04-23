import { Home } from '@components/home/home';
import { FormsDemo } from '@components/forms-demo/forms-demo';
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
                title: 'Panel Demo',
                children: [
                    {
                        path: 'form',
                        component: FormsDemo,
                        title: 'Form Demo'
                    },
                ]
            },
        ]
    },
    {
        path: 'details/:id',
        //component: LocationDetails,
        title: 'Details',
        loadComponent: () => import('@components/location-details/location-details').then(m => m.LocationDetails)
    },
    {
        path: 'linked-signal',
        component: LinkedSignal,
        title: 'Linked Signal Demo'
    },
];