import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart-rxjs',
  imports: [CommonModule],
  templateUrl: './cart-rxjs.html',
  styleUrl: './cart-rxjs.scss',
})
export class CartRxjs implements OnInit, OnDestroy {
  items: CartItem[] = [];
  total: number = 0;
  itemCount: number = 0;

  // Necesitamos gestionar las suscripciones manualmente
  private subscriptions = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Suscripción manual a cada observable
    this.subscriptions.add(
      this.cartService.items$.subscribe(items => {
        this.items = items;
      })
    );

    this.subscriptions.add(
      this.cartService.total$.subscribe(total => {
        this.total = total;
      })
    );

    this.subscriptions.add(
      this.cartService.itemCount$.subscribe(count => {
        this.itemCount = count;
      })
    );
  }

  ngOnDestroy() {
    // Importante: limpiar suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  addProduct(name: string, price: number) {
    const id = Date.now();
    this.cartService.addItem({ id, name, price });
  }

  removeItem(id: number) {
    this.cartService.removeItem(id);
  }

  updateQuantity(id: number, quantity: number) {
    this.cartService.updateQuantity(id, quantity);
  }

  clearCart() {
    this.cartService.clear();
  }
}
