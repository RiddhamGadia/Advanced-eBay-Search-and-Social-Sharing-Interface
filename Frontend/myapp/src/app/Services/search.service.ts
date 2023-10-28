import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _results = new BehaviorSubject<any>({});  // Using BehaviorSubject to hold results
  public results$ = this._results.asObservable();    // Expose as Observable for components to subscribe

  constructor(private http : HttpClient) { }

  executeSearch(criteria: any) {
    const transformedCriteria = {
      keyword: criteria.keyword,
      buyerpostalcode: criteria.zip,
      maxdistance: criteria.distance,
      freeshipping: criteria.shippingOptions.freeShipping,
      localpickup: criteria.shippingOptions.localPickup,
      condition: this.convertCondition(criteria.conditionStates),
      categoryId: criteria.categoryId
    };
    
    return this.http.get<any>(`http://localhost:3000/search`, { params: transformedCriteria }).pipe(
      tap((data:any) => {
        this._results.next(data); // Update the BehaviorSubject with the new results
      })
    );
  }
  private convertCondition(conditionStates: any): string {
    const conditions = [];
    
    if (conditionStates.New) {
      conditions.push('New');
    }
    if (conditionStates.Used) {
      conditions.push('Used');
    }
    if (conditionStates.Unspecified) {
      conditions.push('Unspecified');
    }
    
    return conditions.join(','); // Convert array to comma-separated string
  }
  setResults(data: any[]) {
    this._results.next(data);
  }

}
