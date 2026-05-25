import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartSignalService } from '../services/cart-signal.service';

@Component({
  selector: 'app-cart-signal',
  imports: [CommonModule],
  templateUrl: './cart-signal.html',
  styleUrl: './cart-signal.scss',
})
export class CartSignal {
  // Con signals: acceso directo, sin suscripciones
  constructor(public cartService: CartSignalService) {}

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
