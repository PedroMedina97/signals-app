import { Component, computed, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  // Con withComponentInputBinding() habilitado:
  // - Route params se vinculan automáticamente a inputs del mismo nombre
  // - Query params se vinculan automáticamente a inputs del mismo nombre
  // - Route data se vincula automáticamente a inputs del mismo nombre
  
  // Route param: /product/:id
  id = input<string>();
  
  // Query params: ?color=red&size=large
  color = input<string>();
  size = input<string>();
  
  // Route data: data: { category: 'electronics', featured: true }
  category = input<string>();
  featured = input<boolean>();
  
  // Computed signals derivados de los inputs
  productInfo = computed(() => {
    return `Producto ID: ${this.id() || 'N/A'}`;
  });
  
  queryParamsInfo = computed(() => {
    const parts = [];
    if (this.color()) parts.push(`Color: ${this.color()}`);
    if (this.size()) parts.push(`Talla: ${this.size()}`);
    return parts.length > 0 ? parts.join(', ') : 'Sin query params';
  });
  
  routeDataInfo = computed(() => {
    const parts = [];
    if (this.category()) parts.push(`Categoría: ${this.category()}`);
    if (this.featured() !== undefined) parts.push(`Destacado: ${this.featured() ? 'Sí' : 'No'}`);
    return parts.length > 0 ? parts.join(', ') : 'Sin route data';
  });

  constructor() {
    // Effect para loggear cuando cambian los inputs
    effect(() => {
      console.log('Router Inputs actualizados:', {
        id: this.id(),
        color: this.color(),
        size: this.size(),
        category: this.category(),
        featured: this.featured()
      });
    });
  }
}
