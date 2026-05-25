import { Injectable, signal, resource } from '@angular/core';
import { Observable, interval, map, take } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {
  // Signal de estado para la palabra clave de búsqueda actual
  currentKeyword = signal('angular');

  // Resource usando el signal de estado
  allBooksResource = resource({
    loader: async () => {
      const keyword = this.currentKeyword();
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const allBooks: Book[] = [
        { id: 1, title: 'Learning Angular', author: 'Sarah Johnson', price: 45.99, category: 'angular' },
        { id: 2, title: 'Angular Patterns', author: 'Mike Chen', price: 52.99, category: 'angular' },
        { id: 3, title: 'TypeScript Deep Dive', author: 'Alex Brown', price: 38.99, category: 'typescript' },
        { id: 4, title: 'RxJS in Action', author: 'Emma Davis', price: 41.99, category: 'rxjs' },
        { id: 5, title: 'Modern Web Development', author: 'Chris Wilson', price: 49.99, category: 'web' },
        { id: 6, title: 'Angular Signals Guide', author: 'Tom Anderson', price: 44.99, category: 'angular' },
      ];

      return allBooks.filter(book => 
        book.title.toLowerCase().includes(keyword.toLowerCase()) ||
        book.category?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  });

  updateKeyword(keyword: string) {
    this.currentKeyword.set(keyword);
  }

  // Simular httpClient con Observable
  getBooksByCategory(categoryId: number): Observable<Book[]> {
    const categories: Record<number, Book[]> = {
      1: [
        { id: 10, title: 'Fiction Masterpieces', author: 'Author A', price: 29.99 },
        { id: 11, title: 'Fantasy Worlds', author: 'Author B', price: 34.99 },
      ],
      2: [
        { id: 20, title: 'Science Explained', author: 'Author C', price: 42.99 },
        { id: 21, title: 'Physics for Everyone', author: 'Author D', price: 39.99 },
      ],
      3: [
        { id: 30, title: 'World History', author: 'Author E', price: 36.99 },
        { id: 31, title: 'Ancient Civilizations', author: 'Author F', price: 41.99 },
      ],
    };

    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(categories[categoryId] || []);
        subscriber.complete();
      }, 500);
    });
  }

  // Simular stream WebSocket con Observable
  getStockPriceStream(): Observable<number> {
    return interval(1500).pipe(
      take(10),
      map(() => 100 + Math.random() * 50)
    );
  }

  // Resource similar a HTTP usando fetch
  createHttpResource<T>(url: string) {
    return resource({
      loader: async (params) => {
        const response = await fetch(url, { signal: params.abortSignal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<T>;
      }
    });
  }
}
