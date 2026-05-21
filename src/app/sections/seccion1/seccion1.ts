import { ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'app-seccion1',
  imports: [],
  templateUrl: './seccion1.html',
  styleUrl: './seccion1.scss',
})
export class Seccion1 {

  counter = 0;

  readonly changeDetector = inject(ChangeDetectorRef);

  ngOnInit() {
    console.log('App initialized');
  }

  doNothing() {
    console.log('Doing nothing');
  }

  constructor(){
    setInterval(() => {
      this.counter++;
      console.log('COUNTER: ', this.counter);
    }, 1000);

    setInterval(() => {
      this.changeDetector.detectChanges();
    }, 5000);
  }

  setCounter(value: number) {
    this.counter = value;
  }
}
