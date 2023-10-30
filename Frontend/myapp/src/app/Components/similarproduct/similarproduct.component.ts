import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductinfoService } from 'src/app/Services/productinfo.service';

@Component({
  selector: 'app-similarproduct',
  templateUrl: './similarproduct.component.html',
  styleUrls: ['./similarproduct.component.css']
})
export class SimilarproductComponent {
  results:any[]=[];
  originalResults: any[] = [];
  sortForm!: FormGroup;
  displayLimit = 10;

  constructor(private productService: ProductinfoService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productService.getSimilarItems().subscribe((data:any)=>{
      console.log(data);
      if(data && data.getSimilarItemsResponse && data.getSimilarItemsResponse.itemRecommendations && data.getSimilarItemsResponse.itemRecommendations.item) {
        this.results = data.getSimilarItemsResponse.itemRecommendations.item;
        this.originalResults = [...this.results];
        console.log(this.results);
      } else {
        console.error("Data format incorrect or no items found:");
      }
    })
    this.sortForm = this.fb.group({
      sortCategory: ['default'],
      sortOrder: {value: 'ascending', disabled: true}
    });
    // Listen for changes to the sortCategory control
    this.sortForm.get('sortCategory')?.valueChanges.subscribe(value => {
      if (value === 'default') {
        this.sortForm.get('sortOrder')?.disable();
      } else {
        this.sortForm.get('sortOrder')?.enable();
      }
    });
  }
  getDaysFromTimeLeft(timeLeft: string): number {
    if (typeof timeLeft !== 'string') return 0;
    const startIdx = timeLeft.indexOf('P') + 1;
    const endIdx = timeLeft.indexOf('D');
    const days = timeLeft.substring(startIdx, endIdx);
    return days ? parseInt(days, 10) : 0;
  }

  sortResults(): void {
    console.log('valled');
    const sortCategory = this.sortForm.get('sortCategory')?.value;
    const sortOrder = this.sortForm.get('sortOrder')?.value;

    if (sortCategory === 'default') {
      // Restore original order
      this.results = [...this.originalResults];
      return;
    }

    // Define the getValue function based on sortCategory
    let getValue = (product: any) => product[sortCategory];
    if (sortCategory === 'title') {
      getValue = (product: any) => product.title;
    } 
    else if (sortCategory === 'buyItNowPrice') {
      getValue = (product: any) => parseFloat(product.buyItNowPrice.__value__);
    } 
    else if (sortCategory === 'shippingCost') {
      getValue = (product: any) => parseFloat(product.shippingCost.__value__);
    }
    else if (sortCategory === 'daysLeft') {
      getValue = (product: any) => this.getDaysFromTimeLeft(product.timeLeft);
    }

    // Sort based on sortCategory and sortOrder
    this.results.sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);

      if (sortOrder === 'ascending') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
      return 0;
    });
  }
  toggleDisplayLimit() {
    if (this.displayLimit === 10) {
      this.displayLimit = this.results.length; // Show all results
    } else {
      this.displayLimit = 10; // Show only first 10 results
    }
  }
}
