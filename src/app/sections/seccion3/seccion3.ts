import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-seccion3',
  imports: [],
  templateUrl: './seccion3.html',
  styleUrl: './seccion3.scss',
})
export class Seccion3 {
  readonly x = signal(10);
  readonly isLarge = signal(false);
  readonly xLarge = computed(() => this.x() > 12);

  increment() {
    this.x.update(x => x + 1);
  }

  constructor() {
    effect(()=>{
      if(this.x() > 12){
        console.log('x is greater than 12');
        this.isLarge.set(true);
        /* this.x.update(x => x + 1); */
      }
    },
    {
      allowSignalWrites: true
    }
  )
  }
}
