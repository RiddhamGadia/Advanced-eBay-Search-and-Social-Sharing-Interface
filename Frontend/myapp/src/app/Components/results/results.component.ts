import { Component } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  icon: string = 'add_shopping_cart';

  toogleIcon(): void {
    if (this.icon === 'add_shopping_cart') {
      this.icon = 'remove_shopping_cart';
    } else {
      this.icon = 'add_shopping_cart';
    }
  }
  performTitleAction(): void {
    // Your logic here when title is clicked
    console.log('Title clicked!');
  }

}
