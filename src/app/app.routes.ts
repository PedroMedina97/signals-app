import { Routes } from '@angular/router';
import { Seccion1 } from './sections/seccion1/seccion1';
import { Seccion2 } from './sections/seccion2/seccion2';
import { Seccion3 } from './sections/seccion3/seccion3';
import { Seccion4 } from './sections/seccion4/seccion4';

export const routes: Routes = [

    { path: 'seccion-1', component: Seccion1 },
    { path: 'seccion-2', component: Seccion2 },
    { path: 'seccion-3', component: Seccion3 },
    { path: 'seccion-4', component: Seccion4 },
    { path: '**', redirectTo: 'seccion-1' }
];
