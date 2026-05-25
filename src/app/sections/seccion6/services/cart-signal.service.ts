import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartSignalService {
  // Enfoque MODERNO con Signals
  // Signal privado para el estado interno
  private itemsSignal = signal<CartItem[]>([]);

  // Signals públicos de solo lectura (readonly)
  items = this.itemsSignal.asReadonly();

  // Computed signals derivados automáticamente
  total = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  itemCount = computed(() => {
    return this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0);
  });

  isEmpty = computed(() => this.itemsSignal().length === 0);

  addItem(item: Omit<CartItem, 'quantity'>) {
    this.itemsSignal.update(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);

      if (existingItem) {
        // Si existe, incrementar cantidad
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Si no existe, agregar nuevo item
        const newItem: CartItem = { ...item, quantity: 1 };
        return [...currentItems, newItem];
      }
    });
  }

  removeItem(id: number) {
    this.itemsSignal.update(items => items.filter(item => item.id !== id));
  }

  updateQuantity(id: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    this.itemsSignal.update(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  clear() {
    this.itemsSignal.set([]);
  }
}
