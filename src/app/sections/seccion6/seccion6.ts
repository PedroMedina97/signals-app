import { Component } from '@angular/core';
import { CartRxjs } from './cart-rxjs/cart-rxjs';
import { CartSignal } from './cart-signal/cart-signal';

@Component({
  selector: 'app-seccion6',
  imports: [CartRxjs, CartSignal],
  templateUrl: './seccion6.html',
  styleUrl: './seccion6.scss',
})
export class Seccion6 {}
