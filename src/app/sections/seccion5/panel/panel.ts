import { Component, contentChild, contentChildren, effect, ElementRef, signal } from '@angular/core';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  // contentChild: busca UN elemento proyectado con la referencia 'panelTitle'
  panelTitle = contentChild<ElementRef>('panelTitle');
  
  // contentChildren: busca TODOS los elementos proyectados con la referencia 'panelItem'
  panelItems = contentChildren<ElementRef>('panelItem');
  
  // Signals para mostrar el estado
  titleStatus = signal<string>('No proyectado');
  itemsCount = signal<number>(0);
  contentLogs = signal<string[]>([]);

  constructor() {
    // Effect para monitorear el título proyectado
    effect(() => {
      const title = this.panelTitle();
      const timestamp = new Date().toLocaleTimeString();
      
      if (title) {
        const text = title.nativeElement.textContent;
        this.titleStatus.set(`✅ "${text}"`);
        this.addLog(`[${timestamp}] Título RESUELTO: "${text}"`);
      } else {
        this.titleStatus.set('❌ No encontrado');
        this.addLog(`[${timestamp}] Título NO disponible`);
      }
    });

    // Effect para monitorear los items proyectados
    effect(() => {
      const items = this.panelItems();
      const timestamp = new Date().toLocaleTimeString();
      const count = items.length;
      
      this.itemsCount.set(count);
      
      if (count > 0) {
        this.addLog(`[${timestamp}] Items RESUELTOS: ${count} elementos`);
      } else {
        this.addLog(`[${timestamp}] Items: array vacío`);
      }
    });

    this.addLog(`[${new Date().toLocaleTimeString()}] Panel constructor ejecutado`);
  }

  addLog(message: string) {
    this.contentLogs.update(logs => [...logs, message]);
  }

  // Método para imprimir todos los items en consola
  printItems() {
    const items = this.panelItems();
    console.log('=== ITEMS DEL PANEL ===');
    items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, item.nativeElement.textContent);
    });
  }

  // Método para cambiar el título dinámicamente
  highlightTitle() {
    const title = this.panelTitle();
    if (title) {
      title.nativeElement.style.backgroundColor = '#FFD700';
      title.nativeElement.style.padding = '10px';
      title.nativeElement.style.borderRadius = '5px';
    }
  }
}
