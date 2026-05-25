import { Component, signal, resource, linkedSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookStoreService, Book } from './services/book-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-seccion7',
  imports: [CommonModule, FormsModule],
  templateUrl: './seccion7.html',
  styleUrl: './seccion7.scss',
})
export class Seccion7 {
  private bookStore = inject(BookStoreService);
  private searchSubject = new Subject<string>();

  // Ejemplo 1: Resource básico con fetch
  userId = signal(1);
  
  userResource = resource({
    loader: async (params) => {
      const id = this.userId();
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        { signal: params.abortSignal }
      );
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  // Ejemplo 2: Resource con parámetros y manejo de errores
  searchQuery = signal('javascript');
  
  booksResource = resource({
    loader: async () => {
      const keyword = this.searchQuery();
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockBooks = [
        { id: 1, title: `${keyword} Guide`, author: 'John Doe', price: 29.99 },
        { id: 2, title: `Advanced ${keyword}`, author: 'Jane Smith', price: 39.99 },
        { id: 3, title: `${keyword} Patterns`, author: 'Bob Johnson', price: 34.99 }
      ];
      if (keyword.length < 3) {
        throw new Error('Search query must be at least 3 characters');
      }
      return mockBooks;
    }
  });

  // Ejemplo 3: Usando toSignal con Observable (alternativa a rxResource)
  categoryId = signal(1);
  
  categoryBooksResource = resource({
    loader: async () => {
      const categoryId = this.categoryId();
      return new Promise<Book[]>((resolve) => {
        this.bookStore.getBooksByCategory(categoryId).subscribe(books => resolve(books));
      });
    }
  });

  // Ejemplo 4: linkedSignal para selectedBookId
  selectedBookId = linkedSignal<number | null>(() => {
    const books = this.booksResource.value();
    return books && books.length > 0 ? books[0].id : null;
  });

  bookDetailResource = resource({
    loader: async () => {
      const bookId = this.selectedBookId();
      if (!bookId) return null;
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: bookId,
        title: 'Book Details',
        description: 'Detailed information about the selected book',
        reviews: ['Great book!', 'Very informative'],
        rating: 4.5
      };
    }
  });

  // Ejemplo 5: Streaming WebSocket con resource
  wsMessageCount = signal(0);
  
  wsResource = resource({
    loader: (params) => {
      const startCount = this.wsMessageCount();
      return new Promise<string[]>((resolve, reject) => {
        const messages: string[] = [];
        const interval = setInterval(() => {
          messages.push(`Message ${startCount + messages.length + 1}`);
          if (messages.length >= 5) {
            clearInterval(interval);
            resolve(messages);
          }
        }, 1000);

        params.abortSignal.addEventListener('abort', () => {
          clearInterval(interval);
          reject(new Error('Aborted'));
        });
      });
    }
  });

  // Ejemplo 6: Observable con toSignal (alternativa a rxResource)
  private _stockPrice = toSignal(this.bookStore.getStockPriceStream(), { initialValue: 0 as number });
  
  get stockPrice() {
    return this._stockPrice() as number;
  }

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(keyword => {
      this.updateKeyword(keyword);
    });
  }

  // Métodos para interacción
  changeUserId(id: number) {
    this.userId.set(id);
  }

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  selectBook(bookId: number) {
    this.selectedBookId.set(bookId);
  }

  reloadBooks() {
    this.booksResource.reload();
  }

  setLocalBookValue() {
    this.booksResource.set([
      { id: 99, title: 'Local Book', author: 'Manual Entry', price: 19.99 }
    ]);
  }

  changeCategory(categoryId: number) {
    this.categoryId.set(categoryId);
  }

  reloadWebSocket() {
    this.wsMessageCount.update(v => v + 5);
    this.wsResource.reload();
  }

  // Integración del servicio de estado
  get currentKeyword() {
    return this.bookStore.currentKeyword();
  }

  updateKeyword(keyword: string) {
    this.bookStore.updateKeyword(keyword);
  }

  get allBooks() {
    return this.bookStore.allBooksResource.value();
  }

  get allBooksStatus() {
    return this.bookStore.allBooksResource.status();
  }

  searchBooks(keyword: string) {
    this.searchSubject.next(keyword);
  }
}
