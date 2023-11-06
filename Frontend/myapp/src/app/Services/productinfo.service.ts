import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductinfoService {

  private _itemId: string  | null = ""; //chagne this to null

  private _productTitle: string | null = "";

  private _currentItem: any = null;

  private _productDetail = new BehaviorSubject<any>(null);  // Using BehaviorSubject to hold the product details
  public productDetail$ = this._productDetail.asObservable();

  private _productDetailWishlist = new BehaviorSubject<any>(null);  // Using BehaviorSubject to hold the product details
  public productDetailWishlist$ = this._productDetailWishlist.asObservable();

  private _similarItems = new BehaviorSubject<any[]>([]);  // Using BehaviorSubject to hold similar items
  public similarItems$ = this._similarItems.asObservable();  // Expose as Observable for components to subscribe

  private _similarItemsWishlist = new BehaviorSubject<any[]>([]);  // Using BehaviorSubject to hold similar items
  public similarItemsWishlist$ = this._similarItemsWishlist.asObservable();  // Expose as Observable for components to subscribe

  private _productImages = new BehaviorSubject<any[]>([]);  // Using BehaviorSubject to hold product images
  public productImages$ = this._productImages.asObservable();

  private _productImagesWishlist = new BehaviorSubject<any[]>([]);  // Using BehaviorSubject to hold product images
  public productImagesWishlist$ = this._productImagesWishlist.asObservable();

  public detailButtonClickedResult: boolean = false;

  public detailButtonClickedWishlist: boolean = false;

  public currentPage: string = "";

  private _wishlistItemId: string | null = "";
  private _wishlistItem: any = null;
  private _wishlistProductTitle: string | null = null;

  public facebookItemResults: any = null;
  public facebookItemWishlist: any = null;

  public isActive: boolean = true;

  constructor(private http: HttpClient) { }

  getwishlistProductTitle(): string | null {
    return this._wishlistProductTitle;
  }

  setwishlistProductTitle(value: string | null) {
    this._wishlistProductTitle = value;
  }

  // Getter and Setter for _wishlistItemId
  getwishlistItemId(): string | null {
    return this._wishlistItemId;
  }

  setwishlistItemId(value: string | null) {
    this._wishlistItemId = value;
  }

  // Getter and Setter for _wishlistItem
  getwishlistItem(): any {
    return this._wishlistItem;
  }

  setwishlistItem(value: any) {
    this._wishlistItem = value;
  }

  getCurrentItem(): any {
    return this._currentItem;
  }

  // method to set the current item
  setCurrentItem(item: any): void {
    this._currentItem = item;
  }

  // method to get the itemId
  getItemId(): string | null {
    return this._itemId;
  }

  // method to set the itemId
  setItemId(itemId: string): void {
    this._itemId = itemId;
  }

  getProductDetails(): Promise<void> {
    const itemId = this.getItemId();
    if (!itemId) {
      return Promise.reject(new Error("Item ID is not available"));  // Reject the promise with an error
    }
    
    return new Promise<void>((resolve, reject) => {
      this.http.get(`http://localhost:3000/product`, { params: { itemid: itemId } }).subscribe(
        data => {
          if (data) {  // Assuming there will be some structure to verify here
            this._productDetail.next(data);  // Update the BehaviorSubject with the new product detail
            resolve();  // Resolve the promise
          } else {
            this._productDetail.next(null);  // Update the BehaviorSubject with null
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
    });
  }
  getProductDetailsWishlist(): Promise<void> {
    const itemId = this.getwishlistItemId();
    console.log('In wishlist',itemId);
    if (!itemId) {
      return Promise.reject(new Error("Item ID is not available"));  // Reject the promise with an error
    }
    
    return new Promise<void>((resolve, reject) => {
      this.http.get(`http://localhost:3000/product`, { params: { itemid: itemId } }).subscribe(
        data => {
          if (data) {  // Assuming there will be some structure to verify here
            this._productDetailWishlist.next(data);  // Update the BehaviorSubject with the new product detail
            resolve();  // Resolve the promise
          } else {
            this._productDetailWishlist.next(null);  // Update the BehaviorSubject with null
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
    });
  }
  getSimilarItems(): Promise<void> {
    const itemId = this.getItemId();
    if (!itemId) {
      return Promise.reject(new Error("Item ID is not available"));  // Reject the promise with an error
    }
    
    return new Promise<void>((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/getSimilarItems`, { params: { itemId: itemId } }).subscribe(
        data => {
          if (data) {  // Check if data is an array (assuming similar items come as an array)
            this._similarItems.next(data);  // Update the BehaviorSubject with the new list of similar items
            resolve();  // Resolve the promise
          } else {
            console.log("data is null");
            this._similarItems.next([]);  // Update the BehaviorSubject with empty results
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
    });
  }
  getSimilarItemsWishlist(): Promise<void> {
    const itemId = this.getwishlistItemId();;
    if (!itemId) {
      return Promise.reject(new Error("Item ID is not available"));  // Reject the promise with an error
    }
    
    return new Promise<void>((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/getSimilarItems`, { params: { itemId: itemId } }).subscribe(
        data => {
          if (data) {  // Check if data is an array (assuming similar items come as an array)
            this._similarItemsWishlist.next(data);  // Update the BehaviorSubject with the new list of similar items
            resolve();  // Resolve the promise
          } else {
            console.log("data is null");
            this._similarItemsWishlist.next([]);  // Update the BehaviorSubject with empty results
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
    });
  }
  getProductImages(): Promise<void> {
    const productTitle = this.getProductTitle(); 
    if (!productTitle) {
      return Promise.reject(new Error("Product Title is not available"));
    }
    return new Promise<void>((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/getProductImages`, { params: { productTitle: productTitle } }).subscribe(
        data => {
          if (data && Array.isArray(data)) {  // Check if data is an array (assuming images come as an array or similar structure)
            this._productImages.next(data);  // Update the BehaviorSubject with the new list of product images
            resolve();  // Resolve the promise
          } else {
            this._productImages.next([]);  // Update the BehaviorSubject with empty results
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
    });
  }
  getProductImagesWishlist(): Promise<void> {
    const productTitle = this.getwishlistProductTitle(); 
    if (!productTitle) {
      return Promise.reject(new Error("Product Title is not available"));
    }
    return new Promise<void>((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:3000/getProductImages`, { params: { productTitle: productTitle } }).subscribe(
        data => {
          if (data && Array.isArray(data)) {  // Check if data is an array (assuming images come as an array or similar structure)
            this._productImagesWishlist.next(data);  // Update the BehaviorSubject with the new list of product images
            resolve();  // Resolve the promise
          } else {
            this._productImagesWishlist.next([]);  // Update the BehaviorSubject with empty results
            resolve();  // Resolve the promise even if data structure is not as expected
          }
        }
      );
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
