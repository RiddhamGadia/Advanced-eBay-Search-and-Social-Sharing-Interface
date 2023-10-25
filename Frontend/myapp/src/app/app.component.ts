import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteService } from './Services/autocomplete.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchForm!: FormGroup;
  options: string[] = ['One', 'Two', 'Three']; // autocomplete options
  filteredOptions: string[] = []; // filtered options

  constructor(private fb: FormBuilder, private service: AutocompleteService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleZipOptionState(this.searchForm.get('zipOption')?.value);
    this.listenToZipChanges();
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
    this.searchForm.get('zip')?.valueChanges.subscribe(newZipValue  => {
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

  onReset(): void {
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
      zipOption: ['currentlocation'],
    });
    this.filteredOptions = [...this.options];
  }

  // getzipcodes(): string[] {
  //   return this.service.getZipcodeAutoComplete(selectc);
  // }

  getCurrentLocationZip(): string {
    // Mocking the returned ZIP for now. In a real scenario, you'd fetch this using Google's location services or other services.
    console.log('entered')
    return '12345';  
  }
  // onZipOptionChange(event: any) {
  //   if (event.target.value === 'currentlocation') {
  //       this.searchForm.get('zip')?.setValue(this.getCurrentLocationZip());
  //   } else {
  //       // Clear the ZIP if 'other' is selected to allow user input
  //       this.searchForm.get('zip')?.setValue('');
  //   }
  // }
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
  
}