import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MongodbService } from 'src/app/Services/mongodb.service';
import { ProductinfoService } from 'src/app/Services/productinfo.service';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent {

  progressBarValue: number = 0; // Progress bar value
  showProgressBar: boolean = true;
  item: any = null;

  constructor(private router: Router,private productService: ProductinfoService, private mongodbService: MongodbService){}

  ngOnInit(): void {
    console.log('Individual component loaded');
    this.item = this.productService.getCurrentItem();
    this.oncallperform();
  }

  async oncallperform(): Promise<void> {
    if(!this.productService.detailButtonClicked){
      this.startProgressBar();
      await this.productService.getProductDetails();
      await this.productService.getSimilarItems();
      await this.productService.getProductImages();
    }
    this.stopProgressBar();
    this.router.navigate(['/individual/product']);
  }
  startProgressBar(): void {
    this.showProgressBar = true;
    this.progressBarValue = 50; // You can set this to any initial value or even animate it over time
  }

  stopProgressBar(): void {
    this.showProgressBar = false;
    this.progressBarValue = 0;
  }

  backbutton(): void {
    
    this.router.navigate(['/results']);
  }

  ngOnDestroy(): void {
    this.productService.detailButtonClicked = true;
  }

  toogleIcon(): void {
    console.log('Initial:', this.item.isInWishlist);
    if (!this.item.isInWishlist) {
      // console.log('In the IF block - Before Change:', item.isInWishlist);
      this.item.isInWishlist = !this.item.isInWishlist;
      // console.log('In the IF block - After Change:', item.isInWishlist); // Reflect the changes in the service
      this.mongodbService.updateWishlistItemsSet([this.item]);
      this.mongodbService.addDocument(this.item).subscribe({
        next: ()=>{
          console.log('Document added to wishlist');
        }
      });

    } else {
      // console.log('In the ELSE block - Before Change:', item.isInWishlist);
      this.item.isInWishlist = !this.item.isInWishlist;
      // console.log('In the ELSE block - After Change:', item.isInWishlist);
      this.mongodbService.removeFromWishlist(this.item.itemId[0]);
      this.mongodbService.removeDocument(this.item.itemId[0]).subscribe({
        next:()=>{
          console.log('Document removed from wishlist');
        }
      });
    }
  }


}
