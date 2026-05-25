import { Routes } from '@angular/router';
import { Seccion1 } from './sections/seccion1/seccion1';
import { Seccion2 } from './sections/seccion2/seccion2';
import { Seccion3 } from './sections/seccion3/seccion3';
import { Seccion4 } from './sections/seccion4/seccion4';
import { Seccion5 } from './sections/seccion5/seccion5';
import { ProductDetail } from './sections/seccion5/product-detail/product-detail';
import { Seccion6 } from './sections/seccion6/seccion6';
import { Seccion7 } from './sections/seccion7/seccion7';
import { Seccion8 } from './sections/seccion8/seccion8';

export const routes: Routes = [

    { path: 'seccion-1', component: Seccion1 },
    { path: 'seccion-2', component: Seccion2 },
    { path: 'seccion-3', component: Seccion3 },
    { path: 'seccion-4', component: Seccion4 },
    { path: 'seccion-5', component: Seccion5 },
    { path: 'seccion-6', component: Seccion6 },
    { path: 'seccion-7', component: Seccion7 }, 
    { path: 'seccion-8', component: Seccion8 },
    { 
        path: 'product/:id', 
        component: ProductDetail,
        data: { category: 'electronics', featured: true }
    },
    { path: '**', redirectTo: 'seccion-1' }
];
