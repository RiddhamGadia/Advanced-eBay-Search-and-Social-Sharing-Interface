import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductinfoService {

  private _itemId: string  | null = "404568857199"; //chagne this to null

  private _productTitle: string | null = "iphone";

  constructor(private http: HttpClient) { }

  // method to get the itemId
  getItemId(): string | null {
    return this._itemId;
  }

  // method to set the itemId
  setItemId(itemId: string): void {
    this._itemId = itemId;
  }

  getProductDetails() {
    const itemId = this.getItemId();
    if (!itemId) {
      throw new Error("Item ID is not available");
      }
    return this.http.get(`http://localhost:3000/product`, {
      params: {
        itemid: itemId
      }
    });
  }
  getSimilarItems() {
    const itemId = this.getItemId();
    if (!itemId) {
      throw new Error("Item ID is not available");
    }
    return this.http.get(`http://localhost:3000/getSimilarItems`, {
      params: {
        itemId: itemId
      }
    });
  }
  getProductImages(){
    const productTitle = this.getProductTitle(); 
    if (!productTitle) {
      throw new Error("Product Title is not available");
    }
    return this.http.get(`http://localhost:3000/getProductImages`, {
      params: {
        productTitle: productTitle
      }
    });
  }
  // Getter method for productTitle
  getProductTitle(): string | null {
    return this._productTitle;
  }

  // Setter method for productTitle
  setProductTitle(productTitle: string): void {
    this._productTitle = productTitle;
  }

}
