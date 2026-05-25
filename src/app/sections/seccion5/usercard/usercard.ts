import { Component, input } from '@angular/core';

@Component({
  selector: 'app-usercard',
  imports: [],
  templateUrl: './usercard.html',
  styleUrl: './usercard.scss',
})
export class Usercard {

  //SIGNAL INPUTS
  name = input<string>();
  age = input<number>();

  sayHello() {
    console.log("Hola desde componente hijo");
  }
}
