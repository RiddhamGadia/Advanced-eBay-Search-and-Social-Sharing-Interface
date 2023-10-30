import { Component } from '@angular/core';
import { ProductinfoService } from 'src/app/Services/productinfo.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  product: any = null;

  constructor(private productService: ProductinfoService) { }

  ngOnInit(): void {
    this.productService.getProductDetails().subscribe((data: any) => {
      if (data && 'Item' in data) {
        this.product = data.Item;
        console.log(this.product);
      } else {
        console.error("Data format incorrect:", data);
        // Handle this scenario accordingly. Maybe show a user-friendly message or retry the request.
      }
    });
  }

}
