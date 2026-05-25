import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  incremented = output<number>();

  count = 0;

  countModel = model<number>(0);

  increase(){
    this.countModel.update((value) => value + 1);
  }

  decrease(){
    this.countModel.update((value) => value - 1);
  }
  
  increment() {
    this.count++;
    this.incremented.emit(this.count);
  }
}
