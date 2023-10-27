import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from './Services/autocomplete.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchForm!: FormGroup;
  options: string[] = ['One', 'Two', 'Three']; // autocomplete options
  filteredOptions: string[] = []; // filtered options
  currentZip: string = '';

  constructor(private fb: FormBuilder, private service: AutocompleteService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleZipOptionState(this.searchForm.get('zipOption')?.value);
    this.listenToZipChanges();
    this.fetchCurrentLocationZip();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      keyword: ['', Validators.required],
      categoryId: ['0'],
      conditionStates: this.fb.group({
        New: [false],
        Used: [false],
        Unspecified: [false]
      }),
      shippingOptions: this.fb.group({
        localPickup: [false],
        freeShipping: [false]
      }),
      distance: [10], // default value is set to 10
      zip: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      zipOption: ['currentlocation',Validators.required],
    });
    this.searchForm.get('zip')?.valueChanges
    .pipe(
      filter(newZipValue => !!newZipValue) // This will filter out null, undefined, empty string, etc.
    ).subscribe(newZipValue  => {
      this.filterData(newZipValue );
      this.getAutocompleteZip(newZipValue);
    })
  }

  filterData(enteredData: string){
    if(enteredData){
      this.filteredOptions = this.options.filter(item => {
        return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
      })
    }
  }

  onSubmit(): void {
    if(this.searchForm.get('zipOption')?.value === 'currentlocation'){
      this.searchForm.value.zip = this.getCurrentLocationZip();
    }
    console.log(this.searchForm.value);
  }

  onReset(event:any): void {
    event.preventDefault();
    this.searchForm.reset({
      keyword: '',
      categoryId: '0',
      conditionStates: {
        New: false,
        Used: false,
        Unspecified: false
      },
      shippingOptions: {
        localPickup: false,
        freeShipping: false
      },
      distance: 10,
      zip:'',
      zipOption: 'currentlocation',
    });
    this.filteredOptions = [...this.options];
    this.router.navigate(['/']);
  }

  getCurrentLocationZip(): string {
    console.log('Using ZIP from IP:', this.currentZip);
    return this.currentZip;  
  }
  private listenToZipChanges(): void {
    this.searchForm.get('zipOption')?.valueChanges.subscribe((value) => {
      if (value === 'currentlocation') {
        this.searchForm.get('zip')?.setValue('');
        this.searchForm.get('zip')?.disable();
      }
      else if (value === 'other') {
        this.searchForm.get('zip')?.enable();
        this.searchForm.get('zip')?.markAsTouched();
      }
    });
  }
  isZipError(): boolean {
    return this.searchForm.get('zipOption')?.value === 'other' && !this.searchForm.get('zip')?.value;
  }

  getAutocompleteZip(newZipValue: string): void{
    this.service.getZipcodeAutoComplete(newZipValue).subscribe(response => {
      this.options = response;
      this.filteredOptions = response;
    })
  }
  private handleZipOptionState(value: any): void {
    if (value === 'currentlocation') {
      this.searchForm.get('zip')?.setValue('');
      this.searchForm.get('zip')?.disable();
    }
    else if (value === 'other') {
      this.searchForm.get('zip')?.enable();
      this.searchForm.get('zip')?.markAsTouched();
    }
  }
  fetchCurrentLocationZip(): void {
    this.service.getCurrentLocationZip().subscribe(zip1 => {
        this.currentZip = zip1;
    });
}
  
}