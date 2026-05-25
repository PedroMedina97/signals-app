import { Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usercard } from './usercard/usercard';
import { Counter } from './counter/counter';
import { Table } from './table/table';
import { Panel } from './panel/panel';
import { Highlight } from './highlight/highlight';

@Component({
  selector: 'app-seccion5',
  imports: [Usercard, Counter, Table, Panel, Highlight, RouterLink],
  templateUrl: './seccion5.html',
  styleUrl: './seccion5.scss',
})
export class Seccion5 {
  userName = signal('Juan Pérez');
  userAge = signal(30);
  total = 0;
  inputRef = viewChild<ElementRef>('inputRef');
  totalModel = signal(5);
  card = viewChild(Usercard);
  searchInput = viewChild<ElementRef>('searchInput');

  // Ejemplo de Timing de Child Queries
  alwaysVisible = viewChild<ElementRef>('alwaysVisible');
  conditionalElement = viewChild<ElementRef>('conditionalElement');
  showConditional = signal(false);
  alwaysVisibleStatus = signal('Inicializando...');
  conditionalStatus = signal('No disponible');
  timingLogs = signal<string[]>([]);

  // Ejemplo de contentChild/contentChildren
  showContent = signal(true);

  constructor() {
    // Effect para el input ref
    effect(()=>{
      const input = this.inputRef();

      if(input){
        console.log('Input Disponible');
        input.nativeElement.focus();
      }
    })

    // Effect para monitorear el elemento siempre visible
    effect(() => {
      const element = this.alwaysVisible();
      const timestamp = new Date().toLocaleTimeString();
      
      if (element) {
        this.alwaysVisibleStatus.set('Disponible');
        this.addLog(`[${timestamp}] Elemento siempre visible RESUELTO`);
      } else {
        this.alwaysVisibleStatus.set(' Esperando...');
      }
    });

    // Effect para monitorear el elemento condicional
    effect(() => {
      const element = this.conditionalElement();
      const timestamp = new Date().toLocaleTimeString();
      
      if (element) {
        this.conditionalStatus.set('Disponible');
        this.addLog(`[${timestamp}] Elemento condicional RESUELTO`);
      } else {
        this.conditionalStatus.set(' No disponible (undefined)');
        this.addLog(`[${timestamp}] Elemento condicional NO DISPONIBLE`);
      }
    });

    // Log inicial
    this.addLog(`[${new Date().toLocaleTimeString()}] Constructor ejecutado`);
  }

  addLog(message: string) {
    this.timingLogs.update(logs => [...logs, message]);
  }

  toggleConditional() {
    this.showConditional.update(v => !v);
  }

  toggleContent() {
    this.showContent.update(v => !v);
  }

  callChild(){
    this.card()?.sayHello();
  }

  focusInput(){
    this.searchInput()?.nativeElement.focus();
  }

  onIncrement(count: number) {
    this.total += count;
  }

  changeUser() {
    this.userName.set('María Gómez');
    this.userAge.set(25);
  }
}

