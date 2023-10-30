import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MongodbService } from 'src/app/Services/mongodb.service';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  // icon: string = 'remove_shopping_cart';
  wishlistItems: any[] = [];
  totalPrice: string = '0';

  constructor(private mongodbService: MongodbService,private searchService: SearchService,private router: Router) { }

  ngOnInit(): void {
    this.mongodbService.getAllDocuments().subscribe({
      next: (items: any[]) => {
        this.wishlistItems = items;
        this.getTotalPrice();
      },
      error: (error) => {
        console.error('Error fetching wishlist items:', error);
      }
    });
  }

  removeFromWishlist(item: any): void {
    this.mongodbService.removeFromWishlist(item.itemId[0]);
    this.mongodbService.removeDocument(item.itemId).subscribe({
      next: (response) => {
        console.log('Removed from wishlist:', response);
        const index = this.wishlistItems.findIndex(wishlistItem => wishlistItem.itemId === item.itemId);
        if (index !== -1) {
          this.wishlistItems.splice(index, 1);
          this.getTotalPrice();
        }
      },
      error: (error) => console.error('Error removing from wishlist:', error)
    });
  }

  openImage(url: string): void {
    window.open(url, '_blank');
  }

  truncateTitle(title: string, maxLength: number = 50): string {
    if (title.length <= maxLength) {
      return title;
    }

    let truncated = title.substring(0, maxLength);

    if (title[maxLength] !== ' ') {
      let lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        truncated = truncated.substring(0, lastSpaceIndex);
      }
    }

    return `${truncated}…`;
  }
  getTotalPrice(): void {
    const total = this.wishlistItems.reduce((sum, item) => {
      if (item && item.sellingStatus && Array.isArray(item.sellingStatus) && item.sellingStatus[0] && item.sellingStatus[0].currentPrice && Array.isArray(item.sellingStatus[0].currentPrice)) {
        const priceValue = item.sellingStatus[0].currentPrice[0]?.__value__;
        const price = priceValue ? parseFloat(priceValue) : 0.0;
        return isNaN(price) ? sum : sum + price;
      }
      return sum;
    }, 0.0);
  
    if (Number.isInteger(total)) {
      this.totalPrice = total.toString();
    } else {
      const decimalPlaces = (total.toString().split('.')[1] || []).length;
      this.totalPrice = total.toFixed(decimalPlaces);
    }
  }
  test():void{
    this.router.navigate(['/individual']);
  }
}
