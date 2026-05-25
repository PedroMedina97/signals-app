import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-highlight',
  imports: [],
  templateUrl: './highlight.html',
  styleUrl: './highlight.scss',
  // HOST: Reemplaza @HostBinding y @HostListener
  host: {
    // Host Bindings: vinculan propiedades/atributos del host
    '[class.active]': 'isActive()',
    '[class.highlighted]': 'isHighlighted()',
    '[attr.data-clicks]': 'clickCount()',
    '[style.background-color]': 'backgroundColor()',
    '[style.padding]': '"20px"',
    '[style.border-radius]': '"8px"',
    '[style.transition]': '"all 0.3s ease"',
    '[style.cursor]': '"pointer"',
    
    // Host Listeners: escuchan eventos del host
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(dblclick)': 'onDoubleClick()',
  }
})
export class Highlight {
  // Signals para el estado del componente
  isActive = signal(false);
  isHighlighted = signal(false);
  clickCount = signal(0);
  mouseEnterCount = signal(0);
  eventLogs = signal<string[]>([]);

  // Computed signal para el color de fondo
  backgroundColor = computed(() => {
    if (this.isActive()) return '#4CAF50';
    if (this.isHighlighted()) return '#FFC107';
    return '#E0E0E0';
  });

  // Computed signal para el estado legible
  statusText = computed(() => {
    if (this.isActive() && this.isHighlighted()) return 'Activo y Resaltado';
    if (this.isActive()) return 'Activo';
    if (this.isHighlighted()) return 'Resaltado';
    return 'Inactivo';
  });

  constructor() {
    // Effect para loggear cambios de estado
    effect(() => {
      const status = this.statusText();
      console.log('Estado del highlight:', status);
    });

    this.addLog('Componente inicializado');
  }

  // Host Listener: Click
  onClick() {
    this.clickCount.update(count => count + 1);
    this.isActive.update(active => !active);
    this.addLog(`Click #${this.clickCount()} - Estado: ${this.isActive() ? 'Activo' : 'Inactivo'}`);
  }

  // Host Listener: Mouse Enter
  onMouseEnter() {
    this.mouseEnterCount.update(count => count + 1);
    this.isHighlighted.set(true);
    this.addLog(`Mouse Enter #${this.mouseEnterCount()}`);
  }

  // Host Listener: Mouse Leave
  onMouseLeave() {
    this.isHighlighted.set(false);
    this.addLog('Mouse Leave');
  }

  // Host Listener: Double Click
  onDoubleClick() {
    this.reset();
    this.addLog('Reset por doble click');
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLogs.update(logs => [...logs, `[${timestamp}] ${message}`].slice(-10)); // Mantener últimos 10
  }

  reset() {
    this.isActive.set(false);
    this.isHighlighted.set(false);
    this.clickCount.set(0);
    this.mouseEnterCount.set(0);
    this.eventLogs.set([]);
  }
}
