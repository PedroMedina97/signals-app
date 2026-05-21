import { Component } from '@angular/core';
import { Counter } from './counter/counter';

@Component({
  selector: 'app-seccion2',
  imports: [Counter],
  templateUrl: './seccion2.html',
  styleUrl: './seccion2.scss',
})
export class Seccion2 {
  showCounter = false;

  toggleCounter() {
    this.showCounter = !this.showCounter;
  }
}
