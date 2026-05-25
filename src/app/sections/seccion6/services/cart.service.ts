import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Enfoque TRADICIONAL con BehaviorSubject
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private itemCountSubject = new BehaviorSubject<number>(0);

  // Observables públicos para que los componentes se suscriban
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  total$: Observable<number> = this.totalSubject.asObservable();
  itemCount$: Observable<number> = this.itemCountSubject.asObservable();

  addItem(item: Omit<CartItem, 'quantity'>) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity++;
      this.itemsSubject.next([...currentItems]);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      this.itemsSubject.next([...currentItems, newItem]);
    }

    this.calculateTotals();
  }

  removeItem(id: number) {
    const currentItems = this.itemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.itemsSubject.next(filteredItems);
    this.calculateTotals();
  }

  updateQuantity(id: number, quantity: number) {
    const currentItems = this.itemsSubject.value;
    const item = currentItems.find(i => i.id === id);
    
    if (item) {
      item.quantity = quantity;
      this.itemsSubject.next([...currentItems]);
      this.calculateTotals();
    }
  }

  clear() {
    this.itemsSubject.next([]);
    this.totalSubject.next(0);
    this.itemCountSubject.next(0);
  }

  private calculateTotals() {
    const items = this.itemsSubject.value;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    this.totalSubject.next(total);
    this.itemCountSubject.next(count);
  }
}
