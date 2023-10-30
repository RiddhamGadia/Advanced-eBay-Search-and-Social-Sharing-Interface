import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductinfoService } from 'src/app/Services/productinfo.service';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent {

  progressBarValue: number = 0; // Progress bar value
  showProgressBar: boolean = true;

  constructor(private router: Router,private productService: ProductinfoService){}

  ngOnInit(): void {
    console.log('Individual component loaded');
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

}
