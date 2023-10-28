import { Component } from '@angular/core';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  icon: string = 'add_shopping_cart';
  results: any[] = [];  // To store the results
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.results$.subscribe((items: any[]) => {
      if (Array.isArray(items)) {
          this.results = items.map(item => ({ ...item, isInWishlist: false }));
      } else {
          console.warn('Unexpected data structure:', items);
      }
  });
    
  }

  toogleIcon(item:any):void {
    if(!item.isInWishlist){
      item.isInWishlist = !item.isInWishlist;
      console.log("wishlist",item.isInWishlist);
    }
    else{
      item.isInWishlist = !item.isInWishlist;
      console.log("not wishlist",item.isInWishlist);
    }
   
  }
  
  performTitleAction(itemId:string): void {
    // Your logic here when title is clicked
    console.log('Title clicked!',itemId);
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
  

}
