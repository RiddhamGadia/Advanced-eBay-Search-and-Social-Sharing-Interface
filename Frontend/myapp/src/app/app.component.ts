import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  keyword: string = '';
  distance: number = 10;
  categoryId: string = '0';
  conditionStates: any ={
    New: false,
    Used: false,
    Unspecified: false
  };
  shippingOptions: any = {
    localPickup: false,
    freeShipping: false
  };

}
