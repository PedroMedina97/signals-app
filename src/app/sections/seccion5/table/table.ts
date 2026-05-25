import { Component, ElementRef, viewChildren } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  items = viewChildren<ElementRef>('item');

  printItems() {

  this.items().forEach(item => {

    console.log(
      item.nativeElement.textContent
    );

  });

}
}
